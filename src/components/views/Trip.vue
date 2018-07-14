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
                                            <div class="col-xs-4 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div class="col-xs-20">
                                            <span class="trip_location_from_city">{{ trip.points[0].json_address.ciudad }}</span>
                                            <span class="trip_location_from_state-country">{{ trip.points[0].json_address.provincia | googleInfoClean }}</span>
                                            </div>
                                        </div>
                                        <div class="row trip_location_to">
                                            <div class="col-xs-4 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div class="col-xs-20">
                                                <span class="trip_location_from_city">{{ trip.points[trip.points.length - 1].json_address.ciudad }}</span>
                                                <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.provincia | googleInfoClean }} </span>
                                            </div>
                                        </div>
                                        <div class="col-xs-4 trip_location-dot-line">
                                            <div></div>
                                        </div>
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
                                    <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date">
                                        <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
                                        -
                                        <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("HH:mm") }}</span>
                                    </time>
                                </div>
                                <div class="row"  v-if="!trip.is_passenger">
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
                                </div>

                                <div class="row trip-stats"  v-if="!trip.is_passenger && !isPasssengersView">
                                    <div>
                                        <span>Distancia a recorrer</span><br>
                                        <span>{{ distanceString }} <abbr title="kilometros">km</abbr></span>
                                    </div>
                                    <div>
                                        <span>Tiempo estimado de viaje</span><br>
                                        <span>{{ trip.estimated_time }} horas</span>
                                    </div>
                                    <div>
                                        <span>Huella de carbono (<abbr title="aproximada">aprox</abbr>)</span><br>

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
                                    <div class="col-xs-24" v-if="owner">
                                        <h4 class="title-margined">
                                            <strong>Pasajeros subidos</strong>
                                        </h4>
                                        <div v-for="p in trip.passenger" v-if="trip.passenger.length" class="list-item">
                                            <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                                            <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                                                {{ p.name }}
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
                                </div>
                            </div>
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
                                        <button class="btn btn-primary" @click="makeRequest" v-if="canRequest && trip.seats_available > 0" :disabled="sending">
                                            Solicitar asiento
                                        </button>
                                        <button class="btn" v-if="!canRequest" @click="cancelRequest" :disabled="sending">
                                            Solicitud enviada
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
                                    <div class="profile-info--ratings">
                                        <svgItem icon="thumbUp" size="18"></svgItem> <span> {{trip.user.positive_ratings}} </span>
                                        <svgItem icon="thumbDown" size="18"></svgItem> <span> {{trip.user.negative_ratings}} </span>
                                    </div>
                                    <div v-if="trip.user.has_pin == 1" class="user_pin">
                                        <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" title="Aportante en la campaña mi media naranja carpoolera" />
                                    </div>
                                </div>
                            </div>
                             <div class="row">
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
                                                <input type="checkbox" v-model="selectedMatchingUser" :value="p.id">
                                                <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                                                <a :href="'/profile/' + p.id " @click="toUserProfile(p)" class="trip_passenger_name">
                                                    {{ p.name }}
                                                </a>
                                                <button @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                                                        <i class="fa fa-comments" aria-hidden="true"></i>
                                                </button>
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
                        <gmap-map
                            :center="center"
                            :zoom="zoom"
                            style="height: 524px"
                            ref="map"
                        >
                            <gmap-marker
                                :key="index"
                                v-for="(m, index) in points"
                                :position="m.location"
                                :clickable="true"
                                :draggable="true"
                                @click="center=m.location"
                                v-if="m.location"
                            ></gmap-marker>
                        </gmap-map>
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
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
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
            center: {lat: -29.0, lng: -60.0},
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
            selectedMatchingUser: []
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
            sendToAll: 'conversations/sendToAll'
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
                    this.$router.replace({name: 'trips'});
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
                            this.selectedMatchingUser = users.reduce(u => u.id);
                        }
                    });
                }
            }).catch(error => {
                if (error) {
                    router.replace({name: 'trips'});
                    // Ver que hacer
                    // this.trip = null;
                }
            });
        },

        toMessages () {
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
            router.push({
                name: 'profile',
                params: {
                    id: user.id,
                    userProfile: user,
                    activeTab: 1
                }
            });
        },

        makeRequest () {
            if (this.profileComplete()) {
                this.sending = true;
                this.make(this.trip.id).then(() => {
                    dialogs.message('La solicitud fue enviada.');
                    this.sending = false;
                    this.trip.request = 'send';
                }).catch(() => {
                    this.sending = false;
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
                this.$refs.map.$mapCreated.then(() => {
                    /* eslint-disable no-undef */
                    this.directionsService = new google.maps.DirectionsService();
                    this.directionsDisplay = new google.maps.DirectionsRenderer();
                    this.directionsDisplay.setMap(this.$refs.map.$mapObject);
                    this.restoreData(this.trip);
                });
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

            this.directionsService.route({
                origin: this.points[0].name,
                destination: this.points[this.points.length - 1].name,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    /* encode path */
                    this.directionsDisplay.setDirections(response);

                    let path = response.routes[0].overview_path;
                    let encodeString = google.maps.geometry.encoding.encodePath(path);
                    this.trip.enc_path = encodeString;

                    let totalDistance = 0;
                    let totalDuration = 0;
                    let legs = response.routes[0].legs;
                    for (let i = 0; i < legs.length; ++i) {
                        totalDistance += legs[i].distance.value;
                        totalDuration += legs[i].duration.value;
                    }
                    this.trip.distance = totalDistance;
                    this.duration = totalDuration;
                    this.co2 = parseFloat(totalDistance * 0.15).toFixed(2); /* distancia por 0.15 kilos co2 en promedio por KM recorrido  */
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });
        },
        onSendToAll () {
            let users = this.matchingUsers.filter(u => this.selectedMatchingUser.indexOf(u.id) >= 0);
            console.log(users);
            if (this.messageToUsers && users && users.length) {
                /* this.sendToAll({
                    message: this.messageToUsers,
                    users: users
                }).then(() => {
                    this.messageToUsers = '';
                    dialogs.message('El mensaje fue enviado.');
                }); */
            }
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
            isMobile: 'device/isMobile'
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
            return this.trip.passenger.findIndex(item => item.id === this.user.id) >= 0;
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
        }
    },

    components: {
        svgItem
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
        min-height: 460px;
        overflow: hidden;
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
        border-bottom-color: #016587;
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
            max-height: 11rem;
            min-height: 9rem;
        }
        .trip-detail-component .quote {
            margin-left: 0;
        }
        .trip-detail-component .driver-container::after {
            top: 36px;
            right: -23px;
            left: unset;
            border-color: rgba(136, 183, 213, 0);
            border-left-color: #016587;
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

    @media only screen and (max-width: 768px) {
        .trip-detail-component .driver-container {
            border-radius: 0;
        }
        .trip-detail-component .structure-div {
            overflow: visible;
            padding: 0;
        }
        .matcheo-passengers {
            position: static;
            left: 0;
            top: 0;
            max-height: auto;
            float: none;
            margin: -1rem 0;
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
</style>
