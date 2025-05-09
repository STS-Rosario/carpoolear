<template>
    <div class="card">
        <LineChart
            class="chart"
            v-if="usersData"
            :chartdata="usersData"
            :options="usersOptions"
        ></LineChart>
    </div>
</template>

<script>
import LineChart from './LineChart';
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
    name: 'monthly-users-chart',
    props: {
        minDate: {
            default: moment(Date(new Date().getFullYear(), 0, 1), 'YYYY-MM')
        },
        maxDate: {
            default: moment(Date(), 'YYYY-MM')
        }
    },
    data() {
        return {
            users: {},
            usersData: {},
            usersOptions: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Usuarios registrados por mes'
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
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Mes'
                            },
                            stacked: true
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Cantidad'
                            }
                        }
                    ]
                }
            }
        };
    },
    watch: {
        minDate: function () {
            this.usersData = this.processUsers(
                this.users,
                this.minDate,
                this.maxDate
            );
        },
        maxDate: function () {
            this.usersData = this.processUsers(
                this.users,
                this.minDate,
                this.maxDate
            );
        }
    },
    methods: {
        ...mapActions({
            getUsers: 'admin/getUserStats'
        }),
        processUsers(usuarios, minDate, maxDate) {
            let labels = [];
            let dataset = [];
            usuarios.forEach(function (el) {
                if (el.key <= maxDate && el.key >= minDate) {
                    labels.push(el.key);
                    dataset.push(el.cantidad);
                }
            });
            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Usuarios',
                        backgroundColor: '#F00',
                        borderColor: '#F00',
                        data: dataset,
                        fill: false
                    }
                ]
            };
        },
        async loadData() {
            this.users = await this.getUsers();
            this.users = this.users.users;
            this.usersData = this.processUsers(
                this.users,
                this.minDate,
                this.maxDate
            );
        }
    },
    components: {
        LineChart
    },
    mounted() {
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
