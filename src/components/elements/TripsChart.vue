<template>
    <div class="card column">
        <LineChart
            class="chart"
            :chartdata="viajesData"
            :options="viajesOptions"
        ></LineChart>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import LineChart from './LineChart';
import moment from 'moment';

const { t } = useI18n();
const adminStore = useAdminStore();

const props = defineProps({
    minDate: {
        default: moment(Date(new Date().getFullYear(), 0, 1), 'YYYY-MM')
    },
    maxDate: {
        default: moment(Date(), 'YYYY-MM')
    }
});

const viajes = ref({});
const viajesData = ref({});
const viajesOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: t('chartViajesDeConductoresEnLaPlataforma')
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
                    labelString: t('chartMes')
                }
            }
        ],
        yAxes: [
            {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: t('chartCantidad')
                }
            }
        ]
    }
});

watch(() => props.minDate, () => {
    viajesData.value = processTrips(
        viajes.value,
        props.minDate,
        props.maxDate
    );
});

watch(() => props.maxDate, () => {
    viajesData.value = processTrips(
        viajes.value,
        props.minDate,
        props.maxDate
    );
});

function processTrips(viajesArr, minDate, maxDate) {
    let etiquetas = [];
    let datos = [];
    if (viajesArr) {
        let arr = viajesArr.sort(function (a, b) {
            if (a.key < b.key) {
                return -1;
            }
            if (a.key > b.key) {
                return 1;
            }
            return 0;
        });
        for (let index = 0; index < arr.length; index++) {
            let element = viajesArr[index];
            if (element.key <= maxDate && element.key >= minDate) {
                etiquetas.push(element.key);
                datos.push(element.cantidad);
            }
        }
        return {
            labels: etiquetas,
            datasets: [
                {
                    label: t('chartCantidadDeViajes'),
                    backgroundColor: '#F00',
                    borderColor: '#F00',
                    data: datos,
                    fill: false
                }
            ]
        };
    }
}

async function loadData() {
    let result = await adminStore.getTrips();
    viajes.value = result.trips;
    viajesData.value = processTrips(
        viajes.value,
        props.minDate,
        props.maxDate
    );
}

onMounted(() => {
    loadData();
});
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
