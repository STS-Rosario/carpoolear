<template>
    <div class="new-trip-component form form-trip container">
        <div class="row">
            <div class="col-xs-8">
                <fieldset class="trip-type-selection">
                    <div class="radio-option">
                        <input type="radio" id="type-driver" value="0" v-model="trip.is_passenger">
                        <label for="type-driver"  class="control-label">Como conductor</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="type-passenger" value="1" v-model="trip.is_passenger">
                        <label for="type-passenger" class="control-label">Como pasajero</label>
                    </div>
                </fieldset>
                <div class="trip_terms">
                    <input type="checkbox" id="no-lucrar" />
                    <label for="no-lucrar" class="trip_terms_label">Me comprometo a no lucrar con el viaje</label>
                </div>
            </div>
            <div class="col-xs-8 xcv">
                <div class="trip_points">
                    <div v-for="(m, index) in points" class="trip_point">
                        <span v-if="index == 0" class="sr-only">Origen</span>
                        <span v-if="index == points.length - 1" class="sr-only">Destino</span>
                        <GmapAutocomplete  :types="['(cities)']" :componentRestrictions="{country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>
                    </div>
                </div>
            </div>
            <div class="col-xs-8 xcv">
                <div class="trip_information">
                        <ul class="no-bullet">
                            <li class="list_item">
                                <div class="label-soft">Distancia</div>
                                <div>{{distanceString}}</div>
                            </li>
                            <li class="list_item">
                                <div class="label-soft">Tiempo estimado</div>
                                <div>{{estimatedTimeString}}  </div>
                            </li>
                            <li class="list_item">
                                <div class="label-soft">CO2</div>
                                <div>{{CO2String}}</div>
                            </li>
                        </ul>
                </div>
            </div>
        </div> 
        <div class="row">
            <div class="col-xs-8">
            </div>
            <div class="col-xs-8"> 
                <div class="trip_datetime">
                    <div class="trip_date">
                        <label for="date" class="sr-only">Día </label>
                        <Calendar :class="'form-control form-control-with-icon form-control-date'" :value="date" @change="(date) => this.date = date"></Calendar>
                    </div>
                    <div class="trip_time">
                        <label for="time" class="sr-only">Hora</label>
                        <input type="text" v-model="time" class="form-control form-control-with-icon form-control-time" id="time" placeholder="Hora" />
                    </div>
                </div>
                <div class="trip_seats-available">
                    <fieldset>
                        <legend class="label-for-group">Lugares disponibles</legend>
                        <span class="radio-inline">
                            <input type="radio" id="seats-one" value="1" v-model="trip.total_seats">
                            <label for="seats-one">1</label>    
                        </span>
                        <span class="radio-inline">
                            <input type="radio" id="seats-two" value="2" v-model="trip.total_seats">
                            <label for="seats-two">2</label>    
                        </span>
                        <span class="radio-inline">
                            <input type="radio" id="seats-three" value="3" v-model="trip.total_seats">
                            <label for="seats-three">3</label>    
                        </span>
                        <span class="radio-inline">
                            <input type="radio" id="seats-four" value="4" v-model="trip.total_seats">
                            <label for="seats-four">4</label>    
                        </span>
                    </fieldset>
                </div>
                <div class="trip-comment">
                    <label for="trip_comment"  class="label-for-group"> Comentario de pasajero </label>
                    <textarea v-model="trip.description" id="trp_comment" class="form-control"></textarea>
                </div>
            </div>
            <div class="col-xs-8">
                <fieldset class="trip-privacity">
                    <legend class="label-for-group"> Privacidad del viaje </legend>
                    <ul class="no-bullet">
                        <li>    
                            <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
                            <label for="privacity-public" class="label-soft">Publicos</label>    
                        </li>
                        <li>
                            <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                            <label for="privacity-friend" class="label-soft">Amigos</label>    
                        </li>
                        <li>    
                            <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
                            <label for="privacity-friendofriend" class="label-soft">Amigos de Amigos</label>     
                        </li>
                    </ul>
                </fieldset>

                <button class="trip-create btn btn-primary btn-lg btn-shadowed" @click="save">
                    <span v-if="!updatingTrip">CREAR</span>
                    <span v-else>Actualizar</span>
                </button>

            </div>
        </div> 
        <div class="row">
            <div class="col-xs-24 map"> 
                <div class="map_warning">* El recorrido del mapa es de referencia, puede no coincidir con el recorrido planeado por ud.</div>
                <gmap-map
                    :center="center"
                    :zoom="zoom"
                    style="width: 100%; height: 300px"
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

<script>
import {mapActions, mapGetters} from 'vuex';
import {parseStreet} from '../../services/maps.js';
import Calendar from '../Calendar';
import bus from '../../services/bus-event.js';
import router from '../../router';

export default {
    name: 'new-trip',
    props: {
        'id': {
            type: [String, Number],
            required: false
        }
    },
    components: {
        Calendar
    },
    data () {
        return {
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
            date: '',
            time: '',
            duration: '',
            trip: {
                'is_passenger': 0,
                'from_town': '',
                'to_town': '',
                'trip_date': '',
                'total_seats': 2,
                'friendship_type_id': 2,
                'estimated_time': '00:00',
                'distance': 0.0,
                'co2': 0.0,
                'description': '',
                'car_id': null,
                'enc_path': '123',
                'points': [] /* address json_address lat lng */
            },
            updatingTrip: null
        };
    },
    mounted () {
        let self = this;
        this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            /* eslint-disable no-undef */
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
            if (self.id) {
                self.loadTrip();
            }
        });

        bus.on('clear-click', this.onClearClick);
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' Kms';
        },
        estimatedTimeString () {
            let totalMinutes = Math.floor(this.duration / 60);
            let minutes = Math.floor(totalMinutes % 60);
            let hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return this.trip.co2 + ' Kg';
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update',
            'getTrip': 'getTrip'
        }),

        onClearClick () {
            console.log('clear click');
            router.back();
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

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                console.log(trip);
                if (this.user.id === trip.user.id) {
                    this.updatingTrip = trip;
                    this.restoreData(trip);
                } else {
                    this.$router.replace({ name: 'trips' });
                }
            }).catch(error => {
                console.log(error);
                if (error) {
                    this.$router.replace({ name: 'trips' });
                }
            });
        },

        save () {
            /* eslint-disable no-unreachable */
            this.trip.points = [];
            this.points.forEach(p => {
                let point = {};
                point.address = p.name;
                point.json_address = p.json;
                point.lat = p.location.lat;
                point.lng = p.location.lng;
                this.trip.points.push(point);
            });
            this.trip.from_town = this.points[0].name;
            this.trip.to_town = this.points[this.points.length - 1].name;
            this.trip.trip_date = this.date + ' ' + this.time;
            this.trip.estimated_time = this.estimatedTimeString;
            if (this.cars && this.cars.length) {
                this.trip.car_id = this.cars[0].id;
            }
            if (!this.updatingTrip) {
                this.createTrip(this.trip).then((t) => {
                    this.$router.replace({ name: 'detail_trip', params: { id: t.id } });
                });
            } else {
                this.trip.id = this.updatingTrip.id;
                this.updateTrip(this.trip).then(() => {
                    this.$router.replace({ name: 'detail_trip', params: { id: this.trip.id } });
                });
            }
        },

        getPlace (i, data) {
            this.points[i].place = data;
            this.points[i].name = data.formatted_address;
            this.points[i].json = parseStreet(data);
            this.center = this.points[i].location = {
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng()
            };
            this.calcRoute();
        },

        getPlaceholder (index) {
            if (this.points.length - 1 === index) {
                return 'Destino';
            } else if (index === 0) {
                return 'Origen';
            } else {
                return 'Ingrese punto intermedio';
            }
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
    }
};
</script>