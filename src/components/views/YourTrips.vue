<template>
    <div class="trips container">
        <div class="col-xs-24">
        <h2>
            {{ $t('mis') }}
            <strong>{{ $t('proximos') }}</strong>
            {{ $t('viajes') }}
        </h2>
        <Loading :data="trips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in trips"
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
                        :src="$publicImg('loader.gif')"
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
                        :trip="trip"
                        :user="user"
                    ></Trip>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noEstasSubidoViaje') }}
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
        <div class="col-xs-24" v-if="oldDriverTrips">
            <h2>{{ $t('misViajesPasados') }}</h2>
            <Loading :data="oldDriverTrips">
                <div class="trips-list">
                    <Trip
                        v-for="trip in oldDriverTrips"
                        :trip="trip"
                        :user="user"
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
                        :trip="trip"
                        :user="user"
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
import RatePending from '../RatePending';
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useMyTripsStore } from '../../stores/myTrips';
import { useSubscriptionsStore } from '../../stores/subscriptions';
import { useTripsStore } from '../../stores/trips';
import { useProfileStore } from '../../stores/profile';

import Tab from '../elements/Tab';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';
import { isActiveClubCarpoolearMember } from '../../utils/clubCarpoolearMember.js';
import { startDonationCheckout } from '../../utils/donationCheckout.js';
import { openExternalUrl } from '../../utils/externalLink.js';

export default {
    name: 'my-trips',
    data() {
        return {
            showModalRequestDonation: false,
            donateValue: 0,
            modalTripId: 0,
            showModalPendingRates: false,
            pendingRatesValue: 0,
            alreadyAlerted: false,
            driverTrips: [],
            passengerTrips: [],
            oldDriverTrips: [],
            oldPassengerTrips: []
        };
    },
    props: {
        id: {
            required: false,
            default: 'me'
        }
    },
    mounted() {
        this.driverTrips = this.tripAsDriver();
        this.passengerTrips = this.tripAsPassenger();
        this.pendingRate();
        this.getPendingRequest().then(() => {
            this.oldTripsAsDriver();
            this.oldTripsAsPassenger();
        });
        this.findSubscriptions();
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            appConfig: 'appConfig'
        }),
        ...mapState(useMyTripsStore, {
            oldTrips: 'myOldTrips',
            oldPassengerTrips: 'passengerOldTrips'
        }),
        ...mapState(useSubscriptionsStore, {
            subscriptions: 'subscriptions'
        })
    },

    methods: {
        ...mapActions(useTripsStore, {
            tripAsDriver: 'tripAsDriver',
            tripAsPassenger: 'tripAsPassenger',
            oldTripsAsDriver: 'oldTripsAsDriver',
            oldTripsAsPassenger: 'oldTripsAsPassenger'
        }),
        ...mapActions(useSubscriptionsStore, {
            findSubscriptions: 'index'
        }),
        ...mapActions(useProfileStore, {
            registerDonation: 'registerDonation',
            changeProperty: 'changeProperty'
        }),
        findTrip(id) {
            if (this.trips) {
                return this.trips.find((item) => item.id === id);
            }
        },
        updateScroll() {
            if (!this.$route.query.loc) {
                return;
            }
            this.$nextTick(() => {
                const domNode = document.getElementById(this.$route.query.loc);
                if (domNode) {
                    window.scrollTo(0, domNode.offsetTop - 150);
                }
            });
        },
        async donateCheckout(type) {
            if (this.donateValue > 0) {
                try {
                    const url = await startDonationCheckout({
                        type,
                        amount: this.donateValue,
                        source: 'your_trips',
                        tripId: this.modalTripId,
                        userId: this.user && this.user.id,
                        appConfig: this.appConfig
                    });
                    openExternalUrl(url);
                } catch (error) {
                    console.error('Donation checkout failed:', error);
                    dialogs.message(this.$t('valorDonacion'), {
                        duration: 10,
                        estado: 'error'
                    });
                    return;
                }
                this.showModalRequestDonation = false;
            } else {
                dialogs.message(this.$t('valorDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        onDonateOnceTime() {
            return this.donateCheckout('once');
        },
        onDonateMonthly() {
            return this.donateCheckout('monthly');
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
            if (this.user && !isActiveClubCarpoolearMember(this.user)) {
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
                this.hasToShowModal(data.trip_id);
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
