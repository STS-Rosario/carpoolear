<script>
import { Line } from 'vue-chartjs';

export default {
    name: 'linechart',
    extends: Line,
    props: ['chartdata', 'options'],
    computed: {
        chartInfo: function () {
            return this.chartdata;
        }
    },
    watch: {
        chartInfo: function () {
            this.renderChart(this.chartInfo, this.options);
        }
    },
    mounted () {
        this.renderChart(this.chartInfo, this.options);
    }
};
</script>

<style>
</style>