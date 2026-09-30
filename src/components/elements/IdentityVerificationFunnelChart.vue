<template>
    <div class="ivr-chart">
        <Doughnut :chart-data="chartData" :chart-options="chartOptions" />
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
    computed: {
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: Boolean(this.title), text: this.title },
                    legend: { position: 'right' }
                }
            };
        }
    }
};
</script>

<style scoped>
.ivr-chart {
    position: relative;
    height: 280px;
}
</style>
