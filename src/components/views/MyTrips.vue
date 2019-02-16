<template>
  <div class="trips container">
        <div class="col-xs-24">
            <Loading :data="pendingRequest" :hideOnEmpty="true">
                <h2 slot="title"> Pendientes <strong>de contestar</strong> </h2>
                <div class="request-list">
                    <PendingRequest v-for="r in pendingRequest" :user="r.user" :trip="findTrip(r.trip_id)"></PendingRequest>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay pedientes de contestar</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24">
            <modal :name="'modal'" v-if="showModalPendingRates" @close="toPendingRates" :title="'Test'" :body="'Body'">
                <h3 slot="header">
                    <span>¡Carpoodatos!</span>
                </h3>
                <div slot="body">
                    <div class="text-left">
                      <p>
                        <b>Es muy muy importante calificar</b>. Las calificaciones permiten conocernos mejor y poder decidir a la hora de compartir un viaje, son muy importantes para toda la comunidad carpoolera.
                      </p>
                      <p>
                        <b>Tomate el tiempo para calificar pero no tanto...</b>. Tenés 14 días para calificar contando a partir del momento en que se habilita la posibilidad, 24hs posteriores al comienzo del viaje.
                      </p>
                      <p>
                        <b>No se borra con el codo ni hay líquido corrector</b>. Tené en cuenta que no podés ni borrar ni editar la calificación que hagas.
                      </p>
                      <p>
                        <b>Decí lo que pensás :D</b>. Las calificación que vos hagas y la que recibas de la otra persona se mostrarán al mismo tiempo en los perfiles. Nunca se mostrará una antes que la otra. Solamente cuando la otra persona te califique o se venza el plazo de tiempo para calificar, aparecerá la calificación en el perfil.
                      </p>
                      <p>Cualquier duda escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o nuestras redes sociales.</p>
                    </div>
                    <div class="check" style="margin-bottom:10px;">
                        <label class="check-inline">
                            <input type="checkbox" name="pendingRatesValor" value="0" v-model="pendingRatesValue"><span> No volver a mostrar mensaje</span>
                        </label>
                    </div>
                    <div class="text-center">
                      <button class="btn btn-accept-request" @click="toPendingRates"> !Entiendo! </button>
                    </div>
                </div>
            </modal>
            <modal :name="'modal'" v-if="showModalRequestDonation" @close="onModalClose" :title="'Test'" :body="'Body'">
                <h3 slot="header">
                    <span>Doná a Carpoolear</span>
                    <br class="hidden-sm hidden-md hidden-lg">
                    <small>un proyecto de </small>
                    <img width="90" alt="STS Rosario" src="https://carpoolear.com.ar/img/logo_sts_nuevo_color.png">
                </h3>
                <div slot="body" class="donation">
                    <div class="text-center donation-text">
                        <p>Buenisimo que hayas encontrado con quien compartir tu viaje!</p>
                        Ayudanos a seguir siendo una plataforma abierta, colaborativa y sin fines de lucro
                    </div>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="donationValor" id="donation50" value="50" v-model="donateValue"><span>$ 50</span>
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="donationValor" id="donation100" value="100" v-model="donateValue"><span>$ 100</span>
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="donationValor" id="donation200" value="200" v-model="donateValue"><span>$ 200</span>
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="donationValor" id="donation500" value="500" v-model="donateValue"><span>$ 500</span>
                        </label>
                    </div>
                    <div>
                        <button class="btn btn-success btn-unica-vez" @click="onDonateOnceTime">ÚNICA VEZ</button>
                        <button class="btn btn-info btn-mensualmente" @click="onDonateMonthly">MENSUAL <br />(cancelá cuando quieras)</button>
                    </div>
                    <div class="text-center">
                        <br />
                        <a href="/donar" target="_blank" v-on:click.prevent="onOpenLink('https://carpoolear.com.ar/donar')">
                            Conocé más acerca de por qué donar
                        </a>
                    </div>
                </div>
            </modal>
            <Loading :data="pendingRates" :hideOnEmpty="true">
                <h2 slot="title"> Calificaciones <strong>pendientes </strong></h2>
                <div class="request-list">
                    <RatePending v-for="rate in pendingRates" :rate="rate" @rated="onUserRated" />
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones pendientes</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando calificaciones ...
                </p>
            </Loading>
        </div>

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
        <div class="col-xs-24" v-if="subscriptions && subscriptions.length" id="suscriptions">
            <Loading :data="subscriptions" :hideOnEmpty="true">
                <h2 slot="title" > Suscripciones a viajes</h2>
                <div class="trips-list row">
                    <div class="col-xs-24 col-md-12" v-for="subs in subscriptions" :key="subs.id">
                        <subscriptionItem :subscription="subs" :user="user"></subscriptionItem>
                    </div>

                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No tienes ninguna suscripción.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    Cargando suscripciones ...
                </p>
            </Loading>
        </div>


        <div class="col-xs-24" v-if="oldTrips">
            <h2>Mis viajes pasados</h2>
            <Loading :data="oldTrips">
                <div class="trips-list">
                    <Trip v-for="trip in oldTrips" :trip="trip" :user="user"></Trip>
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
            alreadyAlerted: false
        };
    },
    mounted () {
        this.tripAsDriver();
        this.tripAsPassenger();
        this.pendingRate();
        this.getPendingRequest().then(() => {
            this.oldTripsAsDriver();
            this.oldTripsAsPassenger();
        });
        this.findSubscriptions();
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'rates/pendingRates',
            pendingRequest: 'passenger/pendingRequest',
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        })
    },

    methods: {
        ...mapActions({
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            pendingRate: 'rates/pendingRates',
            getPendingRequest: 'passenger/getPendingRequest',
            oldTripsAsDriver: 'myTrips/oldTripsAsDriver',
            oldTripsAsPassenger: 'myTrips/oldTripsAsPassenger',
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
                console.log(newValue, oldValue);
                if (newValue && newValue.length >= 0 && !this.alreadyAlerted) {
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
