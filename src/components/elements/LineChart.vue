<template>
    <Line v-if="chartdata" :data="chartdata" :options="options" />
</template>

<script setup>
import { computed, watch, toRefs } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps({
    chartdata: {
        type: Object,
        default: null
    },
    options: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style></style>
