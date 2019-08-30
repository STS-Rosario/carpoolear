<template>
    <div class="card column">
        <LineChart class="chart" :chartdata="viajesData" :options="viajesOptions"></LineChart>
    </div>
</template>

<script>
import LineChart from './LineChart';
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
    name: 'trips-chart',
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
            viajes: {},
            viajesData: {},
            viajesOptions: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Viajes de conductores en la plataforma'
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
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Cantidad'
                        }
                    }]
                }
            }
        };
    },
    watch: {
        'minDate': function () {
            this.viajesData = this.processTrips(this.viajes, this.minDate, this.maxDate);
        },
        'maxDate': function () {
            this.viajesData = this.processTrips(this.viajes, this.minDate, this.maxDate);
        }
    },
    methods: {
        ...mapActions({
            getTrips: 'admin/getTrips'
        }),
        processTrips (viajes, minDate, maxDate) {
            let etiquetas = [];
            let datos = [];
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
                        etiquetas.push(element.key);
                        datos.push(element.cantidad);
                    }
                }
                return {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Cantidad de viajes',
                        backgroundColor: '#F00',
                        borderColor: '#F00',
                        data: datos,
                        fill: false
                    }]
                };
            }
        },
        async loadData () {
            let viajes = await this.getTrips();
            this.viajes = viajes.trips;
            this.viajesData = this.processTrips(this.viajes, this.minDate, this.maxDate);
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
}
.chart {
    height: 45vh;
}
</style>
