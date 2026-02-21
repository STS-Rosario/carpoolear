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
                label: t('chartUsuarios'),
                backgroundColor: '#F00',
                borderColor: '#F00',
                data: dataset,
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
    height: 45vh;
}
.chart {
    height: 45vh;
}
</style>
