<template>
    <div class="row passengers" v-if="!trip.is_passenger && owner && acceptedPassengers.length">
        <div class="col-xs-24" v-if="owner && acceptedPassengers.length">
            <h4 class="title-margined">
                <strong>Pasajeros subidos</strong>
            </h4>
            <div v-for="p in acceptedPassengers" class="list-item" v-bind:key="p.id">
                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                    {{ p.user ? p.user.name : p.name }}
                </a>
                <a href="#" @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                        <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button @click="removePassenger(p)" class="trip_passenger-remove pull-right" aria-label="Bajar pasajero del viaje">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div v-if="trip.passenger.length === 0">
                Aún no hay pasajeros subidos a este viaje.
            </div>
        </div>
        <div v-else style="height: 2em;"></div>
        <div class="col-xs-24" v-if="owner && waitingForPaymentsPassengers.length">
            <h4 class="title-margined">
                <strong>Pasajeros pendiente de pago</strong>
            </h4>
            <div v-for="p in waitingForPaymentsPassengers" class="list-item" v-bind:key="p.id">
                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                    {{ p.user ? p.user.name : p.name }}
                </a>
                <a href="#" @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                        <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button @click="removePassenger(p)" class="trip_passenger-remove pull-right" aria-label="Bajar pasajero del viaje">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
export default {
    name: 'TripPassengers',
    data () {
        return {

        };
    },
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            user: 'auth/user'
        }),
        owner () {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        acceptedPassengers () {
            console.log('acceptedPassengers', this.trip);
            return this.trip.allPassengerRequest ? this.trip.allPassengerRequest.filter(item => item.request_state === 1) : [];
        },
        waitingForPaymentsPassengers () {
            return this.trip.allPassengerRequest ? this.trip.allPassengerRequest.filter(item => item.request_state === 4) : [];
        }
    },
    props: [],
    components: {
    },
    mounted () {
        this.calculateHeight();
    },
    methods: {
        ...mapActions({
            lookConversation: 'conversations/createConversation',
            cancel: 'passenger/cancel'
        }),
        calculateHeight () {
            this.$nextTick(() => {
                bus.emit('calculate-height');
            });
        },
        toUserMessages (user) {
            this.lookConversation(user).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            }).catch(error => {
                console.error(error);
                this.sending = false;
            });
        },
        toUserProfile (user) {
            router.replace({
                name: 'profile',
                params: {
                    id: user.id,
                    userProfile: user,
                    activeTab: 1
                }
            });
        },
        removePassenger (user) {
            if (window.confirm('¿Estás seguro que deseas bajar a este pasajero de tu viaje?')) {
                this.sending = true;
                this.cancel({ user: user, trip: this.trip }).then(() => {
                    this.sending = false;
                    dialogs.message(this.$t('removerPasajeroExitoso'), { estado: 'success' });
                }).catch(() => {
                    this.sending = false;
                });
            }
        }
    },
    watch: {
        acceptedPassengers () {
            this.calculateHeight();
        },
        waitingForPaymentsPassengers () {
            this.calculateHeight();
        }
    }
};
</script>
<style scoped>
    .trip_driver_img.circle-box.passenger {
        width: 3.5em;
        height: 3.5em;
        position: relative;
        margin-right: .5em;
    }
    .passengers {
        margin-bottom: .8em;
    }
        .trip_passenger-chat,
    .trip_passenger-remove,
    .trip_passenger_image,
    .trip_passenger_name {
        vertical-align: middle;
        cursor: pointer;
    }
    .trip_passenger-chat,
    .trip_passenger-remove {
        font-size: 1.8em;
        background: none;
        border: 0;
    }
    .trip_passenger-remove {
        margin-left: .5em;
        margin-top: .25em;
    }
    .trip_passenger-chat {
        margin-left: .5em;
    }
    @media only screen and (min-width: 400px) and (max-width: 767px) {
        .trip_driver_img {
            width: 6.7rem;
            height: 6.7rem;
        }
    }
</style>
