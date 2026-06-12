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
                        :src="$publicImg('loader.gif')"
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
                        :src="$publicImg('loader.gif')"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargando') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24">
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
                        :src="$publicImg('loader.gif')"
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
                        :clickModal="false"
                        :enableChangeSeats="true"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noTenesViajesCreados') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="seatRequests" :hideOnEmpty="true">
                <template #title><h2>{{ $t('solicitudesDeAsiento') }}</h2></template>
                <div class="trips-list">
                    <SeatRequestTrip
                        v-for="request in seatRequests"
                        v-bind:key="request.id"
                        :trip="request.trip"
                        :requestState="request.request_state"
                        :user="user"
                    ></SeatRequestTrip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHaySolicitudesDeAsiento') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
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
                        :src="$publicImg('loader.gif')"
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
                        :clickModal="false"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHasRealizadoViaje') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
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
                        :clickModal="false"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noTeHasSubidoViaje') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
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
import SeatRequestTrip from '../SeatRequestTrip.vue';
import { mapState, mapActions } from 'pinia';
import { useMyTripsStore } from '../../stores/myTrips';
import { useRatesStore } from '../../stores/rates';
import { usePassengerStore } from '../../stores/passenger';
import { useAuthStore } from '../../stores/auth';
import { useSubscriptionsStore } from '../../stores/subscriptions';

import Tab from '../elements/Tab';
import bus from '../../services/bus-event.js';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';
import { shouldPromptDonationAfterRating } from '../../utils/donationAfterRating.js';

export default {
    name: 'my-trips',
    mounted() {
        this.tripAsDriver();
        this.pendingRate();
        this.getPendingRequest().then(() => {
            this.oldTripsAsDriver();
            this.oldTripsAsPassenger();
        });
        this.getPendingPaymentRequests();
        this.getSeatRequests();
        this.findSubscriptions();

        bus.on('request-status-changed', () => {
            this.getPendingRequest().then(() => {
                this.oldTripsAsDriver();
                this.oldTripsAsPassenger();
            });
            this.getSeatRequests();
        });
    },
    beforeUnmount() {
        bus.off('request-status-changed');
    },
    computed: {
        ...mapState(useMyTripsStore, {
            trips: 'myTrips',
            oldTrips: 'myOldTrips',
            oldPassengerTrips: 'passengerOldTrips'
        }),
        ...mapState(useRatesStore, {
            pendingRates: 'pendingRates'
        }),
        ...mapState(usePassengerStore, {
            pendingRequest: 'pendingRequest',
            pendingPaymentRequests: 'pendingPaymentRequests',
            seatRequests: 'seatRequests'
        }),
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useSubscriptionsStore, {
            subscriptions: 'subscriptions'
        })
    },

    methods: {
        ...mapActions(useMyTripsStore, {
            tripAsDriver: 'tripAsDriver',
            oldTripsAsDriver: 'oldTripsAsDriver',
            oldTripsAsPassenger: 'oldTripsAsPassenger'
        }),
        ...mapActions(useRatesStore, {
            pendingRate: 'pendingRatesAction'
        }),
        ...mapActions(usePassengerStore, {
            getPendingRequest: 'getPendingRequest',
            getPendingPaymentRequests: 'getPendingPaymentRequests',
            getSeatRequests: 'getSeatRequests'
        }),
        ...mapActions(useSubscriptionsStore, {
            findSubscriptions: 'index'
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
        redirectToDonationPrompt(tripId) {
            if (shouldHideDonationOnIOSCapacitor(this.user)) {
                return;
            }
            if (
                !shouldPromptDonationAfterRating({
                    user: this.user,
                    tripId,
                    tripsRated: this.config.donation.trips_rated
                })
            ) {
                return;
            }
            this.$router.push({
                name: 'donate-after-rating',
                params: { tripId }
            });
        },
        onUserRated(data) {
            console.log('onUserRated', data);
            if (data.rating) {
                if (
                    this.config &&
                    this.config.donation &&
                    this.config.donation.month_days > 0 &&
                    !data.trip.needs_sellado
                ) {
                    this.redirectToDonationPrompt(data.trip_id);
                }
            }
        }
    },
    watch: {
        trips: function () {
            this.updateScroll();
        },
        seatRequests: function () {
            this.updateScroll();
        },
        pendingRates: function () {
            this.updateScroll();
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
        SeatRequestTrip,
        Tab,
        subscriptionItem
    }
};
</script>

<style scoped>
h2 {
    font-weight: 300;
}
</style>
