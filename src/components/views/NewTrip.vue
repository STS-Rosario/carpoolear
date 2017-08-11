<template>
    <div class="new-trip-component container">
        <div class="form form-trip">
            <div class="row">
                <div class="col-sm-8">
                    <fieldset class="trip-type-selection">
                        <div class="radio-option">
                            <input type="radio" id="type-driver" value="0" v-model="trip.is_passenger" :disabled="updatingTrip">
                            <label for="type-driver"  class="control-label">Como conductor</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="type-passenger" value="1" v-model="trip.is_passenger" :disabled="updatingTrip">
                            <label for="type-passenger" class="control-label">Como pasajero</label>
                        </div>
                    </fieldset>
                    <div class="trip_terms">
                        <input type="checkbox" id="no-lucrar" v-model="no_lucrar" />
                        <div>
                            <label for="no-lucrar" class="trip_terms_label" :class="{'has-error': lucrarError.state }" >Me comprometo a no lucrar con el viaje</label>
                            <span class="tooltip-bottom" data-tooltip="No hay lucro mientras el conductor no pida una contribución mayor al costo de la nafta + los peajes vinculados al viaje, dividido la cantidad de viajeros (sí, el conductor es un viajero!!!). ¡Los asientos no tienen un valor! No sos un colectivo ;). Al no lucrar, evitas ser un transporte ilegal de pasajeros, lo cual genera problemas con la validez del seguro particular automotor. Tengamos un buen viaje y cuidemosnos entre todos :)">
                                <i class="fa fa-info-circle" aria-hidden="true"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-sm-16">
                    <div class="row">
                        <div class="panel-trip-data">
                            <div class="new-left trip_points col-sm-13 col-md-15">
                                <div v-for="(m, index) in points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}">
                                    <span v-if="index == 0" class="sr-only">Origen</span>
                                    <span v-if="index == points.length - 1" class="sr-only">Destino</span>
                                    <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="{country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete>
                                    <div @click="m.name = ''" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                                    <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                                </div>
                            </div>
                            <div class="col-sm-11 col-md-9">
                                <div class="trip_information">
                                        <ul class="no-bullet">
                                            <li class="list_item">
                                                <div class="label-soft">Distancia a recorrer</div>
                                                <div>{{distanceString}}</div>
                                            </li>
                                            <li class="list_item">
                                                <div class="label-soft">Tiempo estimado de viaje</div>
                                                <div>{{estimatedTimeString}}  </div>
                                            </li>
                                            <li class="list_item">
                                                <div class="label-soft">Huella de carbono (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                                                <div>{{CO2String}}</div>
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_datetime">
                                <div class="trip_date">
                                    <label for="date" class="sr-only">Día </label>
                                    <DatePicker :value="date" :minDate="minDate" :class="{'has-error': dateError.state}"></DatePicker>
                                    <span class="error" v-if="dateError.state"> {{dateError.message}} </span>
                                </div>
                                <div class="trip_time">
                                    <label for="time" class="sr-only">Hora</label>
                                    <input type="time" v-mask="'##:##'" v-model="time" class="form-control form-control-with-icon form-control-time" id="time" :class="{'has-error': timeError.state}" placeholder="Hora (12:00)" >
                                    <span class="error" v-if="timeError.state"> {{timeError.message}} </span>
                                    <!--<input type="text" v-model="time" />-->
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
                                <span class="error" v-if="seatsError.state"> {{seatsError.message}} </span>
                            </div>
                            <div class="trip-comment">
                                <label for="trip_comment"  class="label-for-group"> Comentario para los pasajeros </label>
                                <textarea maxlength="280" v-model="trip.description" id="trp_comment" class="form-control"></textarea>
                                <span class="error" v-if="commentError.state"> {{commentError.message}} </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9">
                            <fieldset class="trip-privacity">
                                <legend class="label-for-group"> Privacidad del viaje </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
                                        <label for="privacity-public" class="label-soft">Público</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                                        <label for="privacity-friend" class="label-soft">Solo amigos</label>
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
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { parseStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import bus from '../../services/bus-event.js';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import { getCityName } from '../../services/utility';
import moment from 'moment';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'new-trip',
    props: {
        'id': {
            type: [String, Number],
            required: false
        }
    },
    components: {
        DatePicker
    },
    data () {
        return {
            limitFilter: {
                type: 'fromto',
                from: moment().add(-1, 'days').format('DD/MM/YYYY')
            },
            minDate: moment().toDate(),
            lucrarError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            commentError: new Error(),
            seatsError: new Error(),
            no_lucrar: false,
            sameCity: false,
            zoom: 4,
            center: {lat: -29.0, lng: -60.0},
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error()
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error()
                }
            ],
            date: moment().format('DD/MM/YYYY'),
            time: '12:00',
            duration: 0,
            passengers: 0,
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
        this.time = moment().add(1, 'hours').format('HH:00');
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
        bus.on('date-change', (value) => {
            this.date = value;
        });
        this.$refs['input-0'][0].$el.addEventListener('input', this.checkInput);
        this.$refs['input-1'][0].$el.addEventListener('input', this.checkInput);
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
        this.$refs['input-0'][0].$el.removeEventListener('input', this.checkInput);
        this.$refs['input-1'][0].$el.removeEventListener('input', this.checkInput);
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },
        estimatedTimeString () {
            let totalMinutes = Math.floor(this.duration / 60);
            let minutes = Math.floor(totalMinutes % 60);
            let hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return Math.floor(this.trip.distance / 1000) * 1.5 + ' Kg';
        }
    },
    watch: {
        'no_lucrar': function () {
            this.lucrarError.state = false;
        },
        'date': function () {
            this.dateError.state = false;
        },
        'time': function () {
            this.timeError.state = false;
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update',
            'getTrip': 'getTrip'
        }),
        checkInput (event) {
            let value = event.target.value;
            let name = event.target.name;
            if (value === '') {
                this.points[name.split('-'[1])] = '';
            }
        },
        onClearClick () {
            router.back();
        },
        restoreData (trip) {
            this.no_lucrar = true;
            this.points = [];
            console.log(trip);
            trip.points.forEach(p => {
                let point = {
                    name: p.address,
                    json: p.json_address,
                    location: {
                        lat: p.lat,
                        lng: p.lng
                    },
                    place: JSON.stringify(p.json_address),
                    error: new Error()
                };
                this.points.push(point);
            });
            this.date = moment(trip.trip_date.split(' ')[0]).format('DD/MM/YYYY');
            console.log(this.date);
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.passengers = trip.passenger_count;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            this.calcRoute();
        },

        loadTrip () {
            this.getTrip(this.id).then(trip => {
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

        validate () {
            console.log(this.trip);
            let globalError = false;
            console.log(this.points);
            this.points.forEach(p => {
                if (!p.json) {
                    p.error.state = true;
                    p.error.message = 'Seleccione una localidad válida.';
                    globalError = true;
                    console.log('place error');
                }
            });
            if (!this.time || !moment(this.time, 'HH mm').isValid()) {
                console.log(this.time, moment(this.time, 'HH mm').isValid());
               this.timeError.state = true;
                this.timeError.message = 'No ingresaste un horrio válido.';
                globalError = true;
                console.log(this.time);
            }
            if (this.points[0].name === this.points[this.points.length - 1].name) {
                this.points[0].error.state = true;
                this.points[0].error.message = 'La localidad de origen y destino no deben ser la misma.';
                this.points[this.points.length - 1].error.state = true;
                this.points[this.points.length - 1].error.message = 'La localidad de origen y destino no deben ser la misma.';
                this.sameCity = true;
                globalError = true;
            }

            if (!this.date.length || !moment(this.date, 'DD/MM/YYYY').isValid()) {
                console.log(this.date, moment(this.date, 'DD/MM/YYYY').isValid());
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = 'Aún no ha ingresado ninguna fecha.';
                console.log('date error', this.date);
            }
            if (this.trip.total_seats < this.trip.passengers) {
                globalError = true;
                this.seatsError.state = true;
                this.seatsError.message = 'Ya tienes ' + this.trip.passengers + ' subidos en este viaje. No puedes cambiar el número de asientos por uno menor al de pasajeros ya subidos.';
                dialogs.message('Ya tienes ' + this.trip.passengers + ' subidos en este viaje. No puedes cambiar el número de asientos por uno menor al de pasajeros ya subidos.', {estado: 'error'});
            } else if (globalError) {
                dialogs.message('Algunos datos ingresados no son válidos.', {estado: 'error'});
            } else if (!this.no_lucrar) {
                this.lucrarError.state = true;
                this.lucrarError.message = 'Debes indicar que te comprometes a no lucrar con el viaje.';
                dialogs.message('Debes indicar que te comprometes a no lucrar con el viaje.', {estado: 'error'});
                globalError = true;
                console.log('no lucrar error');
            }

            return globalError;
        },

        save () {
            if (this.validate()) {
                return;
            }
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
            this.trip.trip_date = moment.utc(this.date, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' ' + this.time + ':00';
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
            this.points[i].name = getCityName(data);
            this.points[i].json = parseStreet(data);
            this.points[i].error.state = false;
            this.center = this.points[i].location = {
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng()
            };
            if ((i === 0 || i === this.points.length - 1) && this.sameCity) {
                this.points[0].error.state = false;
                this.points[this.points.length - 1].error.state = false;
            }
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
                origin: this.points[0].location,
                destination: this.points[this.points.length - 1].location,
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
                    this.trip.co2 = totalDistance * 0.15; /* distancia por 0.15 kilos co2 en promedio por KM recorrido  */
                } else {
                    console.log(this.points[0].name, this.points[this.points.length - 1].name, 'DRIVING');
                    console.log('Directions request failed due to ' + status);
                }
            });
        }
    }
};
</script>

<style scoped>
    .container {
        padding-top: 0;
    }
    .trip-type-selection {
        margin-top: 1.4rem;
    }
    span.error {
        display: block;
        font-size: 12px;
        margin-top: -5px;
        font-weight: bold;
        color: red;
        margin-bottom: .4em;
    }
    span.error.textarea {
        margin-top: .8em;
    }
    @media only screen and (min-width: 768px) {
        .container {
            padding-top: 1.5em;
        }
        .trip-type-selection {
            margin-top: 0;
        }
        span.error {
            font-weight: 300;
        }
    }
</style>
