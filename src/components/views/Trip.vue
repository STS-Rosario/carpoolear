<template>
    <div class='container'>
        <template v-if="trip">
            <div class="trip-detail-component">
                <div class="row form">
                    <div class="col-xs-24 col-sm-push-9 col-sm-15 col-md-push-8 col-md-16 col-lg-17 col-lg-push-7 white-background">
                        <div class='row'>
                            <div class="col-sm-14 col-md-14 column">
                                <div class="trip_location">
                                    <template v-if="trip.points.length >= 2">
                                        <div class="row trip_location_from">
                                            <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                                                <span class="trip_from_time">{{ trip.trip_date | moment("HH:mm") }} </span>
                                            </div>
                                            <div class="col-xs-2 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true" v-if="tripCardTheme !== 'light'"></i>
                                                <i class="fa fa-circle" aria-hidden="true" v-else></i>
                                            </div>
                                            <div class="col-xs-18">
                                            <span class="trip_location_from_city">{{ getLocationName(trip.points[0]) }}</span>
                                            <span class="trip_location_from_state-country">{{ getStateName(trip.points[0])| googleInfoClean }}</span>
                                            </div>
                                        </div>
                                        <div class="row trip_inner_points">
                                            <div class="trip_point" v-for="(p, index) in trip.points.slice(1, trip.points.length - 1)">
                                                <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                                                    <span class="trip_to_time"> </span>
                                                </div>
                                                <div class="col-xs-2 text-right">
                                                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                                                </div>
                                                <div class="col-xs-18">
                                                    <span class="trip_location_inner_city">{{ getLocationName(p) }}</span>
                                                    <span class="trip_location_inner_state-country">{{ getStateName(p) | googleInfoClean }} </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row trip_location_to">
                                            <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                                                <span class="trip_to_time">{{ tripArrivingTime | moment("HH:mm") }} </span>
                                            </div>
                                            <div class="col-xs-2 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div class="col-xs-18">
                                                <span class="trip_location_from_city">{{ getLocationName(trip.points[trip.points.length - 1]) }}</span>
                                                <span class="trip_location_from_state-country">{{ getStateName(trip.points[trip.points.length - 1]) | googleInfoClean }} </span>
                                            </div>
                                        </div>
                                        <!-- <div class="col-xs-4 trip_location-dot-line">
                                            <div></div>
                                        </div> -->
                                    </template>
                                    <template v-else>
                                        <div class="row trip_location_from">
                                            <div class="col-xs-4 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div  class="col-xs-20">
                                                {{ trip.from_town }}
                                            </div>
                                        </div>
                                        <div class="row trip_location_to">
                                            <div class="col-xs-4 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div class="col-xs-20">
                                                {{ trip.to_town }}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="row">
                                    <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date" v-if="tripCardTheme !== 'light'">
                                        <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
                                        -
                                        <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("HH:mm") }}</span>
                                    </time>
                                </div>
                                <div class="row"  v-if="!trip.is_passenger && tripCardTheme !== 'light'">
                                    <div class="trip_seats-available col-xs-offset-4 col-sm-offset-4 col-xs-12">
                                        <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                                        <span class="trip_seats-available_label">Lugares<br>libres</span>
                                    </div>
                                </div>
                                <div style="height: 3.5em;"></div>
                            </div>
                            <div class="col-sm-10 col-md-10 column">
                                <div class="row trip-data" v-if="trip.is_passenger">
                                    <strong class="warning-is-passenger">Pasajero que busca viaje</strong>
                                </div>
                                <div class="row trip-data"  v-if="!isPasssengersView">
                                    <em v-if="trip.friendship_type_id == 2">
                                        <i class="fa fa-globe" aria-hidden="true"></i>
                                        Viaje público
                                    </em>
                                    <em v-if="trip.friendship_type_id == 1">
                                        <i class="fa fa-users" aria-hidden="true"></i>
                                        Amigos de amigos
                                    </em>
                                    <em v-if="trip.friendship_type_id == 0">
                                        <i class="fa fa-user" aria-hidden="true"></i>
                                        Sólo amigos
                                    </em>
                                    <em v-if="trip.allow_smoking > 0">
                                        <svgItem icon="smoking" size="18"></svgItem>
                                        Se puede fumar
                                    </em>
                                    <em v-else>
                                        <svgItem icon="no-smoking" size="18"></svgItem>
                                        No fumar
                                    </em>

                                    <em v-if="trip.allow_pets > 0">
                                        <svgItem icon="pets" size="18"></svgItem>
                                        Mascotas
                                    </em>
                                    <em v-else>
                                        <svgItem icon="no-animals" size="18"></svgItem>
                                        No mascotas
                                    </em>

                                    <em v-if="trip.allow_kids > 0">
                                        <svgItem icon="kids" size="18"></svgItem>
                                        Niños
                                    </em>
                                    <em v-else>
                                        <svgItem icon="no-kids" size="18"></svgItem>
                                        No niños
                                    </em>
                                </div>

                                <!-- link, leaf, clock -->
                                <div class="row trip-stats"  v-if="!trip.is_passenger && !isPasssengersView">
                                    <div>
                                        <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                        <span v-if="tripCardTheme !== 'light'">Distancia a recorrer</span><br v-if="tripCardTheme !== 'light'">
                                        <span>{{ distanceString }} <abbr title="kilometros">km</abbr></span>
                                    </div>
                                    <div>
                                        <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                        <span v-if="tripCardTheme !== 'light'">Tiempo estimado de viaje</span><br v-if="tripCardTheme !== 'light'">
                                        <span>{{ trip.estimated_time }} horas</span>
                                    </div>
                                    <div>
                                        <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
                                        <span v-if="tripCardTheme !== 'light'">Huella de carbono (<abbr title="aproximada">aprox</abbr>)</span><br v-if="tripCardTheme !== 'light'">
                                        <span>{{ (trip.distance / 1000 * 1.5).toFixed(2) }} <abbr title="kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr></span>
                                    </div>
                                </div>
                                <div class="trip_share row"  v-if="!isPasssengersView">
                                    <a  :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl" target="_blank" aria-label="Compartir en Facebook" class="lnk lnk-social-network lnk-facebook" @click="onShareLinkClick">
                                        <i class="fa fa-facebook" aria-hidden="true"></i>
                                    </a>
                                    <a :href="'https://twitter.com/intent/tweet/?text=Publiqu%C3%A9%20un%20viaje%20para%20compartir%20en%20Carpoolear%20&via=carpoolear&url='  + currentUrl" target="_blank" aria-label="Compartir en Twitter"   class="lnk lnk-social-network lnk-twitter" @click="onShareLinkClick">
                                        <i class="fa fa-twitter" aria-hidden="true"></i>
                                    </a>
                                    <a :href="'https://plus.google.com/share?url='  + currentUrl" target="_blank" aria-label="Compartir en Google+"  class="lnk lnk-social-network lnk-google-plus"  @click="onShareLinkClick">
                                        <i class="fa fa-google-plus" aria-hidden="true"></i>
                                    </a>
                                    <a :href="'whatsapp://send?text=Publiqu%C3%A9%20un%20viaje%20para%20compartir%20en%20Carpoolear%20'  + currentUrl" target="_blank" aria-label="Compartir en Whats App"   class="lnk lnk-social-network lnk-whatsapp"  v-if="isMobile" @click="onWhatsAppShareClick">
                                        <i class="fa fa-whatsapp" aria-hidden="true"></i>
                                    </a>
                                </div>

                                <div class="row passengers" v-if="!trip.is_passenger">
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
                            </div>
                            <modal :name="'modal'" v-if="showModalRequestSeat" @close="onModalClose" :title="'Test'" :body="'Body'">
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
                            <div class="buttons-container"  v-if="!isPasssengersView">
                                <router-link class="btn btn-primary" v-if="owner && !expired" :to="{name: 'update-trip', params: { id: trip.id}}">
                                    Editar
                                </router-link>
                                <a class="btn btn-primary" v-if="owner && !expired" @click="deleteTrip" :disabled="sending">
                                    Cancelar viaje
                                </a>
                                <template v-if="!owner && !expired">
                                    <button class="btn btn-primary" @click="toMessages" v-if="!owner">
                                        Enviar mensaje
                                    </button>
                                </template>
                                <template v-if="!owner && !trip.is_passenger && !expired">
                                    <template v-if="!isPassenger">
                                        <button class="btn btn-primary" @click="onMakeRequest" v-if="canRequest && trip.seats_available > 0" :disabled="sending">
                                            <template v-if="trip.user.autoaccept_requests">
                                                <template v-if="config && config.module_trip_seats_payment">
                                                    Reservar $ {{ trip.seat_price }}
                                                </template>
                                                <template v-else>
                                                    Reservar
                                                </template>
                                            </template>
                                            <template v-else>
                                                Solicitar asiento
                                            </template>

                                        </button>
                                        <button class="btn" v-if="!canRequest" @click="cancelRequest" :disabled="sending">
                                            Solicitado (RETIRAR)
                                        </button>
                                    </template>

                                    <template v-if="isPassenger">
                                        <button class="btn btn-primary" @click="cancelRequest" v-if="canRequest" :disabled="sending">
                                            Bajarme del viaje
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
                        </div>
                    </div>
                    <div class="col-xs-24 col-sm-9 col-sm-pull-15 col-md-8 col-md-pull-16 col-lg-7 col-lg-pull-17 driver-container" v-if="!isPasssengersView">
                        <div class="driver-profile">
                            <div class="row">
                                <div class="col-xs-9 col-md-8 col-lg-8">
                                    <div class="trip_driver_img circle-box" v-imgSrc:profile="getUserImage"></div>
                                </div>
                                <div class="col-xs-15 driver-data">
                                    <div>{{trip.user.name}}</div>
                                    <div class="trip_driver_ratings" v-if="config ? config.trip_stars : false && tripStars && tripStars.length > 0">
                                        <div v-if="this.trip.user.positive_ratings || this.trip.user.positive_ratings">
                                            <svg-item v-for="{value, id} in tripStars" :key="id" :size="$cssvar('--calification-star-size')" :icon="'star' + value"></svg-item>
                                        </div>
                                        <div v-else>
                                            {{ $t('noCalificado') }}
                                        </div>
                                    </div>
                                    <div class="profile-info--ratings" v-else>
                                        <svgItem icon="thumbUp" size="18"></svgItem> <span> {{trip.user.positive_ratings}} </span>
                                        <svgItem icon="thumbDown" size="18"></svgItem> <span> {{trip.user.negative_ratings}} </span>
                                    </div>
                                    <div class="user_pin">
                                        <span v-if="trip.user.has_pin == 1">
                                            <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" title="Aportante en la campaña mi media naranja carpoolera" />
                                        </span>
                                        <span v-if="trip.user.is_member == 1">
                                            <img src="https://carpoolear.com.ar/static/img/pin_member.png" alt="" title="Miembro del equipo de Carpoolear" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                             <div class="row" v-if="tripCardTheme !== 'light'">
                                <div class="col-md-24">
                                    <router-link class="btn-primary btn-search btn-shadowed-black" :to="{name: 'profile', params: {id: getUserProfile, userProfile: trip.user}}"> Ver Perfil </router-link>
                                </div>
                            </div>
                            <div class="row italic quote" :class="descriptionLength" v-if="trip.description && trip.description.length">
                                <i class="fa fa-quote-left" aria-hidden="true"></i>
                                <span> {{trip.description}} </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-24 structure-div"  v-if="!isPasssengersView">
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
            // trip: null,
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            sending: false,
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
            currentUrl: encodeURIComponent('https://carpoolear.com.ar/app' + this.$route.fullPath),
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
            changeProperty: 'profile/changeProperty',
            appConfig: 'auth/appConfig'
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
                this.toUserMessages(this.trip.user);
            }
        },

        toUserMessages (user) {
            this.lookConversation(user).then(conversation => {
                // this.selectConversation(conversation.id).then(data => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
                // });
            });
        },

        toUserProfile (user) {
            console.log('toUserProfile replace');
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
        },
        getLocationName (location) {
            if (location.json_address) {
                if (location.json_address.ciudad) {
                    return location.json_address.ciudad;
                }
                if (location.json_address.name) {
                    return location.json_address.name;
                }
            }
            return location.address;
        },
        getStateName (location) {
            if (location.json_address) {
                if (location.json_address.provincia) {
                    return location.json_address.provincia;
                }
                if (location.json_address.state) {
                    return location.json_address.state;
                }
            }
            return '';
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
            isMobile: 'device/isMobile',
            config: 'auth/appConfig'
        }),
        expired () {
            return moment(this.trip.trip_date).format() < moment().format();
        },
        owner () {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        canRequest () {
            return !this.owner && !this.trip.request;
        },
        isPassenger () {
            return this.trip.passenger.findIndex(item => item.user_id === this.user.id) >= 0;
        },
        getUserImage () {
            return this.user.id === this.trip.user.id ? this.user.image : this.trip.user.image;
        },
        getUserProfile () {
            return this.trip.user.id === this.user.id ? 'me' : this.trip.user.id;
        },
        descriptionLength () {
            return this.trip.description.length > 215 ? 'long-description' : '';
        },
        distanceString () {
            return Math.floor(this.trip.distance / 1000);
        },
        isPasssengersView () {
            if (this.location) {
                return this.location === 'passenger';
            }
            return false;
        },
        tripCardTheme () {
            return this.config ? this.config.trip_card_design : '';
        },
        tripArrivingTime () {
            if (this.trip && this.trip.estimated_time) {
                let minutes = 0;
                minutes = parseInt(this.trip.estimated_time.split(':')[0]) * 60;
                minutes += parseInt(this.trip.estimated_time.split(':')[1]);
                return moment(this.trip.trip_date).add(minutes, 'minutes');
            }
            return '';
        },
        tripStars () {
            if (this.trip && this.trip.user) {
                console.log('USUARIO', this.trip.user);
                let value = this.trip.user.positive_ratings / (this.trip.user.positive_ratings + this.trip.user.negative_ratings) * 5;
                let integerPart = Math.floor(value);
                let decimalPart = value - integerPart;
                let stars = [];
                for (let i = 1; i <= 5; i++) {
                    if (i < integerPart) {
                        stars.push({
                            id: i,
                            value: ''
                        });
                    } else {
                        if (i === integerPart) {
                            if (decimalPart >= 0.5) {
                                stars.push({
                                    id: i,
                                    value: ''
                                });
                            } else {
                                stars.push({
                                    id: i,
                                    value: '-half'
                                });
                            }
                        } else {
                            stars.push({
                                id: i,
                                value: '-empty'
                            });
                        }
                    }
                }
                return stars;
            } else {
                return [];
            }
        },
        acceptedPassengers () {
            return this.trip.passenger ? this.trip.passenger.filter(item => item.request_state === 1) : [];
        },
        waitingForPaymentsPassengers () {
            return this.trip.passenger ? this.trip.passenger.filter(item => item.request_state === 4) : [];
        }
    },

    components: {
        svgItem,
        LMap,
        LTileLayer,
        modal
    },

    props: [
        'id',
        'location'
    ]
};
</script>

<style scoped>
    :root {
        --trip-almost-fill-color: #D72521;
        --trip-mostly-free-color: #91B64C;
        --secondary-background: #016587;
    }

    .user_pin {
        margin-top: 1em;
    }
    .user_pin img {
        width: 40px;
    }
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
    .trip-detail-component .structure-div {
        margin-top: 1rem;
        z-index: 0;
        position: relative;
        min-height: 418px;
        /* overflow: hidden; */
        top: -43px;
    }
    .trip-detail-component .driver-container {
        margin-top: 0;
    }
    .trip-detail-component .driver-profile div.row:last-child {
        height: auto;
    }
    .trip-detail-component .quote {
        margin-left: 1em;
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
    .trip_datetime {
        margin-top: 0;
        margin-bottom: 0;
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
    .trip-detail-component .buttons-container button:first-child {
        margin-right: 0;
    }
    .trip-detail-component .buttons-container button {
        margin-bottom: .4em;
    }
    .trip-detail-component .buttons-container {
        text-align: center;
        margin-top: 1em;
        padding-bottom: 2rem;
    }
    .trip-detail-component .driver-data div:first-child {
        margin-top: .4em;
    }

    @media only screen and (min-width: 400px) and (max-width: 767px) {
        .trip-detail-component .trip_driver_img {
            width: 6.7rem;
            height: 6.7rem;
        }
        .trip-detail-component .structure-div {
            top: -15px;
        }

        .vue2leaflet-map {
          width: calc(100% + 10px)!important;
        }
    }
    @media only screen and (min-width: 768px) {
        .container {
            padding-top: 1.5em;
        }
        .trip-detail-component .buttons-container button:first-child {
            margin-right: 1em;
        }
        .trip-detail-component .buttons-container {
            left: 42px;
            bottom: -25px;
            position: absolute;
            padding-bottom: 0;
            z-index: 1;
        }
        .trip-detail-component .white-background {
            padding-top: 0;
        }
        .trip-detail-component .driver-container {
            margin-top: 0;
        }
        .trip-detail-component .driver-profile div.row:last-child {
            max-height: 12rem;
            min-height: 11rem;
        }
        .trip-detail-component .quote {
            margin-left: 0;
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
        }
        .trip_datetime {
            margin-top: 1rem;
            margin-bottom: 1.5rem;
        }
        .trip-detail-component .column,
        .trip-detail-component .column:first-of-type {
            padding: 2em 1em 2em 1em;
        }
        .trip-detail-component .driver-data div:first-child {
            margin-top: 16px;
        }
        .trip-detail-component .quote.long-description {
            font-size: 14px;
        }
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
    @media only screen and (max-width: 768px) {
        .trip-detail-component .driver-container {
            border-radius: 0;
        }
        .trip-detail-component .structure-div {
            overflow: visible;
            padding: 0;
            margin-bottom: 3em;
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
        .trip-detail-component .vue-map-container {
            position: relative;
            left: 0;
            top: 0;
            max-height: auto;
            float: none;
        }
    }
    .trip-data em {
        display: inline-block;
        width: 49%;
        padding-top: 6px;
    }
    .trip-data em > * {
        vertical-align: middle;
    }
    .trip-data em .fa {
        padding-right: 6px;
    }
    .trip-data em .svgItem {
        height: 25px;
        display: inline-block;
        padding-right: 6px;
    }
</style>
