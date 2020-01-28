<template>
    <div class="buttons-container"  v-if="!isPassengersView || (isPassengersView && owner)">
        <router-link class="btn btn-primary" v-if="owner && !expired" :to="{name: 'update-trip', params: { id: trip.id}}">
            Editar
        </router-link>
        <a class="btn btn-primary" v-if="owner && !expired" @click="$emit('deleteTrip')" :disabled="sendingStatus">
            <spinner class="blue" v-if="sending && sending.deleteAction"></spinner>
            <span v-else>Cancelar Viaje</span>
        </a>
        <template v-if="!owner && !expired && (!config.module_coordinate_by_message || (config.module_coordinate_by_message && isPassenger))">
            <button class="btn btn-primary" @click="$emit('toMessages')" v-if="!owner" :disabled="sendingStatus">
                <spinner class="blue" v-if="sending && sending.sendMessageAction"></spinner>
                <span v-else>Enviar mensaje</span>
            </button>
        </template>
        <template v-if="!owner && !trip.is_passenger && !expired">
            <template v-if="!isPassenger">
                <button class="btn btn-primary" @click="$emit('onMakeRequest')" v-if="canRequest && trip.seats_available > 0" :disabled="sendingStatus">
                    <template v-if="sending && sending.requestAction">
                        <spinner class="blue"></spinner>
                    </template>
                    <template v-else>
                        <template v-if="trip.user.autoaccept_requests">
                            <template v-if="config && config.module_trip_seats_payment">
                                Reservar $ {{ trip.seat_price }}
                            </template>
                            <template v-else>
                                Reservar
                            </template>
                        </template>
                        <template v-else-if="config.module_coordinate_by_message">
                            Coordinar viaje
                        </template>
                        <template v-else>
                            Solicitar asiento
                        </template>
                    </template>
                </button>
                <button class="btn" v-if="!canRequest" @click="$emit('cancelRequest')" :disabled="sendingStatus">
                    <spinner class="blue" v-if="sending && sending.requestAction"></spinner>
                    <span v-else>Solicitado (RETIRAR)</span>
                </button>
            </template>

            <template v-if="isPassenger">
                <button class="btn btn-primary" @click="$emit('cancelRequest')" v-if="canRequest" :disabled="sendingStatus">
                    <spinner class="blue" v-if="sending && sending.requestAction"></spinner>
                    <span v-else>Bajarme del viaje</span>
                </button>
            </template>
        </template>
        <template v-if="expired">
            <button class="btn btn-primary" disabled> Finalizado  </button>
        </template>
        <template v-if="trip.seats_available === 0 && !trip.is_passenger">
            <div class="carpooled-trip"> Viaje Carpooleado </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import spinner from '../Spinner.vue';
export default {
    name: 'TripButtons',
    data () {
        return {
        };
    },
    props: ['sending'],
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            user: 'auth/user',
            isMobile: 'device/isMobile',
            config: 'auth/appConfig'
        }),
        sendingStatus () {
            Object.keys(this.sending).some(k => this.sending[k] === true);
        },
        isPassenger () {
            return this.trip.passenger.findIndex(item => item.user_id === this.user.id && (item.request_state === 1 || item.request_state === 4)) >= 0;
        },
        expired () {
            return moment(this.trip.trip_date).format() < moment().format();
        },
        owner () {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        canRequest () {
            return !this.owner && !this.trip.request;
        },
        isPassengersView () {
            return this.trip.is_passenger;
        }
    },
    components: {
        spinner
    },
    methods: {
        onShareLinkClick (event) {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                // Estoy en movil
                event.preventDefault();
                let href = event.target.getAttribute('href');
                if (!href) {
                    href = event.target.parentElement.getAttribute('href');
                }
                if (href) {
                    window.location.href = href;
                }
            }
        },
        onWhatsAppShareClick (event) {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                // Estoy en movil
                event.preventDefault();
                if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
                    let message = 'Publiqué un viaje para compartir en Carpoolear';
                    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, decodeURIComponent(this.currentUrl), function () {
                        console.log('share ok');
                    }, function (errormsg) {
                        console.log('share not ok:', errormsg);
                    });
                }
            }
        }
    }
};
</script>
<style scoped>
    .buttons-container button:first-child {
        margin-right: 0;
    }
    .buttons-container button {
        margin-bottom: .4em;
    }
    .buttons-container {
        text-align: center;
        margin-top: 1em;
        padding-bottom: 2rem;
    }
    @media only screen and (min-width: 768px) {
        .buttons-container button:first-child {
            margin-right: 1em;
        }
        .buttons-container {
            left: 42px;
            bottom: -25px;
            position: absolute;
            padding-bottom: 0;
            z-index: 1;
        }
    }
</style>