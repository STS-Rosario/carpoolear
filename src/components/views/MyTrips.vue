<template>
    <div class="trips container">
        <div class="col-xs-24">
            <Loading :data="pendingPaymentRequests" :hideOnEmpty="true">
                <template #title><h2>
                    <strong>{{ $t('pagoPendiente') }}</strong>
                    {{ $t('pagoPendienteParaConfirmar') }}
                </h2></template>
                <div class="request-list">
                    <PendingPaymentRequest
                        v-for="r in pendingPaymentRequests"
                        v-bind:key="r.id"
                        :request="r"
                    ></PendingPaymentRequest>
                </div>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargando') }}
                </p></template>
            </Loading>
        </div>
        <div class="col-xs-24">
            <Loading :data="pendingRequest" :hideOnEmpty="true">
                <template #title><h2>
                    <strong>{{ $t('pendientesDeContestar') }}</strong>
                </h2></template>
                <div class="request-list">
                    <PendingRequest
                        v-for="r in pendingRequest"
                        v-bind:key="r.id"
                        :user="r.user"
                        :trip="findTrip(r.trip_id)"
                    ></PendingRequest>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHayPendientesDeContestar') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargando') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <modal
                :name="'modal'"
                v-if="showModalPendingRates"
                @close="toPendingRates"
                :title="$t('carpoodatos')"
                :body="'Body'"
                :hide-footer="true"
            >
                <template #header><h3>
                    <span>{{ $t('carpoodatos') }}</span>
                    <i
                        v-on:click="toPendingRates"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3></template>
                <template #body><div>
                    <div class="text-left carpoodatos">
                        <p>
                            <b>{{ $t('carpoodatosImportanteCalificar').split('.')[0] }}</b>
                            {{ $t('carpoodatosImportanteCalificar').split('.')[1] }}
                        </p>
                        <p>
                            <b
                                >{{ $t('carpoodatosTiempoCalificar').split('.')[0] }}</b
                            >
                            {{ $t('carpoodatosTiempoCalificar').split('.')[1] }}
                        </p>
                        <p>
                            <b
                                >{{ $t('carpoodatosNoBorrar').split('.')[0] }}</b
                            >
                            {{ $t('carpoodatosNoBorrar').split('.')[1] }}
                        </p>
                        <p>
                            <b>{{ $t('carpoodatosDeciLoQuePensas').split('.')[0] }}</b>
                            {{ $t('carpoodatosDeciLoQuePensas').split('.')[1] }}
                        </p>
                        <p>
                            {{ $t('carpoodatosContacto') }}
                            <a :href="'mailto:' + config.admin_email">
                                {{ config.admin_email }}
                            </a>
                            {{ $t('oNuestrasRedesSociales') }}
                        </p>
                    </div>
                    <div class="check" style="margin-bottom: 10px">
                        <label class="check-inline">
                            <input
                                type="checkbox"
                                name="pendingRatesValor"
                                value="0"
                                v-model="pendingRatesValue"
                            />
                            <span>{{ $t('carpoodatosNoVolverAMostrar') }}</span>
                        </label>
                    </div>
                    <div class="text-center">
                        <button
                            class="btn btn-accept-request"
                            @click="toPendingRates"
                        >
                            {{ $t('carpoodatosEntiendo') }}
                        </button>
                    </div>
                </div></template>
            </modal>
            <modal
                :name="'modal'"
                v-if="showModalRequestDonation"
                @close="onModalClose"
                :title="'Test'"
                :body="'Body'"
            >
                <template #header><h3>
                    <span>{{ $t('donaACarpoolear') }}</span>
                    <br class="hidden-sm hidden-md hidden-lg" />
                    <small>{{ $t('proyectoDe') }}</small>
                    <img
                        width="90"
                        alt="STS Rosario"
                        src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png"
                    />
                </h3></template>
                <template #body><div class="donation">
                    <div class="text-center donation-text">
                        <p>
                            {{ $t('buenisimoCompartirViaje') }}
                        </p>
                        {{ $t('ayudanosPlataforma') }}
                    </div>
                    <div class="radio">
                        <label class="radio-inline">
                            <input
                                type="radio"
                                name="donationValor"
                                id="donation50"
                                value="2000"
                                v-model="donateValue"
                            />
                            <span>$ 2000</span>
                        </label>
                        <label class="radio-inline">
                            <input
                                type="radio"
                                name="donationValor"
                                id="donation100"
                                value="5000"
                                v-model="donateValue"
                            />
                            <span>$ 5000</span>
                        </label>
                        <label class="radio-inline">
                            <input
                                type="radio"
                                name="donationValor"
                                id="donation200"
                                value="10000"
                                v-model="donateValue"
                            />
                            <span>$ 10000</span>
                        </label>
                        <label class="radio-inline">
                            <input
                                type="radio"
                                name="donationValor"
                                id="donation500"
                                value="10000"
                                v-model="donateValue"
                            />
                            <span>{{ $t('elegiPropiaAventura') }}</span>
                        </label>
                    </div>
                    <div>
                        <button
                            class="btn btn-success btn-unica-vez"
                            @click="onDonateOnceTime"
                        >
                            {{ $t('unicaVez') }}
                        </button>
                        <button
                            class="btn btn-info btn-mensualmente"
                            @click="onDonateMonthly"
                        >
                            {{ $t('MENSUAL') }}
                            <br />
                            {{ $t('cancelaCuando') }}
                        </button>
                    </div>
                    <div class="text-center">
                        <br />
                        <a
                            href="/donar"
                            target="_blank"
                            v-on:click.prevent="
                                openDonationLink()
                            "
                        >
                            {{ $t('conoceMasDonar') }}
                        </a>
                    </div>
                </div></template>
            </modal>
            <Loading :data="pendingRates" :hideOnEmpty="true">
                <template #title><h2>
                    {{ $t('calificacionesPendientes') }}
                </h2></template>
                <div class="request-list">
                    <RatePending
                        v-for="rate in pendingRates"
                        v-bind:key="rate.id"
                        :rate="rate"
                        @rated="onUserRated"
                    />
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHayCalificacionesPendientes') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoCalificaciones') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <h2 v-html="$t('misProximosViajes')">
            </h2>
            <Loading :data="trips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in trips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                        :enableChangeSeats="true"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noTenesViajesCreados') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="passengerTrips" :hideOnEmpty="true">
                <template #title><h2 v-html="$t('viajesEstoySubido')"></h2></template>
                <div class="trips-list">
                    <Trip
                        v-for="trip in passengerTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noEstasSubidoViaje') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>
        <div
            class="col-xs-24"
            v-if="subscriptions && subscriptions.length"
            id="suscriptions"
        >
            <Loading :data="subscriptions" :hideOnEmpty="true">
                <template #title><h2>{{ $t('suscripcionesViajes') }}</h2></template>
                <div class="trips-list row">
                    <div
                        class="col-xs-24 col-md-12"
                        v-for="subs in subscriptions"
                        v-bind:key="subs.id"
                        :key="subs.id"
                    >
                        <subscriptionItem
                            :subscription="subs"
                            :user="user"
                        ></subscriptionItem>
                    </div>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noTienesSuscripcion') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoSuscripciones') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24" v-if="oldTrips">
            <h2>{{ $t('misViajesPasados') }}</h2>
            <Loading :data="oldTrips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHasRealizadoViaje') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24" v-if="oldPassengerTrips">
            <Loading :data="oldPassengerTrips" :hideOnEmpty="true">
                <template #title><h2 v-html="$t('viajesMeSubi')"></h2></template>
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldPassengerTrips"
                        v-bind:key="trip.id"
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noTeHasSubidoViaje') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>
    </div>
</template>

<script>
import subscriptionItem from '../sections/SubscriptionItem.vue';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import PendingRequest from '../PendingRequest';
import PendingPaymentRequest from '../PendingPaymentRequest';
import RatePending from '../RatePending';
import { mapGetters, mapActions } from 'vuex';

import Tab from '../elements/Tab';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';

export default {
    name: 'my-trips',
    data() {
        return {
            showModalRequestDonation: false,
            donateValue: 0,
            modalTripId: 0,
            showModalPendingRates: false,
            pendingRatesValue: 0,
            alreadyAlerted: false
        };
    },
    mounted() {
        this.tripAsDriver();
        this.tripAsPassenger();
        this.pendingRate();
        this.getPendingRequest().then(() => {
            this.oldTripsAsDriver();
            this.oldTripsAsPassenger();
        });
        this.getPendingPaymentRequests();
        this.findSubscriptions();

        bus.on('request-status-changed', () => {
            this.getPendingRequest().then(() => {
                this.oldTripsAsDriver();
                this.oldTripsAsPassenger();
            });
        });
    },
    beforeDestroy() {
        bus.off('request-status-changed');
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'rates/pendingRates',
            pendingRequest: 'passenger/pendingRequest',
            pendingPaymentRequests: 'passenger/pendingPaymentRequests',
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            subscriptions: 'subscriptions/subscriptions',
            config: 'auth/appConfig'
        })
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            pendingRate: 'rates/pendingRates',
            getPendingRequest: 'passenger/getPendingRequest',
            getPendingPaymentRequests: 'passenger/getPendingPaymentRequests',
            oldTripsAsDriver: 'myTrips/oldTripsAsDriver',
            oldTripsAsPassenger: 'myTrips/oldTripsAsPassenger',
            findSubscriptions: 'subscriptions/index',
            registerDonation: 'profile/registerDonation',
            changeProperty: 'profile/changeProperty'
        }),
        findTrip(id) {
            if (this.trips) {
                return this.trips.find((item) => item.id === id);
            }
        },
        updateScroll() {
            if (this.$route.query.loc) {
                // window.scrollTo(0, document.body.scrollHeight);
                // window.location.hash = this.$route.query.loc;
                let domNode = document.getElementById(this.$route.query.loc);
                window.scrollTo(0, domNode.offsetTop - 150);
            }
        },
        async openExternalBrowser(url) {
            // On iOS Capacitor, use App.openUrl() to open in external browser (Safari)
            // This makes the user leave the app, which is required for donations
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
                try {
                    await App.openUrl({ url });
                } catch (error) {
                    console.error('Error opening URL in external browser:', error);
                    // Fallback to window.open if App.openUrl fails
                    window.open(url, '_blank');
                }
            } else {
                // For web or Android, use window.open
                window.open(url, '_blank');
            }
        },
        async openDonationLink() {
            let url = 'https://carpoolear.com.ar/donar';
            // Add userId parameter for tracking
            if (this.user && this.user.id) {
                url = `${url}?u=${this.user.id}`;
            }
            await this.openExternalBrowser(url);
        },
        async onDonateOnceTime() {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap'; // 50
                switch (this.donateValue) {
                    case '2000':
                        url =
                            'https://mpago.la/1WhaoLf';
                        break;
                    case '5000':
                        url =
                            'https://mpago.la/1SB6on8';
                        break;
                    case '10000':
                        url =
                            'https://mpago.la/2USgEBv';
                        break;
                    default:
                        break;
                }
                // Add userId parameter for tracking
                if (this.user && this.user.id) {
                    const separator = url.includes('?') ? '&' : '?';
                    url = `${url}${separator}u=${this.user.id}`;
                }
                // Open in external browser (required for iOS donations)
                await this.openExternalBrowser(url);
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message(
                    this.$t('tienesQueSeleccionarDonacion'),
                    {
                        duration: 10,
                        estado: 'error'
                    }
                );
            }
        },
        async onDonateMonthly() {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/2XdoxpF'; // 50
                switch (this.donateValue) {
                    case '2000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848a2fd5c9018a33702cc50181';
                        break;
                    case '5000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7';
                        break;
                    case '10000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497030fc7019705478b370068';
                        break;
                    default:
                        break;
                }
                // Add userId parameter for tracking
                if (this.user && this.user.id) {
                    const separator = url.includes('?') ? '&' : '?';
                    url = `${url}${separator}u=${this.user.id}`;
                }
                // Open in external browser (required for iOS donations)
                await this.openExternalBrowser(url);
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message(
                    this.$t('tienesQueSeleccionarDonacion'),
                    {
                        duration: 10,
                        estado: 'error'
                    }
                );
            }
        },

        toPendingRates() {
            if (this.pendingRatesValue) {
                let data = {
                    property: 'do_not_alert_pending_rates',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.showModalPendingRates = false;
        },
        onMessageModalClose() {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        onModalClose() {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        hasToShowModal(tripId) {
            if (shouldHideDonationOnIOSCapacitor(this.user)) {
                return;
            }
            let tripRateds = parseFloat(this.config.donation.trips_rated);
            if (this.user && !this.user.monthly_donate) {
                // solo si el usuario no es donador mensual
                if (!this.user.donations) {
                    // no tengo intento de donaciones este mes debe aparecer
                    this.showModalRequestDonation = true;
                    this.modalTripId = tripId;
                } else {
                    // debe aparecerme una vez por viaje
                    let donation = this.user.donations.find(
                        (d) => d.trip_id === tripId
                    );
                    if (!donation) {
                        // para la cantidad de `tripRated` viajes mensuales
                        let donations = this.user.donations.filter(
                            (d) => d.trip_id !== null
                        );
                        if (donations && donations.length < tripRateds) {
                            this.showModalRequestDonation = true;
                            this.modalTripId = tripId;
                        } else {
                            console.log(
                                'hasToShowModal: ya interactue con al menos dos viajes'
                            );
                        }
                    } else {
                        console.log(
                            'hasToShowModal: ya interactue con este viaje'
                        );
                    }
                }
            }
        },
        onUserRated(data) {
            console.log('onUserRated', data);
            if (data.rating) {
                // vote positivo
                if (
                    this.config &&
                    this.config.donation &&
                    this.config.donation.month_days > 0 &&
                    !data.trip.needs_sellado // do not show donation modal if the trip had Sellado de viaje
                ) {
                    this.hasToShowModal(data.trip_id);
                }
            }
        }
    },
    watch: {
        trips: function () {
            this.updateScroll();
        },
        passengerTrips: function () {
            this.updateScroll();
        },
        pendingRates: function (newValue, oldValue) {
            this.updateScroll();
            if (
                !this.user.do_not_alert_pending_rates &&
                !this.config.disable_user_hints
            ) {
                console.log('pendingRates', newValue, oldValue);
                if (newValue && newValue.length > 0 && !this.alreadyAlerted) {
                    this.alreadyAlerted = true;
                    this.showModalPendingRates = true;
                }
            }
        },
        pendingRequest: function () {
            this.updateScroll();
        },
        user: function () {
            this.updateScroll();
        },
        oldTrips: function () {
            this.updateScroll();
        },
        oldPassengerTrips: function () {
            this.updateScroll();
        } /* ,
        subscriptions: function () {
            this.updateScroll();
        } */
    },
    components: {
        Trip,
        Loading,
        PendingRequest,
        PendingPaymentRequest,
        RatePending,
        Tab,
        subscriptionItem,
        modal
    }
};
</script>

<style scoped>
h2 {
    font-weight: 300;
}
.donation-text {
    margin-bottom: 1.5rem;
}
.donation-text p {
    margin-top: -1rem;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}
</style>
