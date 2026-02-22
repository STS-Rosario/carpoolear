<template>
    <div class="col-md-16 col-md-offset-4 transactions-container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">{{ t('fecha') }}</th>
                    <th scope="col">{{ t('descripcion') }}</th>
                    <th scope="col">{{ t('monto') }}</th>
                    <th scope="col">{{ t('estado') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="transaction in transactions"
                    v-bind:key="transaction.id"
                >
                    <td>
                        <span class="th visible-xs">{{ t('fecha') }}</span>
                        {{ formatDate(transaction.created_at, 'DD/MM/YYYY') }}
                    </td>
                    <td>
                        <span class="th visible-xs">{{
                            t('descripcion')
                        }}</span>
                        {{ generateDescription(transaction) }}
                    </td>
                    <td>
                        <span class="th visible-xs">{{ t('monto') }}</span>
                        {{ $n(transaction.trip.seat_price_cents / 100, 'currency') }}
                    </td>
                    <td>
                        <span class="th visible-xs">{{ t('estado') }}</span>
                        {{ generateStatus(transaction) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { usePassengerStore } from '@/stores/passenger';
import { formatDate } from '@/composables/useFormatters';
import bus from '../../services/bus-event.js';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const passengerStore = usePassengerStore();

const transactions = ref([]);

const user = computed(() => authStore.user);

const onBackClick = () => {
    router.back();
};

onMounted(() => {
    bus.on('back-click', onBackClick);
    passengerStore.transactions().then((data) => {
        console.log('transaction data', data);
        transactions.value = data;
    });
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});

const generateDescription = (transaction) => {
    if (transaction.user_id === user.value.id) {
        return t('fuistePasajero', [
            transaction.trip.user.name,
            transaction.trip.to_town
        ]);
    } else {
        return t('llevastePasajero', [
            transaction.user.name,
            transaction.trip.to_town
        ]);
    }
};

const generateStatus = (transaction) => {
    if (transaction.payment_status === 'ok') {
        if (
            transaction.payment_info &&
            transaction.payment_info.cardDetail &&
            transaction.user_id === user.value.id
        ) {
            return t('transaccionOkConTarjeta', [
                transaction.payment_info.cardDetail.cardNumber
            ]);
        }
        return t('transaccionOk');
    } else {
        return t('transaccionNoCompletada');
    }
};
</script>
<style scoped>
table th {
    text-transform: capitalize;
}
@media only screen and (max-width: 768px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
        display: block;
    }
    thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }
    tr {
        border: 1px solid #ccc;
        margin: 0.5em 0;
    }
    td {
        border: none;
        position: relative;
        padding-left: 200px;
        margin-left: 150px;
    }
    td .th {
        text-transform: capitalize;
        position: absolute;
        top: 8px;
        left: 6px;
        width: 200px;
        padding-right: 40px;
        white-space: nowrap;
        margin-left: -150px;
        font-weight: bold;
    }
    .table > tbody > tr > td {
        border: 0;
    }
}
</style>
