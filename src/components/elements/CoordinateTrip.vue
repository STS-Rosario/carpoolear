<template>
    <div class="trip_actions" v-if="conversation && conversation.trip">
        <div class="trip_actions-detail">
            <span v-if="owner">Te envía una consulta por tu viaje desde </span>
            <span v-else>Viaje desde </span>
            <strong>{{ conversation.trip.from_town }} </strong> 
            hacia <strong>{{ conversation.trip.to_town }} </strong>
            <span v-if="owner"> 
             del día <strong>{{ conversation.trip.trip_date | moment("DD/MM/YYYY")}}</strong> a las <strong>{{ conversation.trip.trip_date | moment("HH:mm")}})</strong>
            <template v-if="conversation.trip.return_trip">
                y vuelta el día <strong>{{ conversation.return_trip.trip_date | moment("DD/MM/YYYY")}}</strong> a las <strong>{{ conversation.return_trip.trip_date | moment("HH:mm")}})</strong>
            </template>
            </span>
        </div>
        <template v-if="!owner">
            <button 
                :disabled="sending.trip || expiredTrip" 
                :style="!conversation.return_trip ? {float: 'none', width: '100%'} : {}"  
                class="btn btn-primary" 
                @click="isPassengerTrip || conversation.trip.request === 'send' ? cancelRequest(false) : doRequest(false)"
            >
                <span v-if="isPassengerTrip">Bajarme del viaje <template v-if="conversation.return_trip">de ida</template> </span>
                <span v-else-if="conversation.trip.request === 'send'">Retirar solicitud de asiento <template v-if="conversation.return_trip">de ida</template> </span>
                <span v-else-if="sending.trip">
                    <spinner class="blue" v-if="sending && sending.trip"></spinner>
                </span>
                <span v-else-if="expiredTrip">
                    ¡ Viaje Carpooleado !
                </span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        Reservar $ {{ conversation.trip.seat_price }} <template v-if="conversation.return_trip"> de ida</template>
                    </template>
                    <template v-else>
                        Solicitar asiento <template v-if="conversation.return_trip"> de ida</template>
                    </template>
                </span>
                <template v-if="!sending.trip">
                    <strong>({{ conversation.trip.trip_date | moment("DD/MM/YYYY")}}</strong> - <strong>{{ conversation.trip.trip_date | moment("HH:mm")}})</strong>
                </template>
            </button>
        </template>
        <template v-if="conversation.return_trip">
            <button 
                :disabled="sending.returnTrip || expiredReturnTrip" 
                class="btn btn-primary" 
                @click="isPassengerReturnTrip || conversation.return_trip.request === 'send' ? cancelRequest(true) : doRequest(true)"
            >
                <span v-if="isPassengerReturnTrip">Bajarme del viaje de vuelta</span>
                <span v-else-if="conversation.return_trip.request === 'send'">Retirar solicitud de asiento de vuelta</span>
                <span v-else-if="sending.returnTrip">
                    <spinner class="blue" v-if="sending.returnTrip"></spinner>
                </span>
                <span v-else-if="expiredReturnTrip">
                    ¡ Viaje Carpooleado !
                </span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        Reservar $ {{ conversation.return_trip.seat_price }} de vuelta
                    </template>
                    <template v-else>
                        Solicitar asiento de vuelta 
                    </template>
                </span>
                <template v-if="!sending.returnTrip">
                    <strong>({{ conversation.return_trip.trip_date | moment("DD/MM/YYYY")}}</strong> - <strong>{{ conversation.return_trip.trip_date | moment("HH:mm")}})</strong>
                </template>
            </button>
        </template>
    </div>
</template>>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import moment from 'moment';

export default {
    name: 'conversation-chat',
    data () {
        return {
            sending: {
                trip: false,
                returnTrip: false
            }
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'config': 'auth/appConfig',
            'user': 'auth/user'
        }),
        owner () {
            return this.conversation.trip && this.user && this.user.id === this.conversation.trip.user.id;
        },
        isPassengerTrip () {
            return this.conversation.trip && this.conversation.trip.passenger.findIndex(item => item.user_id === this.user.id && (item.request_state === 1 || item.request_state === 4)) >= 0;
        },
        isPassengerReturnTrip () {
            return this.conversation.return_trip && this.conversation.return_trip.passenger.findIndex(item => item.user_id === this.user.id && (item.request_state === 1 || item.request_state === 4)) >= 0;
        },
        expiredTrip () {
            return moment(this.conversation.trip.trip_date).format() < moment().format();
        },
        expiredReturnTrip () {
            return moment(this.conversation.return_trip.trip_date).format() < moment().format();
        }
    },
    methods: {
        ...mapActions({
            'make': 'passenger/makeRequest',
            'cancel': 'passenger/cancel'
        }),

        doRequest (isReturnTrip = false) {
            if (this.config.module_coordinate_by_message) {
                this.$set(this.sending, isReturnTrip ? 'returnTrip' : 'trip', true);
                let trip = isReturnTrip ? this.conversation.return_trip : this.conversation.trip;
                this.make(trip.id).then((response) => {
                    this.$set(trip, 'request', 'send');
                }).finally(() => {
                    this.$set(this.sending, isReturnTrip ? 'returnTrip' : 'trip', false);
                });
            }
        },

        cancelRequest (isReturnTrip = false) {
            if (this.config.module_coordinate_by_message) {
                if (window.confirm('¿Estás seguro que deseas bajarte del viaje?')) {
                    this.$set(this.sending, isReturnTrip ? 'trip' : 'returnTrip', true);
                    let trip = isReturnTrip ? this.conversation.return_trip : this.conversation.trip;
                    this.cancel({ user: this.user, trip: trip }).then(() => {
                        dialogs.message('Te has bajado del viaje.');
                        if (trip.request === 'send') {
                            trip.request = '';
                        }
                        if (this.isPassengerTrip || this.isPassengerReturnTrip) {
                            let index = trip.passenger.findIndex(item => item.id === this.user.id && (item.request_state === 1 || item.request_state === 4));
                            if (index >= 0) {
                                trip.passenger[index].request_state = 3;
                                trip.seats_available++;
                                trip.passenger_count--;
                            }
                        }
                    }).catch((error) => {
                        console.error(error);
                        dialogs.message('Ocurrió un problema al solicitar, por favor aguarde unos instante e intentelo nuevamente.', { estado: 'error' });
                    }).finally(() => {
                        this.$set(this.sending, isReturnTrip ? 'trip' : 'returnTrip', false);
                    });
                }
            }
        }
    },
    components: {
        spinner
    }
};
</script>

<style scoped>
    .trip_actions .btn-primary {
        font-size: 12px;
        width: 100%;
    }
    @media only screen and (max-width: 768px) {
        .trip_actions {
            padding: .4em .8em;
            width: 100%;
            border-radius: 0;
            box-shadow: 1px 1px 1px rgba(0,0,0, .4);
            font-size: .9em;
            position: fixed;
            z-index: 10;
            background-color: #f6f6f6;
        }
        .trip_actions .btn-primary {
            display: block;
            width: 100%;
            font-size: 11px;
            margin-bottom: 0;
            margin: 0;
            padding: 0;
        }
        .trip_actions-detail {
            padding-bottom: .3em;
            padding-left: .4em;
        }
    }
    @media only screen and (min-width: 1100px) {
        .trip_actions .btn-primary {
            float: left;
            width: 50%;
        }
    }
</style>

<style>
    .module--coordinate-by-message #btn-more {
        padding: .4em;
    }
    .module--coordinate-by-message .conversation_chat p,
    .module--coordinate-by-message .message_text {
            font-size: 12px;
    }
    .module--coordinate-by-message .conversation-lastmessage {
        font-size: 12px;
    }
    .module--coordinate-by-message .conversation-component.container {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    .module--coordinate-by-message .conversation_chat .list-group-item:nth-child(2) {
        height: calc(100% - 245px);
    }
    @media only screen and (min-width: 768px) {
        .module--coordinate-by-message .conversation_chat p,
        .module--coordinate-by-message .message_text {
            font-size: 12px;
        }
    @media only screen and (min-width: 1000px) {
        .module--coordinate-by-message .conversation_chat .list-group-item:nth-child(2) {
            height: calc(100% - 205px);
        }
    }
    }
</style>