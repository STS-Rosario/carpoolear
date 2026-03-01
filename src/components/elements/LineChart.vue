<template>
    <Line
        v-if="chartdata"
        :chart-data="chartdata"
        :chart-options="convertedOptions"
    />
</template>

<script>
import { Line } from 'vue-chartjs';
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

Chart.register(
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

function convertAxis(axis) {
    var result = Object.assign({}, axis);
    if (result.scaleLabel) {
        result.title = {
            display: result.scaleLabel.display,
            text: result.scaleLabel.labelString
        };
        delete result.scaleLabel;
    }
    return result;
}

function adaptV2Options(opts) {
    if (!opts) return opts;
    var result = Object.assign({}, opts);

    result.plugins = Object.assign({}, result.plugins);
    if (result.title) {
        result.plugins.title = result.title;
        delete result.title;
    }
    if (result.tooltips) {
        result.plugins.tooltip = result.tooltips;
        delete result.tooltips;
    }

    if (result.scales) {
        var newScales = {};
        if (result.scales.xAxes && result.scales.xAxes[0]) {
            newScales.x = convertAxis(result.scales.xAxes[0]);
        }
        if (result.scales.yAxes && result.scales.yAxes[0]) {
            newScales.y = convertAxis(result.scales.yAxes[0]);
        }
        result.scales = newScales;
    }

    return result;
}

export default {
    name: 'linechart',
    components: { Line },
    props: ['chartdata', 'options'],
    computed: {
        convertedOptions: function () {
            return adaptV2Options(this.options);
        }
    }
};
</script>

<style></style>
