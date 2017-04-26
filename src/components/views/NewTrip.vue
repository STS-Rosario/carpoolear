<template>
  <div>
    <div>
        <input type="radio" id="type-driver" value="0" v-model="trip.is_passenger">
        <label for="type-driver">Como conductor</label>
        <br>
        <input type="radio" id="type-passenger" value="1" v-model="trip.is_passenger">
        <label for="type-passenger">Como pasajero</label>
    </div>

    <div v-for="(m, index) in points">
        <span v-if="index == 0"> Origen: </span>
        <span v-if="index == points.length - 1"> Destino: </span>
        <GmapAutocomplete  :types="['(cities)']" :componentRestrictions="{country: 'AR'}" :placeholder="getPlaceholder(index)"  :value="m.name" v-on:place_changed="(data) => getPlace(index, data)"> </GmapAutocomplete>
   </div>

   <div>
        Distancia: {{distanceString}} <br>
        Tiempo estimado: {{estimatedTimeString}} <br>   
        CO2: {{CO2String}}
   </div>

   <br>
    <label >Día</label>
    <input type="text" v-model="date">
    <br>
    <label >Hora</label>
    <input type="text" v-model="time">  

    <div>
        Lugares disponibles
        <input type="radio" id="seats-one" value="1" v-model="trip.total_seats">
        <label for="seats-one">1</label>
        <br>
        <input type="radio" id="seats-two" value="2" v-model="trip.total_seats">
        <label for="seats-two">2</label>
        <br>
        <input type="radio" id="seats-three" value="3" v-model="trip.total_seats">
        <label for="seats-three">3</label>
        <br>
        <input type="radio" id="seats-four" value="4" v-model="trip.total_seats">
        <label for="seats-four">4</label>
    </div>

    <div>
        Privacidad del viaje
        <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
        <label for="privacity-public">Publicos</label>
        <br>
        <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
        <label for="privacity-friend">Amigos</label>
        <br>
        <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
        <label for="privacity-friendofriend">Amigos de Amigos</label> 
    </div>

    <div>
        Comentario de pasajero
        <textarea v-model="trip.description"></textarea>
    </div>

    <button @click="save">CREAR</button>

    <gmap-map
        :center="center"
        :zoom="7"
        style="width: 500px; height: 300px"
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
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'new-trip',
    data () {
        return {
            center: {lat: -10.0, lng: 10.0},
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
            }
        };
    },
    mounted () {
        window.testing = this;
        this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            /* eslint-disable no-undef */
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
        });
    },
    computed: {
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
            'createTrip': 'trips/create'
        }),
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