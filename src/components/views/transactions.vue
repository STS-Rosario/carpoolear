<template>
    <div class="col-md-16 col-md-offset-4 transactions-container ">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">{{ $t('fecha') }}</th>
              <th scope="col">{{ $t('descripcion') }}</th>
              <th scope="col">{{ $t('monto') }}</th>
              <th scope="col">{{ $t('estado') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" v-bind:key="transaction.id">
                <td>
                    <span class="th visible-xs">{{ $t('fecha') }}</span>
                    {{ transaction.created_at | moment("DD/MM/YYYY") }}
                </td>
                <td>
                    <span class="th visible-xs">{{ $t('descripcion') }}</span>
                    {{ generateDescription(transaction) }}
                </td>
                <td>
                    <span class="th visible-xs">{{ $t('monto') }}</span>
                    {{ $n(transaction.trip.seat_price, 'currency') }}
                </td>
                <td>
                    <span class="th visible-xs">{{ $t('estado') }}</span>
                    {{ generateStatus(transaction) }}
                </td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script>
import bus from '../../services/bus-event.js';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'transacciones',
    data () {
        return {
            transactions: []
        };
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    mounted () {
        this.history().then(data => {
            console.log('transaction data', data);
            this.transactions = data;
        });
    },

    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },

    methods: {
        ...mapActions({
            history: 'passenger/transactions'
        }),
        onBackClick () {
            this.$router.back();
        },
        generateDescription (transaction) {
            if (transaction.user_id === this.user.id) {
                return this.$t('fuistePasajero', [transaction.trip.user.name, transaction.trip.to_town]);
            } else {
                return this.$t('llevastePasajero', [transaction.user.name, transaction.trip.to_town]);
            }
        },
        generateStatus (transaction) {
            if (transaction.payment_status === 'ok') {
                if (transaction.payment_info && transaction.payment_info.cardDetail && transaction.user_id === this.user.id) {
                    return this.$t('transaccionOkConTarjeta', [transaction.payment_info.cardDetail.cardNumber]);
                }
                return this.$t('transaccionOk');
            } else {
                return this.$t('transaccionNoCompletada');
            }
        }
    }
};
</script>
<style scoped>
    table th {
        text-transform: capitalize;
    }
    @media only screen and (max-width: 768px) {
        table, thead, tbody, th, td, tr {
            display: block;
        }
        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }
        tr {
            border: 1px solid #ccc;
            margin: .5em 0;
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
        .table>tbody>tr>td {
            border: 0;
        }
    }

</style>
