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
                                            <span class="trip_location_from_state-country">{{ trip.points[0].json_address.provincia }} {{ trip.points[0].json_address.pais }}</span>
                                            </div>
                                        </div>
                                        <div class="row trip_location_to">
                                            <div class="col-xs-4 text-right">
                                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                            <div class="col-xs-20">
                                                <span class="trip_location_from_city">{{ trip.points[trip.points.length - 1].json_address.ciudad }}</span>
                                                <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.provincia }} {{ trip.points[trip.points.length - 1].json_address.pais }}</span>
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
                                        <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("h:mm a") }}</span>
                                    </time>
                                </div>
                                <div class="row">
                                    <div class="trip_seats-available col-xs-offset-4 col-sm-offset-4 col-xs-12">
                                        <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                                        <span class="trip_seats-available_label">Lugares<br>libres</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-offset-2 col-xs-12" v-if="trip.passenger.length">
                                        <h4>Pasajeros</h4>
                                        <ul>
                                            <li v-for="p in trip.passenger">
                                                {{p.name}}
                                                <span v-if="owner" @click="removePassenger(p)">
                                                    <i class="fa fa-times" aria-hidden="true"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-else style="height: 2em;"></div>
                                </div>
                            </div>
                            <div class="col-sm-10 col-md-10 column">
                                <div class="row trip-data">
                                    <span>Viaje Público</span><br>
                                    <span>Gastos compartidos</span>
                                </div>
                                <div class="row trip-stats">
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
                                        <span>{{ trip.distance * 1.5 }} <abbr title="kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr></span>
                                    </div>
                                </div>
                            </div>
                            <div class="buttons-container">
                                <router-link class="btn btn-primary" v-if="owner" :to="{name: 'update-trip', params: { id: trip.id}}"> Editar  </router-link>
                                <template v-if="!owner && !trip.is_passenger && !expired">
                                    <button class="btn btn-primary" @click="toMessages" v-if="!owner"> Coordinar viaje  </button>
                                    <template v-if="!isPassenger">
                                        <button class="btn btn-primary" @click="makeRequest" v-if="canRequest"> Solicitar asiento </button>
                                        <button class="btn" v-if="!canRequest" @click="cancelRequest"> Solicitud enviada </button>
                                    </template>

                                    <template v-if="isPassenger">
                                        <button class="btn btn-primary" @click="cancelRequest" v-if="canRequest"> Cancelar viaje </button>
                                    </template>
                                </template>
                                <template v-if="expired">
                                    <button class="btn btn-primary" disabled> Finalizado  </button>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-24 col-sm-9 col-sm-pull-15 col-md-8 col-md-pull-16 col-lg-7 col-lg-pull-17 driver-container">
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
                    <div class="col-xs-24 structure-div">
                    <gmap-map
                        :center="center"
                        :zoom="zoom"
                        style="height: 400px"
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

export default {
    name: 'trip',
    data () {
        return {
            // trip: null,
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
            ]
        };
    },

    methods: {
        ...mapActions({
            getTrip: 'getTrip',
            lookConversation: 'conversations/createConversation',
            make: 'passenger/makeRequest',
            cancel: 'passenger/cancel'
        }),

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                // this.trip = trip;
                this.points = trip.points;
                var self = this;
                setTimeout(() => { self.renderMap(); }, 500);
            }).catch(error => {
                console.log('error');
                if (error) {
                    router.replace({name: 'trips'});
                    // Ver que hacer
                    // this.trip = null;
                }
            });
        },

        toMessages () {
            this.lookConversation(this.trip.user).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            });
        },

        makeRequest () {
            this.sending = true;
            this.make(this.trip.id).then(() => {
                this.sending = false;
                this.trip.request = 'send';
            }).catch(() => {
                this.sending = false;
            });
        },

        cancelRequest () {
            this.sending = true;
            this.cancel({ user: this.user, trip: this.trip }).then(() => {
                this.sending = false;
                if (this.trip.request !== 'send') {
                    let index = this.trip.passenger.findIndex(item => item.id === this.user.id);
                    this.trip.passenger.splice(index, 1);
                } else {
                    this.trip.request = '';
                }
            }).catch(() => {
                this.sending = false;
            });
        },

        removePassenger (user) {
            this.sending = true;
            this.cancel({ user: user, trip: this.trip }).then(() => {
                this.sending = false;
                let index = this.trip.passenger.findIndex(item => item.id === user.id);
                this.trip.passenger.splice(index, 1);
            }).catch(() => {
                this.sending = false;
            });
        },

        onBackClick () {
            router.back();
        },

        renderMap () {
            this.$refs.map.$mapCreated.then(() => {
                console.log('Map was created');
                /* eslint-disable no-undef */
                this.directionsService = new google.maps.DirectionsService();
                this.directionsDisplay = new google.maps.DirectionsRenderer();
                this.directionsDisplay.setMap(this.$refs.map.$mapObject);
                this.restoreData(this.trip);
            });
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
                    this.co2 = totalDistance * 0.15; /* distancia por 0.15 kilos co2 en promedio por KM recorrido  */
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });
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
            trip: 'trips/currentTrip'
        }),
        expired () {
            console.log(moment(this.trip.trip_date).format(), moment().format());
            return moment(this.trip.trip_date).format() < moment().format();
        },
        owner () {
            return this.user.id === this.trip.user.id;
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
        }
    },

    components: {
        svgItem
    },

    props: [
        'id'
    ]
};
</script>

<style scoped>
    .trip-detail-component .structure-div {
        margin-top: 1rem;
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
        }
        .trip-detail-component .white-background {
            padding-top: 0;
        }
        .trip-detail-component .driver-container {
            margin-top: 0;
        }
        .trip-detail-component .driver-profile div.row:last-child {
            max-height: 11rem;
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
</style>
