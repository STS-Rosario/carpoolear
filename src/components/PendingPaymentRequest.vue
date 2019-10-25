<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix" v-if="trip">
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <h3>Confirmá tu asiento</h3>
                    Te han aceptado en el viaje hacia <strong>{{ trip.points[trip.points.length - 1].json_address ? trip.points[trip.points.length - 1].json_address.name : trip.points[trip.points.length - 1].address }} del día {{ trip.trip_date | moment("DD/MM/YYYY") }} a las  {{ trip.trip_date | moment("HH:mm") }}</strong> ahora debes realizar el pago de <strong>$ {{ trip.seat_price }}</strong> para confirmar tu asiento.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="onAcceptRequest"> Pagar </button>
                        <button class="btn btn-default" :disabled="rejectInProcess" @click="onCancelRequest"> Cancelar </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dialogs from '../services/dialogs.js';
export default {
    data () {
        return {
            acceptInProcess: false,
            rejectInProcess: false,
            acceptRequestValue: 0,
            trip: null
        };
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user'
        })
    },
    mounted () {
        this.getTrip(this.request.trip_id).then(trip => {
            console.log('trip to pay', trip);
            this.trip = trip;
        });
    },
    methods: {
        ...mapActions({
            getTrip: 'getTrip',
            passengerAccept: 'passenger/accept',
            cancel: 'passenger/cancel'
        }),

        onAcceptRequest () {
            let baseUrl = process.env.API_URL;
            let url = baseUrl + '/transbank?tp_id=' + this.request.id;
            if (window.location.protocol.indexOf('http') >= 0) {
                window.location.href = url;
            } else {
                var popup = window.open(url, '_blank', 'location=no,hidden=yes,zoom=no');
                console.log('onAcceptRequest', url);
                popup.addEventListener('message', (params) => {
                    console.log('message', params);
                    popup.close();
                }, false);
            }
        },

        onCancelRequest () {
            if (window.confirm('¿Estás seguro que deseas bajarte del viaje?')) {
                this.rejectInProcess = true;
                this.cancel({ user: this.currentUser, trip: this.trip, cancelTripForPayment: true }).then(() => {
                    this.rejectInProcess = false;
                    dialogs.message('Te has bajado del viaje.');
                }).catch(() => {
                    this.rejectInProcess = false;
                });
            }
        }
    },

    props: [
        // 'user',
        // 'trip',
        'request'
    ]
};
</script>
