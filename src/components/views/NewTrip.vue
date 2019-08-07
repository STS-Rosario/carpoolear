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
                            <label for="no-lucrar" class="trip_terms_label" :class="{'has-error': lucrarError.state }" >
                                Me comprometo a no lucrar con el viaje.
                                <span class="tooltip-bottom" data-tooltip="Al pedir una contribución por encima de la máxima, es posible que el viaje sea considerado con fin de lucro y por lo tanto un transporte ilegal de pasajeros, pudiendo ser invalidado el seguro particular automotor y la cobertura contra terceros asociada. Tengamos un buen viaje cuidándonos entre todos :-D">
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                </span>
                                <br />
                                <small>La contribución máxima es igual a gastos de combustible + peaje dividido la cantidad de personas viajando en el auto. Durante la coordinación previa al viaje, cualquier persona puede pedir hacer la división con tickets de combustible y peaje en mano.</small>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-16">
                    <div class="row">
                        <div class="panel-trip-data">
                            <div class="col-md-24" v-show="isMobile">
                                <hr />
                            </div>
                            <div class="trip_allow-foreign col-md-24">
                                <span>
                                    <input type="checkbox" v-model="allowForeignPoints" id="cbxAllowForeignPoints" />
                                    <label for="cbxAllowForeignPoints">
                                        Origen o destino fuera de Argentina
                                    </label>
                                    <span class="tooltip-bottom" data-tooltip="Habilita seleccionar origen o destino fuera de Argentina. Recordá averiguar con la aseguradora del auto, si tenés cobertura contra terceros fuera de la Argentina. Si no es así, tenés que sacar la extensión fuera de Argentina para tener cobertura durante el viaje">
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                </span>
                                </span>
                            </div>
                            <div class="new-left trip_points col-sm-13 col-md-15">
                                <div v-for="(m, index) in points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="index">
                                    <span v-if="index == 0" class="sr-only">Origen</span>
                                    <span v-if="index == points.length - 1" class="sr-only">Destino</span>
                                    <OsmAutocomplete :placeholder="getPlaceholder(index)" name="'input-' + index" ref="'input-' + index" :value="m.name" v-on:place_changed="(data) => getPlace(index, data)" :classes="'form-control form-control-with-icon form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'AR'"  :class="{'has-error': m.error.state}"></OsmAutocomplete>
                                    <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icon form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
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
                                    <DatePicker
                                        :value="date"
                                        :minDate="minDate"
                                        :class="{'has-error': dateError.state}"
                                        v-on:date_changed="(date) => this.dateAnswer = date">
                                      </DatePicker>
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
                                <textarea maxlength="1000" v-model="trip.description" id="trp_comment" class="form-control"></textarea>
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
                                        <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
                                        <label for="privacity-friendofriend" class="label-soft">Amigos de Amigos</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                                        <label for="privacity-friend" class="label-soft">Solo amigos</label>
                                    </li>
                                </ul>
                            </fieldset>
                            <div class="row row-showReturnTrip">
                                <hr class="col-md-24" />
                                <div class="checkbox-trip-return col-md-24">
                                    <span>
                                        <input type="checkbox" v-model="showReturnTrip" id="cbxShowReturnTrip" />
                                        <label for="cbxShowReturnTrip">
                                            Cargar viaje de regreso
                                        </label>
                                    </span>
                                </div>
                            </div>
                            <button v-if="!showReturnTrip" class="trip-create btn btn-primary btn-lg btn-shadowed" @click="save" :disabled="saving">
                                <span v-if="!updatingTrip">CREAR</span>
                                <span v-else>Actualizar</span>
                            </button>
                        </div>
                    </div>
                    <div class="row" v-if="!updatingTrip">
                        <hr  v-if="showReturnTrip" class="col-md-24" />
                        <div v-if="showReturnTrip">
                            <div class="new-left trip_points col-sm-13 col-md-15">
                                <div v-for="(m, index) in otherTrip.points" class="trip_point gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="index">
                                    <span v-if="index == 0" class="sr-only">Origen</span>
                                    <span v-if="index == points.length - 1" class="sr-only">Destino</span>
                                    <OsmAutocomplete
                                        :placeholder="getPlaceholder(index)"
                                        name="'input-return-trip' + index"
                                        ref="'input-return-trip' + index"
                                        :value="m.name"
                                        v-on:place_changed="(data) => getPlace(index, data, 'returnTrip')"
                                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                                        :country="allowForeignPoints ? null : 'AR'" :class="{'has-error': m.error.state}"
                                        >
                                    </OsmAutocomplete>
                                    <div @click="m.name = ''" class="date-picker--cross">
                                        <i aria-hidden="true" class="fa fa-times"></i>
                                    </div>
                                    <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                                </div>
                            </div>
                            <div class="col-sm-11 col-md-9">
                                <div class="trip_information">
                                    <ul class="no-bullet">
                                        <li class="list_item">
                                            <div class="label-soft">Distancia a recorrer</div>
                                            <div>{{otherTripDistanceString}}</div>
                                        </li>
                                        <li class="list_item">
                                            <div class="label-soft">Tiempo estimado de viaje</div>
                                            <div>{{otherTripEstimatedTimeString}} </div>
                                        </li>
                                        <li class="list_item">
                                            <div class="label-soft">Huella de carbono (<abbr title="Kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr>)</div>
                                            <div>{{otherTripCO2String}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="showReturnTrip">
                        <div class="new-left col-sm-13 col-md-15">
                            <div class="trip_datetime">
                                <div class="trip_date">
                                    <label class="sr-only">Día </label>
                                    <DatePicker
                                        :value="otherTrip.date"
                                        :minDate="otherTrip.minDate"
                                        :class="{'has-error': otherTrip.dateError.state}"
                                        v-on:date_changed="(date) => this.otherTrip.dateAnswer = date">
                                    </DatePicker>
                                    <span class="error" v-if="otherTrip.dateError.state"> {{otherTrip.dateError.message}} </span>
                                </div>
                                <div class="trip_time">
                                    <label for="otherTrip-time" class="sr-only">Hora</label>
                                    <input type="time" v-mask="'##:##'" v-model="otherTrip.time" class="form-control form-control-with-icon form-control-time" id="otherTrip-time" :class="{'has-error': otherTrip.timeError.state}" placeholder="Hora (12:00)">
                                    <span class="error" v-if="otherTrip.timeError.state"> {{otherTrip.timeError.message}} </span>
                                    <!--<input type="text" v-model="time" />-->
                                </div>
                            </div>
                            <div class="trip_seats-available">
                                <fieldset>
                                    <legend class="label-for-group">Lugares disponibles</legend>
                                    <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-one" value="1" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-one">1</label>
                                        </span>
                                    <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-two" value="2" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-two">2</label>
                                        </span>
                                    <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-three" value="3" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-three">3</label>
                                        </span>
                                    <span class="radio-inline">
                                            <input type="radio" id="otherTrip-seats-four" value="4" v-model="otherTrip.trip.total_seats">
                                            <label for="otherTrip-seats-four">4</label>
                                        </span>
                                </fieldset>
                                <span class="error" v-if="otherTrip.seatsError.state"> {{otherTrip.seatsError.message}} </span>
                            </div>
                            <div class="trip-comment">
                                <label for="otherTrip-trip_comment" class="label-for-group"> Comentario para los pasajeros </label>
                                <textarea maxlength="1000" v-model="otherTrip.trip.description" id="otherTrip-trp_comment" class="form-control"></textarea>
                                <span class="error" v-if="otherTrip.commentError.state"> {{otherTrip.commentError.message}} </span>
                            </div>
                        </div>
                        <div class="col-sm-11 col-md-9">
                            <fieldset class="trip-privacity">
                                <legend class="label-for-group"> Privacidad del viaje de vuelta </legend>
                                <ul class="no-bullet">
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-public" value="2" v-model="otherTrip.trip.friendship_type_id" >
                                        <label for="otherTrip-privacity-public" class="label-soft">Público</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-friendofriend" value="1" v-model="otherTrip.trip.friendship_type_id" >
                                        <label for="otherTrip-privacity-friendofriend" class="label-soft">Amigos de Amigos</label>
                                    </li>
                                    <li>
                                        <input type="radio" id="otherTrip-privacity-friend" value="0" v-model="otherTrip.trip.friendship_type_id" >
                                        <label for="otherTrip-privacity-friend" class="label-soft">Solo amigos</label>
                                    </li>
                                </ul>
                            </fieldset>
                            <button class="trip-create btn btn-primary btn-lg btn-shadowed" @click="save" :disabled="saving">
                                <span v-if="!updatingTrip">CREAR</span>
                                <span v-else>Actualizar</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-24 map">
                    <!-- <div class="map_warning">* El recorrido del mapa es de referencia, puede no coincidir con el recorrido planeado por ud.</div> -->
                    <!-- <gmap-map
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
                    </gmap-map> -->

                    <!-- <l-map :zoom="zoom" :center="center" style="width: 100%; height: 300px; overflow: hidden;" ref="map">
                        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    </l-map> -->
                </div>
            </div>
        </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { parseOsmStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import { last } from 'lodash';
import OsmApi from '../../services/api/Osm';
import OsmAutocomplete from '../OsmAutocomplete';
// import { LMap, LTileLayer } from 'vue2-leaflet';

// import 'leaflet-routing-machine';

let osmApi = new OsmApi();

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
        DatePicker,
        OsmAutocomplete /* ,
        LMap,
        LTileLayer */
    },
    data () {
        return {
            minDate: moment().toDate(),
            lucrarError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            commentError: new Error(),
            seatsError: new Error(),
            no_lucrar: false,
            sameCity: false,
            zoom: 4,
            center: [-29.0, -60.0],
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
            date: '',
            dateAnswer: this.date,
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
            updatingTrip: null,
            saving: false,
            allowForeignPoints: false,
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showReturnTrip: false,
            otherTrip: {
                minDate: moment().toDate(),
                dateError: new Error(),
                timeError: new Error(),
                commentError: new Error(),
                seatsError: new Error(),
                no_lucrar: false,
                sameCity: false,
                zoom: 4,
                center: [-29.0, -60.0],
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
                date: '',
                dateAnswer: this.date,
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
                }
            }
        };
    },
    mounted () {
        let self = this;
        this.time = moment().add(1, 'hours').format('HH:00');
        this.otherTrip.time = moment().add(2, 'hours').format('HH:00');
        /* this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            / * eslint-disable no-undef * /
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
            if (self.id) {
                self.loadTrip();
            }
        }); */
        if (self.id) {
            self.loadTrip();
        }
    },

    beforeDestroy () {
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars',
            isMobile: 'device/isMobile'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },
        estimatedTimeString () {
            const totalMinutes = Math.floor(this.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return Math.floor(this.trip.distance / 1000) * 1.5 + ' Kg';
        },
        otherTripDistanceString () {
            return Math.floor(this.otherTrip.trip.distance / 1000) + ' Km';
        },
        otherTripEstimatedTimeString () {
            const totalMinutes = Math.floor(this.otherTrip.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        otherTripCO2String () {
            return Math.floor(this.otherTrip.trip.distance / 1000) * 1.5 + ' Kg';
        }
    },
    watch: {
        'no_lucrar': function () {
            this.lucrarError.state = false;
        },
        'dateAnswer': function (value) {
            if (!this.showReturnTrip || !this.otherTrip.dateAnswer) {
                // const v = moment(value);
                // let date = '';
                /* if (v.isValid()) {
                    date = value;
                } */
                // this.otherTrip.date = date;
                // this.otherTrip.dateAnswer = date;
            }
            // this.dateError.state = false;
        },
        'time': function () {
            this.timeError.state = false;
        },
        'otherTrip.dateAnswer': function () {
            this.otherTrip.dateError.state = false;
        },
        'otherTrip.time': function () {
            this.otherTrip.timeError.state = false;
        },
        'trip.friendship_type_id': function () {
            console.log('change');
            this.otherTrip.trip.friendship_type_id = this.trip.friendship_type_id;
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update',
            'getTrip': 'getTrip'
        }),
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
            this.date = moment(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.passengers = trip.passenger_count;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            // this.calcRoute();
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
            let globalError = false;
            let foreignPoints = 0;
            let validTime = false;
            let validDate = false;
            let validOtherTripTime = false;
            let validOtherTripDate = false;

            this.points.concat(this.showReturnTrip ? this.otherTrip.points : []).forEach(p => {
                if (!p.json) {
                    p.error.state = true;
                    p.error.message = 'Seleccione una localidad válida.';
                    globalError = true;
                } else {
                    foreignPoints += (p.json.pais === 'Argentina' ? 0 : 1);
                }
            });

            if (foreignPoints > 1) {
                globalError = true;
                this.points[0].error.state = true;
                this.points[0].error.message = 'El origen o el destino de tu viaje tiene que estar en Argentina.';
            }

            if (!this.time || !moment(this.time, 'HH mm').isValid()) {
                this.timeError.state = true;
                this.timeError.message = 'No ingresaste un horario válido.';
                globalError = true;
            } else {
                validTime = true;
            }

            if (this.points[0].json && last(this.points).json && this.points[0].name === last(this.points).name) {
                this.points[0].error.state = true;
                this.points[0].error.message = 'La localidad de origen y destino no deben ser la misma.';
                last(this.points).error.state = true;
                last(this.points).error.message = 'La localidad de origen y destino no deben ser la misma.';
                this.sameCity = true;
                globalError = true;
            }

            if (!(this.dateAnswer && this.dateAnswer.length) || !moment(this.dateAnswer).isValid()) {
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = 'Aún no ha ingresado ninguna fecha.';
            } else {
                validDate = true;
            }
            if (this.trip.total_seats < this.passengers) {
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
            }
            if (validDate && validTime) {
                console.log('valid date time');
                if (moment(this.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    console.log('es hoy', moment(this.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                    // la fecha es de hoy, la hora no debería poder ser anterior
                    if (moment(this.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                        console.log('es antes de ahora');
                        this.timeError.state = true;
                        this.timeError.message = 'En Carpoolear no se permiten viajes hacia el pasado :), revisá la fecha y hora de tu viaje.';
                        globalError = true;
                    }
                }
            }

            if (this.showReturnTrip) {
                if (!this.otherTrip.time || !moment(this.otherTrip.time, 'HH mm').isValid()) {
                    this.otherTrip.timeError.state = true;
                    this.otherTrip.timeError.message = 'No ingresaste un horario válido.';
                    globalError = true;
                } else {
                    validOtherTripTime = true;
                }

                if (this.otherTrip.points[0].json && last(this.otherTrip.points).json && this.otherTrip.points[0].name === last(this.otherTrip.points).name) {
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = 'La localidad de origen y destino no deben ser la misma.';
                    last(this.otherTrip.points).error.state = true;
                    last(this.otherTrip.points).error.message = 'La localidad de origen y destino no deben ser la misma.';
                    this.otherTrip.sameCity = true;
                    globalError = true;
                }

                if (!(this.otherTrip.dateAnswer && this.otherTrip.dateAnswer.length) || !moment(this.otherTrip.dateAnswer).isValid()) {
                    globalError = true;
                    this.otherTrip.dateError.state = true;
                    this.otherTrip.dateError.message = 'Aún no ha ingresado ninguna fecha.';
                } else {
                    validOtherTripDate = true;
                }
                if (globalError) {
                    dialogs.message('Algunos datos ingresados no son válidos.', {estado: 'error'});
                }

                if (validOtherTripTime && validOtherTripDate) {
                    console.log('valid date time');
                    if (moment(this.otherTrip.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                        console.log('es hoy', moment(this.otherTrip.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                        // la fecha es de hoy, la hora no debería poder ser anterior
                        if (moment(this.otherTrip.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                            console.log('es antes de ahora');
                            this.otherTrip.timeError.state = true;
                            this.otherTrip.timeError.message = 'En Carpoolear no se permiten viajes hacia el pasado :), revisá la fecha y hora de tu viaje.';
                            globalError = true;
                        }
                    }

                    const tripDate = moment(this.dateAnswer);
                    const otherTripDate = moment(this.otherTrip.dateAnswer);
                    let time = moment(this.time, 'HH:mm');

                    tripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    time = moment(this.otherTrip.time, 'HH:mm');

                    otherTripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    if (otherTripDate.isBefore(tripDate) || otherTripDate.isSame(tripDate)) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message = 'La fecha y hora de tu viaje de regreso deben que ser mayores a la fecha y hora de tu viaje de ida.';
                        globalError = true;
                    }
                }
            }

            return globalError;
        },

        getSaveInfo (tripObj, estimatedTime) {
            const points = tripObj.points.map(p => {
                return {
                    address: p.name,
                    json_address: p.json,
                    lat: p.location.lat,
                    lng: p.location.lng
                };
            });

            const tripInfo = {
                points,
                from_town: points[0].address,
                to_town: last(points).address,
                trip_date: tripObj.dateAnswer + ' ' + tripObj.time + ':00',
                estimated_time: estimatedTime,
                car_id: this.cars.length > 0 ? this.cars[0].id : undefined
            };

            return Object.assign({}, tripObj.trip, tripInfo);
        },

        save () {
            if (this.validate()) {
                return;
            }
            /* eslint-disable no-unreachable */
            this.saving = true;

            this.trip = this.getSaveInfo(this, this.estimatedTimeString);

            if (!this.updatingTrip) {
                this.createTrip(this.trip).then((t) => {
                    return new Promise((resolve, reject) => {
                        if (!this.showReturnTrip) {
                            return resolve();
                        } else {
                            const otherTrip = this.getSaveInfo(this.otherTrip, this.otherTripEstimatedTimeString);

                            otherTrip.parent_trip_id = t.id;

                            this.createTrip(otherTrip).then((ot) => {
                                return resolve(ot);
                            });
                        }
                    }).then((ot) => {
                        this.saving = false;
                        this.$router.replace({ name: 'detail_trip', params: { id: t.id } });
                    });
                }).catch(() => { this.saving = false; });
            } else {
                console.log(this.trip);
                this.trip.id = this.updatingTrip.id;
                this.updateTrip(this.trip).then(() => {
                    this.saving = false;
                    this.$router.replace({ name: 'detail_trip', params: { id: this.trip.id } });
                }).catch(() => { this.saving = false; });
            }
        },

        getPlace (i, data, type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            trip.points[i].place = data;
            trip.points[i].name = data.display_name;
            // TODO: Recordar parseStreet
            trip.points[i].json = parseOsmStreet(data);
            trip.points[i].error.state = false;
            trip.center = trip.points[i].location = {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon)
            };

            if ((i === 0 || i === trip.points.length - 1) && trip.sameCity) {
                trip.points[0].error.state = false;
                last(trip.points).error.state = false;
            }

            if (type === 'trip') {
                let point = this.otherTrip.points[0];

                if (i === 0) {
                    point = last(this.otherTrip.points);
                }

                point.place = data;
                point.name = data.display_name;
                point.json = parseOsmStreet(data);
                point.error.state = false;
                this.otherTrip.center = point.location = {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lon)
                };

                this.calcRoute('returnTrip');
            }

            this.calcRoute(type);
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

        calcRoute (type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            console.log('calc route', trip.points);

            for (let i = 0; i < trip.points.length; i++) {
                if (!trip.points[i].name) {
                    return;
                }
            }
            let data = {
                origin: trip.points[0].location,
                destiny: last(trip.points).location
            };
            osmApi.route(data).then((result) => {
                console.log('osm route result', result);
                if (result.code === 'Ok' && result.routes && result.routes.length) {
                    let route = result.routes[0];
                    trip.trip.distance = route.distance;
                    trip.duration = route.duration;
                    trip.trip.co2 = route.distance * 0.15; /* distancia por 0.15 kilos co2 en promedio por KM recorrido  */
                }
            });

            if (this.$refs.map && this.$refs.map.mapObject) {
                let map = this.$refs.map.mapObject;

                /* eslint-disable no-undef */
                L.Routing.control({
                    waypoints: [
                        L.latLng(data.origin.lat, data.origin.lng),
                        L.latLng(data.destiny.lat, data.destiny.lng)
                    ]
                }).addTo(map);
            }

            /* this.directionsService.route({
                origin: this.points[0].location,
                destination: this.points[this.points.length - 1].location,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
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
                    this.trip.co2 = totalDistance * 0.15;
                } else {
                    console.log(this.points[0].name, this.points[this.points.length - 1].name, 'DRIVING');
                    console.log('Directions request failed due to ' + status);
                }
            }); */
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
    .tooltip-bottom {
        color: var(--trip-almost-fill-color);
    }
    .row-showReturnTrip {
        margin-bottom: 1.5rem;
    }
</style>
