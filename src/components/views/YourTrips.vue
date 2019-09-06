<template>
  <div class="trips container">
        <div class="col-xs-24">
            <h2>Mis <strong>próximos</strong> viajes</h2>
            <Loading :data="trips">
                <div class="trips-list">
                    <Trip v-for="trip in trips" :trip="trip" :user="user" :enableChangeSeats="true"></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No tenés viajes creados</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <Loading :data="passengerTrips" :hideOnEmpty="true">
                <h2 slot="title" > Viajes a los que <strong>estoy subido</strong> </h2>
                <div class="trips-list">
                    <Trip v-for="trip in passengerTrips" :trip="trip" :user="user"></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No estas subido a ningún viaje.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div>
        <div class="col-xs-24" v-if="oldDriverTrips">
            <h2>Mis viajes pasados</h2>
            <Loading :data="oldDriverTrips">
                <div class="trips-list">
                    <Trip v-for="trip in oldDriverTrips" :trip="trip" :user="user"></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No create ningún viaje</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24" v-if="oldPassengerTrips">
            <Loading :data="oldPassengerTrips" :hideOnEmpty="true">
                <h2 slot="title" > Viajes a los que me <strong>subí</strong> </h2>
                <div class="trips-list">
                    <Trip v-for="trip in oldPassengerTrips" :trip="trip" :user="user"></Trip>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No te has subido a ningún viaje.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando viajes ...
                </p>
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
import { mapGetters, mapActions } from 'vuex';

import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'my-trips',
    data () {
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
    mounted () {
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
        ...mapGetters({
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        })
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'trips/tripAsDriver',
            tripAsPassenger: 'trips/tripAsPassenger',
            oldTripsAsDriver: 'trips/oldTripsAsDriver',
            oldTripsAsPassenger: 'trips/oldTripsAsPassenger',
            findSubscriptions: 'subscriptions/index',
            registerDonation: 'profile/registerDonation',
            changeProperty: 'profile/changeProperty'
        }),
        findTrip (id) {
            if (this.trips) {
                return this.trips.find(item => item.id === id);
            }
        },
        updateScroll () {
            if (this.$route.query.loc) {
                // window.scrollTo(0, document.body.scrollHeight);
                // window.location.hash = this.$route.query.loc;
                let domNode = document.getElementById(this.$route.query.loc);
                window.scrollTo(0, domNode.offsetTop - 150);
            }
        },
        onDonateOnceTime () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/CaSZ';
                    break;
                case '200':
                    url = 'http://mpago.la/xntw';
                    break;
                case '500':
                    url = 'http://mpago.la/QEiN';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message('Tienes que seleccionar un valor de donación.', { duration: 10, estado: 'error' });
            }
        },
        onDonateMonthly () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/1w3aci'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/BfZ';
                    break;
                case '200':
                    url = 'http://mpago.la/P02H';
                    break;
                case '500':
                    url = 'http://mpago.la/k8Xp';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message('Tienes que seleccionar un valor de donación.', { duration: 10, estado: 'error' });
            }
        },

        toPendingRates () {
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
        onMessageModalClose () {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        onModalClose () {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        hasToShowModal (tripId) {
            let tripRateds = parseFloat(this.appConfig.donation.trips_rated);
            if (this.user && !this.user.monthly_donate) { // solo si el usuario no es donador mensual
                if (!this.user.donations) {
                    // no tengo intento de donaciones este mes debe aparecer
                    this.showModalRequestDonation = true;
                    this.modalTripId = tripId;
                } else {
                    // debe aparecerme una vez por viaje
                    let donation = this.user.donations.find(d => d.trip_id === tripId);
                    if (!donation) {
                        // para la cantidad de `tripRated` viajes mensuales
                        let donations = this.user.donations.filter(d => d.trip_id !== null);
                        if (donations && donations.length < tripRateds) {
                            this.showModalRequestDonation = true;
                            this.modalTripId = tripId;
                        } else {
                            console.log('hasToShowModal: ya interactue con al menos dos viajes');
                        }
                    } else {
                        console.log('hasToShowModal: ya interactue con este viaje');
                    }
                }
            }
        },
        onUserRated (data) {
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
            if (!this.user.do_not_alert_pending_rates) {
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
        }/* ,
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
        Tabset,
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
        margin-bottom: .5rem;
    }
</style>
