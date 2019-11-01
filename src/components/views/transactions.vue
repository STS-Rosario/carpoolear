<template>
    <div class="col-md-16 col-md-offset-4 transactions-container ">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">fecha</th>
              <th scope="col">descripcion</th>
              <th scope="col">monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions">
              <td>{{ transaction.created_at }}</td>
              <td>{{ transaction.payment_info }}</td>
              <td>{{ transaction.price }}</td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script>
import bus from '../../services/bus-event.js';
import { mapActions } from 'vuex';


export default {
    name: 'transacciones',
    data () {
        return {
            transactions: []
        };
    },
    mounted () {

        this.history().then( data => {
            this.transactions = data.trip_passengers;
            // TODO terminar front
            // LLega lista de entitys passenger, con su user incluido (el que paga), el trip y en el trip el duenio (el que cobra)
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
        }
    }
};
</script>