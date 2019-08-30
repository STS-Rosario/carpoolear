<template>
    <div class="card">
        <LineChart class="chart" v-if="asientosData"  :chartdata="asientosData" :options="asientosOptions"></LineChart>
    </div>
</template>

<script>
import LineChart from './LineChart';
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
    name: 'seats-chart',
    props: {
        minDate: {
            default: moment(Date(new Date().getFullYear(), 0, 1)).format('YYYY-MM')
        },
        maxDate: {
            default: moment(Date()).format('YYYY-MM')
        }
    },
    data () {
        return {
            asientos: {},
            viajes: {},
            asientosData: {},
            asientosOptions: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Asientos'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Mes'
                        },
                        stacked: true
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Cantidad'
                        },
                        stacked: true
                    }]
                }
            }
        };
    },
    watch: {
        'minDate': function () {
            this.asientosData = this.processTrips(this.viajes, this.asientos, this.minDate, this.maxDate);
        },
        'maxDate': function () {
            this.asientosData = this.processTrips(this.viajes, this.asientos, this.minDate, this.maxDate);
        }
    },
    methods: {
        ...mapActions({
            getTrips: 'admin/getTrips',
            getSeats: 'admin/getSeats'
        }),
        processTrips (viajes, asientos, minDate, maxDate) {
            let etiquetas = [];
            let datos = [];
            let ocupados = [];
            let desocupados = [];
            if (viajes) {
                let arr = viajes.sort(function (a, b) {
                    if (a.key < b.key) {
                        return -1;
                    }
                    if (a.key > b.key) {
                        return 1;
                    }
                    return 0;
                });
                for (let index = 0; index < arr.length; index++) {
                    let element = viajes[index];
                    if (element.key <= maxDate && element.key >= minDate) {
                        for (let i = 0; i < asientos.length; i++) {
                            let solicitud = asientos[i];
                            if (solicitud.key === element.key && solicitud.state === 1) {
                                ocupados.push(solicitud.cantidad);
                                desocupados.push(parseFloat(element.asientos_ofrecidos_total) - solicitud.cantidad);
                                break;
                            }
                        }
                        etiquetas.push(element.key);
                        datos.push(element.cantidad);
                    }
                }
                return {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Ocupados',
                        borderColor: 'blue',
                        data: ocupados,
                        backgroundColor: 'rgb(0, 0, 255, 0.5)',
                        fill: true
                    }, {
                        label: 'No ocupados',
                        backgroundColor: 'rgb(255, 0, 0, 0.5)',
                        borderColor: '#F00',
                        data: desocupados,
                        fill: true
                    }]
                };
            }
        },
        async loadData () {
            this.viajes = await this.getTrips();
            this.asientos = await this.getSeats();
            this.viajes = this.viajes.trips;
            this.asientos = this.asientos.seats;
            this.asientosData = this.processTrips(this.viajes, this.asientos, this.minDate, this.maxDate);
        }
    },
    components: {
        LineChart
    },
    mounted () {
        this.loadData();
    }
};
</script>

<style scoped>
.card {
    background-color: #fff;
    border-radius: 2px;
    height: 45vh;
}
.chart {
    height: 45vh;
}
</style>
