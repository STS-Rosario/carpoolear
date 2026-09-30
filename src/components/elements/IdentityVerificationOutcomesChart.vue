<template>
    <div class="ivr-chart">
        <Bar :chart-data="chartData" :chart-options="chartOptions" />
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default {
    name: 'identity-verification-outcomes-chart',
    components: { Bar },
    props: {
        chartData: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: Boolean(this.title), text: this.title },
                    tooltip: { mode: 'index', intersect: false },
                    legend: { position: 'bottom' }
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
                }
            };
        }
    }
};
</script>

<style scoped>
.ivr-chart {
    position: relative;
    height: 300px;
}
</style>
