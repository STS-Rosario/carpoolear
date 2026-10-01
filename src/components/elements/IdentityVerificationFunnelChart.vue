<template>
    <div class="ivr-chart">
        <Doughnut :chart-data="chartData" :chart-options="chartOptions" :styles="chartStyles" />
    </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart, ArcElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Title, Tooltip, Legend);

export default {
    name: 'identity-verification-funnel-chart',
    components: { Doughnut },
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
    data() {
        return {
            // vue-chartjs wraps the canvas in a div; let it take the height of .ivr-chart.
            chartStyles: { position: 'relative', height: '100%' }
        };
    },
    computed: {
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: Boolean(this.title), text: this.title },
                    legend: { position: 'bottom' }
                }
            };
        }
    }
};
</script>

<style scoped>
.ivr-chart {
    position: relative;
    height: 320px;
}
</style>
