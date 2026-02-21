<template>
    <div class="card">
        <LineChart
            class="chart"
            v-if="asientosData"
            :chartdata="asientosData"
            :options="asientosOptions"
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

const asientos = ref({});
const viajes = ref({});
const asientosData = ref({});
const asientosOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: t('chartAsientos')
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
                },
                stacked: true
            }
        ],
        yAxes: [
            {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: t('chartCantidad')
                },
                stacked: true
            }
        ]
    }
});

watch(() => props.minDate, () => {
    asientosData.value = processTrips(
        viajes.value,
        asientos.value,
        props.minDate,
        props.maxDate
    );
});

watch(() => props.maxDate, () => {
    asientosData.value = processTrips(
        viajes.value,
        asientos.value,
        props.minDate,
        props.maxDate
    );
});

function processTrips(viajesArr, asientosArr, minDate, maxDate) {
    let etiquetas = [];
    let datos = [];
    let ocupados = [];
    let desocupados = [];
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
                for (let i = 0; i < asientosArr.length; i++) {
                    let solicitud = asientosArr[i];
                    if (
                        solicitud.key === element.key &&
                        solicitud.state === 1
                    ) {
                        ocupados.push(solicitud.cantidad);
                        desocupados.push(
                            parseFloat(
                                element.asientos_ofrecidos_total
                            ) - solicitud.cantidad
                        );
                        break;
                    }
                }
                etiquetas.push(element.key);
                datos.push(element.cantidad);
            }
        }
        return {
            labels: etiquetas,
            datasets: [
                {
                    label: t('chartOcupados'),
                    borderColor: 'blue',
                    data: ocupados,
                    backgroundColor: 'rgb(0, 0, 255, 0.5)',
                    fill: true
                },
                {
                    label: t('chartNoOcupados'),
                    backgroundColor: 'rgb(255, 0, 0, 0.5)',
                    borderColor: '#F00',
                    data: desocupados,
                    fill: true
                }
            ]
        };
    }
}

async function loadData() {
    let tripsResult = await adminStore.getTrips();
    let seatsResult = await adminStore.getSeats();
    viajes.value = tripsResult.trips;
    asientos.value = seatsResult.seats;
    asientosData.value = processTrips(
        viajes.value,
        asientos.value,
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
    height: 45vh;
}
.chart {
    height: 45vh;
}
</style>
