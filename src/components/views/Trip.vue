<template>
    <div class='container'>
        <template v-if="trip">
            <div class="trip-detail-component">
                <div class="row form">
                    <div ref="rightPanel" class="white-background" :class="themeClasses">
                        <div class='row'>
                            <div :class="columnClass[0]" class="column" v-if="columnComponent[0] && columnComponent[0].length">
                                <template v-for="childComponent in columnComponent[0]">
                                    <component :is="childComponent" :key="childComponent._scopeId"></component>
                                </template>
                            </div>
                            <div :class="columnClass[1]" class="column" v-if="columnComponent[1] && columnComponent[1].length">
                                <template v-for="childComponent in columnComponent[1]">
                                    <component :is="childComponent" :key="childComponent._scopeId"></component>
                                </template>
                            </div>
                            <div :class="columnClass[2]" class="column" v-if="columnComponent[2] && columnComponent[2].length">
                                <template v-for="childComponent in columnComponent[2]">
                                    <component :is="childComponent" :key="childComponent._scopeId"></component>
                                </template>
                            </div>
                            <modal :name="'modal'" v-if="showModalRequestSeat" @close="onModalClose" :title="'Carpoodatos'" :body="'Body'">
                                <h3 slot="header">
                                    <span>¡Carpoodatos!</span>
                                    <i v-on:click="onModalClose" class="fa fa-times float-right-close"></i>
                                </h3>
                                <div slot="body">
                                    <div class="text-left carpoodatos">
                                      <p>Antes de mandar solicitud de asiento, mandale mensaje a la otra persona para coordinar todo lo vinculado al viaje: punto de encuentro, punto de llegada,tamaño de bolsos, contribución para combustible y peajes, etc.</p>
                                      <p>Si mandaste solicitud de asiento y te aceptan el pedido, se genera el compromiso de viaje. Habilitándose la posibilidad de calificación 24hs después de comenzado el viaje. Tendrán 14 días para calificarse</p>
                                      <p>Podrán calificarse aunque el viaje se cancele, te bajen o te bajes del viaje.</p>
                                      <p>No pidas asiento si no tenés seguridad de que vas a viajar, muchas personas también están buscando el mismo viaje que vos. Si ocurriera algo que te impida viajar, avisale lo más rápido que puedas a la persona con que ibas a compartir el viaje.</p>
                                      <p>Cualquier duda escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o nuestras redes sociales.</p>
                                    </div>
                                    <div class="check" style="margin-bottom:10px;">
                                        <label class="check-inline">
                                            <input type="checkbox" name="acceptPassengerValor" value="0" v-model="acceptPassengerValue"><span> No volver a mostrar mensaje</span>
                                        </label>
                                    </div>
                                    <div class="text-center">
                                      <button class="btn btn-primary" @click="toMessages" v-if="!owner">Enviar mensaje</button>
                                      <button class="btn btn-primary" @click="toMakeRequest">Solicitar asiento</button>
                                    </div>
                                </div>
                            </modal>
                        </div>
                        <TripButtons @deleteTrip="deleteTrip()" @toMessages="toMessages()" @onMakeRequest="onMakeRequest()" @cancelRequest="cancelRequest()" :sending="sending" :isPassengersView="isPassengersView" />
                        <TripStats v-if="!isMobile && tripCardTheme === 'light'" />
                    </div>
                    <div :style="!this.isMobile ? { 'min-height': $refs.rightPanel ? $refs.rightPanel.clientHeight + 'px' : '440px' } : {}" class="col-xs-24 col-sm-9 col-sm-pull-15 col-md-8 col-md-pull-16 col-lg-7 col-lg-pull-17 driver-container" v-if="!isPassengersView && tripCardTheme !== 'light'">
                        <TripDriver />
                    </div>

                    <div class="col-xs-24 structure-div"  v-if="!isPassengersView">
                        <div class="col-xs-24 col-sm-12 col-md-9 matcheo-passengers"  v-if="matchingUsers && matchingUsers.length > 0">
                            <div>
                                <div v-if="owner">
                                    <h3 class="title-margined">
                                        Matcheos del viaje
                                    </h3>
                                    <div class="row matching-user-list">
                                        <div v-for="p in matchingUsers" class="list-item col-sm-24" v-bind:key="p.id">
                                            <div class="passenger-match">
                                                <input type="checkbox" v-model="selectedMatchingUser" v-bind:id="p.id" v-bind:value="p.id">
                                                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                                                <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                                                    {{ p.name }}
                                                </a>
                                                <button @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                                                        <i class="fa fa-comments" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                            <div>
                                                <small>
                                                    Viaja el {{ p.tripMatch.trip_date | moment('DD/MM') }}
                                                    <strong>{{ p.tripMatch.trip_date | moment('HH:mm') }}</strong>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-inline col-xs-24 send_to_all-form">
                                            <div class="input-group">
                                                <label for="message_all" class="sr-only">Mensaje para los usuarios seleccionados</label>
                                                <input type="text" id="message_all" class="form-control" placeholder="Envía a los seleccionados" v-model="messageToUsers">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-success" @click="onSendToAll">
                                                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                                                    </button>
                                                </span>
                                            </div><!-- /input-group -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <l-map :zoom="zoom" :center="center" style="width: calc(100% + 20px); height: 461px; overflow: hidden; margin-left: -10px; z-index: 0;" ref="map">
                            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                        </l-map>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div>
                Buscando el viaje, aguarde un segundo.
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import router from '../../router';
import bus from '../../services/bus-event';
import svgItem from '../SvgItem';
import modal from '../Modal';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import network from '../../services/network.js';
import TripLocation from '../elements/TripLocation';
import TripDriver from '../elements/TripDriver';
import TripDate from '../elements/TripDate';
import TripSeats from '../elements/TripSeats';
import TripData from '../elements/TripData';
import TripStats from '../elements/TripStats';
import TripDescription from '../elements/TripDescription';
import TripShare from '../elements/TripShare';
import TripPassengers from '../elements/TripPassengers';
import TripButtons from '../elements/TripButtons';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
import { LMap, LTileLayer } from 'vue2-leaflet';
import 'leaflet-routing-machine';
Vue.use(VueHead);
Vue.use(VueRouter);

export default {
    name: 'trip',
    data () {
        return {
            sending: false,
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            zoom: 4,
            center: { lat: -29.0, lng: -60.0 },
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                }
            ],
            matchingUsers: [],
            messageToUsers: '',
            selectedMatchingUser: [],
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showModalRequestSeat: false,
            acceptPassengerValue: 0
        };
    },

    head: {
        title: function () {
            return {
                inner: 'Viaje'
            };
        },
        meta: function () {
            if (this.trip) {
                return [
                    { p: 'og:description', c: this.trip.description },
                    { p: 'og:title', c: this.trip.points[0].json_address.ciudad + ' -> ' + this.trip.points[this.trip.points.length - 1].json_address.ciudad + ' | ' + moment(this.trip.trip_date).format('dddd DD/MM hh:mm') },
                    { p: 'og:image', c: this.carpoolear_logo }
                ];
            } else {
                return [];
            }
        }
    },

    methods: {
        ...mapActions({
            getTrip: 'getTrip',
            lookConversation: 'conversations/createConversation',
            selectConversation: 'conversations/select',
            make: 'passenger/makeRequest',
            cancel: 'passenger/cancel',
            remove: 'trips/remove',
            searchMatchers: 'trips/searchMatchers',
            sendToAll: 'conversations/sendToAll',
            changeProperty: 'profile/changeProperty'
        }),
        profileComplete () {
            if (!this.user.image || this.user.image.length === 0 || !this.user.description || this.user.description.length === 0) {
                router.replace({ name: 'profile_update' });
            } else {
                return true;
            }
        },
        deleteTrip () {
            if (window.confirm('¿Estás seguro que deseas cancelar el viaje?')) {
                this.sending = true;
                this.remove(this.trip.id).then(() => {
                    this.$router.replace({ name: 'trips' });
                }).catch(() => {
                    this.sending = false;
                });
            }
        },
        loadTrip () {
            this.getTrip(this.id).then(trip => {
                // this.trip = trip;
                this.points = trip.points;
                var self = this;
                setTimeout(() => { self.renderMap(); }, 500);
                if (this.owner) {
                    this.searchMatchers({ trip: this.trip }).then(users => {
                        console.log('matching', users);
                        this.matchingUsers = users;
                        if (users && users.length) {
                            this.selectedMatchingUser = users.map(u => u.id);
                            // console.log('selectedMatchingUser', users);
                        }
                    });
                }
            }).catch(error => {
                if (error) {
                    router.replace({ name: 'trips' });
                    // Ver que hacer
                    // this.trip = null;
                }
            });
        },

        toMessages () {
            console.log('tomessages');
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            if (this.profileComplete()) {
                this.sending = true;
                this.toUserMessages(this.trip.user);
            }
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

        onMakeRequest () {
            if (this.profileComplete()) {
                if (this.user.do_not_alert_request_seat || this.config.disable_user_hints) {
                    this.toMakeRequest();
                } else {
                    this.showModalRequestSeat = true;
                }
            }
        },

        toMakeRequest () {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            if (this.profileComplete()) {
                this.sending = true;
                this.showModalRequestSeat = false;
                this.make(this.trip.id).then((response) => {
                    this.sending = false;
                    this.trip.request = 'send';
                    if (response && response.data && response.data.request_state) {
                        if (response.data.request_state === 0) {
                            dialogs.message('La solicitud fue enviada.');
                        } else if (response.data.request_state === 1) {
                            dialogs.message('Te has subido al viaje.');
                        } else if (response.data.request_state === 4 && this.config.module_trip_seats_payment) {
                            let baseUrl = network.getBaseURL();
                            let url = baseUrl + '/transbank?tp_id=' + response.data.id;
                            if (window.location.protocol.indexOf('http') >= 0) {
                                window.location.href = url;
                            } else {
                                var popup = window.open(url, '_blank', 'location=no,hidden=yes,zoom=no');
                                popup.addEventListener('message', (params) => {
                                    console.log('message', params);
                                    popup.close();
                                }, false);
                            }
                        } else {
                            dialogs.message('La solicitud fue enviada.');
                        }
                    } else {
                        dialogs.message('La solicitud fue enviada.');
                    }
                }).catch(() => {
                    this.sending = false;
                    dialogs.message('Ocurrió un problema al solicitar, por favor intente nuevamente luego.', { estado: 'error' });
                });
            }
        },

        cancelRequest () {
            if (window.confirm('¿Estás seguro que deseas bajarte del viaje?')) {
                this.sending = true;
                this.cancel({ user: this.user, trip: this.trip }).then(() => {
                    this.sending = false;
                    dialogs.message('Te has bajado del viaje.');
                    if (this.trip.request !== 'send') {
                        let index = this.trip.passenger.findIndex(item => item.id === this.user.id);
                        this.trip.passenger.splice(index, 1);
                    } else {
                        this.trip.request = '';
                    }
                }).catch(() => {
                    this.sending = false;
                });
            }
        },

        removePassenger (user) {
            if (window.confirm('¿Estás seguro que deseas bajar a este pasajero de tu viaje?')) {
                this.sending = true;
                this.cancel({ user: user, trip: this.trip }).then(() => {
                    this.sending = false;
                    let index = this.trip.passenger.findIndex(item => item.id === user.id);
                    this.trip.passenger.splice(index, 1);
                }).catch(() => {
                    this.sending = false;
                });
            }
        },

        onBackClick () {
            router.back();
        },

        renderMap () {
            if (this.$refs.map) {
                let map = this.$refs.map.mapObject;
                console.log('trip', this.trip);
                /* eslint-disable no-undef */
                let points = this.trip.points.map(point => L.latLng(point.lat, point.lng));
                let control = L.Routing.control({
                    waypoints: points,
                    language: 'es'
                });
                control.addTo(map);
            }
        },

        restoreData (trip) {
            this.points = [];
            trip.points.forEach(p => {
                let point = {
                    name: p.address,
                    json: p.json_address,
                    location: {
                        lat: p.lat,
                        lng: p.lng
                    },
                    place: null
                };
                this.points.push(point);
            });
            this.date = trip.trip_date.split(' ')[0];
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            this.calcRoute();
        },

        calcRoute () {
            for (let i = 0; i < this.points.length; i++) {
                if (!this.points[i].name) {
                    return;
                }
            }
        },
        onSendToAll () {
            let users = this.matchingUsers.filter(u => this.selectedMatchingUser.indexOf(u.id) >= 0);
            console.log(users, this.messageToUsers);
            if (this.messageToUsers && users && users.length) {
                this.sendToAll({
                    message: this.messageToUsers,
                    users: users
                }).then(() => {
                    this.messageToUsers = '';
                    dialogs.message('El mensaje fue enviado.');
                });
            }
        },
        onModalClose () {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.showModalRequestSeat = false;
        }
    },

    mounted () {
        this.loadTrip();
        bus.on('back-click', this.onBackClick);
    },

    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },

    watch: {
        'id': function (value) {
            this.loadTrip();
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            trip: 'trips/currentTrip',
            config: 'auth/appConfig',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        }),
        themeClasses () {
            return this.tripCardTheme === 'light' ? 'col-xs-24' : 'col-xs-24 col-sm-push-9 col-sm-15 col-md-push-8 col-md-16 col-lg-17 col-lg-push-7';
        },
        columnClass () {
            return this.tripCardTheme === 'light' ? ['col-sm-8 col-md-8 col-lg-7', 'col-sm-9 col-md-10 col-lg-11', 'col-sm-7 col-md-6 col-lg-5'] : ['col-sm-14 col-md-14', 'col-sm-10 col-md-10'];
        },
        columnComponent () {
            if (this.tripCardTheme === 'light' && this.isMobile) {
                return [
                    [TripDriver, TripLocation],
                    [TripData, TripStats, TripDescription, TripShare, TripPassengers]
                ];
            } else if (this.tripCardTheme === 'light') {
                return [
                    [TripDriver, TripDescription],
                    [TripLocation, TripDate, TripSeats, TripPassengers],
                    [TripData]
                ];
            } else {
                return [
                    [TripLocation, TripDate, TripSeats],
                    [TripData, TripStats, TripShare, TripPassengers]
                ];
            }
        },
        owner () {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        isPassengersView () {
            if (this.location) {
                return this.location === 'passenger';
            }
            return false;
        }
    },

    components: {
        svgItem,
        LMap,
        LTileLayer,
        modal,
        TripLocation,
        TripDriver,
        TripDate,
        TripSeats,
        TripData,
        TripStats,
        TripDescription,
        TripShare,
        TripPassengers,
        TripButtons
    },

    props: [
        'id',
        'location'
    ]
};
</script>

<style scoped>
    .trip-detail-component .structure-div {
        margin-top: 1rem;
        z-index: 0;
        position: relative;
        min-height: 418px;
        /* overflow: hidden; */
        top: 0;
    }
    .trip-detail-component .driver-container {
        margin-top: 0;
    }
    .trip-detail-component .driver-container::after {
        top: -23px;
        left: 4.4em;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-color: rgba(136, 183, 213, 0);
        border-bottom-color: var(--secondary-background);
        border-width: 12px;
        margin-left: -12px;
        z-index: 1;
    }
    .container {
        padding-top: 0;
    }
    .trip-detail-component .column {
        padding: 0 4em;
    }
    .trip-detail-component .column:first-of-type {
        padding: 0 1em;
    }
    .trip-detail-component .white-background {
        padding-top: 1.1rem;
    }
    .matcheo-passengers {
        background: #FFF;
        box-shadow: 0 0 4px 1px #CCC;
        border-radius: .4em;
        position: absolute;
        left: 1em;
        top: 1em;
        max-height: 400px;
        z-index: 100;
    }
    .matcheo-passengers h3 {
        font-size: 1.4em;
    }
    .matcheo-passengers .list-item {
        border: 0;
    }
    .matcheo-passengers .list-item .trip_passenger_name {
        color: var(--trip-mostly-free-color);
        font-weight: bold;
    }
    .matcheo-passengers .passenger-match {
        margin: 0 .5em;
        padding: .5em 0;
    }
    .passenger-match input {
        margin-right: 1em;
    }
    .passenger-match button {
        color: var(--secondary-background);
    }

    .passenger-match .trip_driver_img.circle-box.passenger {
        border: 2px solid var(--trip-almost-fill-color);
    }
        .send_to_all-form {
        padding: 1em;
    }
    .form-inline .input-group {
        width: 100%;
    }
    .send_to_all-form .btn {
        min-width: 100%;
    }
    .matching-user-list {
        max-height: 270px;
        overflow-y: auto;
    }
    .matching-user-list small {
        margin-left: 50px;
    }
    .matching-user-list .list-item:after {
        content: " ";
        display: block;
        width: 90%;
        margin: 0 auto;
        border-bottom: 1px solid #CCC;
        margin-top: .5rem;
    }
    @media only screen and (min-width: 400px) and (max-width: 767px) {
        .trip-detail-component .structure-div {
            top: -15px;
        }
    }
    @media only screen and (min-width: 768px) {
        .container {
            padding-top: 1.5em;
        }
        .trip-detail-component .white-background {
            padding-top: 0;
            min-height: 440px;
        }
        .trip-detail-component .driver-container {
            margin-top: 0;
        }
        .trip-detail-component .driver-container::after {
            top: 36px;
            right: -23px;
            left: unset;
            border-color: rgba(136, 183, 213, 0);
            border-left-color: var(--secondary-background);
            border-width: 12px;
            margin-left: -12px;
            z-index: 1;
        }
        .trip-detail-component .structure-div {
            margin-top: 0;
            margin-bottom: 2rem;
        }
        .trip-detail-component .column,
        .trip-detail-component .column:first-of-type {
            padding: 2em 1em 2em 1em;
        }
    }
    @media only screen and (max-width: 768px) {
        .trip-detail-component .driver-container {
            border-radius: 0;
        }
        .trip-detail-component .structure-div {
            overflow: visible;
            padding: 0;
            margin-bottom: 3.5em;
        }
        .matcheo-passengers {
            position: static;
            left: 0;
            top: 0;
            max-height: auto;
            float: none;
            margin: 1.5rem 0 -1rem 0;
            border-radius: 0;
            padding-bottom: 1em;
        }
        .matcheo-passengers .title-margined {
            margin: 0;
            padding: 1em 0;
        }
    }
</style>
