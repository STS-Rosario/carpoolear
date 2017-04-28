<template>
    <div class="new-trip-component">
        <div class="row">
            <div class="col-xs-8">
                <div class="trip-type">
                    <input type="radio" id="type-driver" value="0" v-model="trip.is_passenger">
                    <label for="type-driver">Como conductor</label>
                    <br>
                    <input type="radio" id="type-passenger" value="1" v-model="trip.is_passenger">
                    <label for="type-passenger">Como pasajero</label>
                </div>
            </div>
            <div class="col-xs-8">
                <div class="trip-points">
                    <div v-for="(m, index) in points">
                        <span v-if="index == 0"> Origen: </span>
                        <span v-if="index == points.length - 1"> Destino: </span>
                        <GmapAutocomplete  :types="['(cities)']" :componentRestrictions="{country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" v-on:place_changed="(data) => getPlace(index, data)"> </GmapAutocomplete>
                    </div>
                </div>
            </div>
            <div class="col-xs-8">
                <div class="trip-information">
                        <ul>
                            <li>
                                Distancia: {{distanceString}}    
                            </li>
                            <li>
                                Tiempo estimado: {{estimatedTimeString}}    
                            </li>
                            <li>
                                CO2: {{CO2String}}
                            </li>
                        </ul>
                </div>
            </div>
        </div> 
        <div class="row">
            <div class="col-xs-8">
                Me comprometo a no lucrar con el viaje
            </div>
            <div class="col-xs-8"> 
                <div class="trip-datetime">
                    <div class="trip-date">
                        <label >Día </label>
                        <input type="text" v-model="date">
                    </div>
                    <div class="trip-time">
                        <label >Hora</label>
                        <input type="text" v-model="time">
                    </div>
                </div>
                <div class="trip-seats-available">
                    <span> Lugares disponibles </span>
                    <ul>
                        <li>
                            <input type="radio" id="seats-one" value="1" v-model="trip.total_seats">
                            <label for="seats-one">1</label>    
                        </li>
                        <li>
                            <input type="radio" id="seats-two" value="2" v-model="trip.total_seats">
                            <label for="seats-two">2</label>    
                        </li>
                        <li>
                            <input type="radio" id="seats-three" value="3" v-model="trip.total_seats">
                            <label for="seats-three">3</label>    
                        </li>
                        <li>
                            <input type="radio" id="seats-four" value="4" v-model="trip.total_seats">
                            <label for="seats-four">4</label>    
                        </li>
                    </ul>
                </div>
                <div class="trip-comment">
                    <span> Comentario de pasajero </span>
                    <textarea v-model="trip.description"></textarea>
                </div>
            </div>
            <div class="col-xs-8">
                <div class="trip-privacity">
                    <span> Privacidad del viaje </span>
                    <ul>
                        <li>    
                            <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
                            <label for="privacity-public">Publicos</label>    
                        </li>
                        <li>
                            <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                            <label for="privacity-friend">Amigos</label>    
                        </li>
                        <li>    
                            <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
                            <label for="privacity-friendofriend">Amigos de Amigos</label>     
                        </li>
                    </ul>
                </div>

                <button class="trip-create" @click="save">CREAR</button>

            </div>
        </div> 
        <div class="row">
            <div class="col-xs-24"> 
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

export default {
    name: 'new-trip',
    props: {
        'id': {
            type: Number,
            required: false
        }
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
            duraction: '',
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
                'enc_path': '',
                'points': [] /* address json_address lat lng */
            },
            updatingTrip: null
        };
    },
    mounted () {
        this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            /* eslint-disable no-undef */
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
        });
        if (this.id) {
            this.loadTrip();
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' kms';
        },
        estimatedTimeString () {
            let totalMinutes = Math.floor(this.duraction / 60);
            let minutes = Math.floor(totalMinutes % 60);
            let hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return 'no me acuerdo la formula';
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'getTrip': 'getTrip'
        }),

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                console.log(trip);
                if (this.user.id === trip.user.id) {
                    this.updatingTrip = trip;
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
            console.log(this.trip);
            this.createTrip(this.trip);
        },

        parserAddress (data) {
            let place = data;
            let addressComponents = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'long_name',
                postal_code: 'short_name'
            };
            let returnData = {};
            if (place.address_components !== undefined) {
                // Get each component of the address from the place details
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (addressComponents[addressType]) {
                        let val = place.address_components[i][addressComponents[addressType]];
                        returnData[addressType] = val;
                    }
                }
                return returnData;
            }
        },

        parseGeocode (result) {
            var address = {};
            for (var i in result.address_components) {
                var obj = result.address_components[i];
                var nombre = obj.long_name;
                switch (obj.types[0]) {
                case 'country':
                    address.pais = nombre;
                    break;
                case 'administrative_area_level_1':
                    address.provincia = nombre;
                    break;
                case 'locality':
                    address.ciudad = nombre;
                    break;
                case 'route':
                    address.calle = nombre;
                    break;
                case 'street_number':
                    address.numero = nombre;
                    break;
                };
            }
            return address;
        },

        getPlace (i, data) {
            this.points[i].place = data;
            this.points[i].name = data.formatted_address;
            this.points[i].json = this.parseGeocode(data);
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
                if (!this.points[i].place) {
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
                    this.duraction = totalDuration;
                    this.co2 = 0.0; /* agregar formula */
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });
        }
    }
};
</script>