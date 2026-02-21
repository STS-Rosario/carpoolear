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

const users = ref({});
const usersData = ref({});
const usersOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: t('chartUsuariosRegistradosPorMes')
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
                }
            }
        ]
    }
});

watch(() => props.minDate, () => {
    usersData.value = processUsers(
        users.value,
        props.minDate,
        props.maxDate
    );
});

watch(() => props.maxDate, () => {
    usersData.value = processUsers(
        users.value,
        props.minDate,
        props.maxDate
    );
});

function processUsers(usuarios, minDate, maxDate) {
    let labels = [];
    let datasetTotales = [];
    let total = 0;
    usuarios.forEach(function (el) {
        if (el.key <= maxDate && el.key >= minDate) {
            labels.push(el.key);
            total += el.cantidad;
            datasetTotales.push(total);
        }
    });
    return {
        labels: labels,
        datasets: [
            {
                label: t('chartUsuarios'),
                backgroundColor: '#0F0',
                borderColor: '#0F0',
                data: datasetTotales,
                fill: false
            }
        ]
    };
}

async function loadData() {
    let result = await adminStore.getUserStats();
    users.value = result.users;
    usersData.value = processUsers(
        users.value,
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
