<template>
    <div class="row search-section">  
        <div class="col-xs-12 col-md-3"> 
            <button class="btn btn-option" :class="{'active': !isPassenger}" @click="isPassenger = false" >
                <i class="fa fa-car" aria-hidden="true"></i>
                <span>Busco conductor</span>
            </button> 
        </div>
        <div class="col-xs-12 col-md-3">
            <button class="btn btn-option" :class="{'active': isPassenger}" @click="isPassenger = true" >
                <i class="fa fa-male" aria-hidden="true"></i>
                <span>Busco pasajero</span>
            </button>
        </div>  
        <div class="col-xs-24 col-md-5"> 
            <GmapAutocomplete  :types="['(cities)']" :componentRestrictions="{country: 'AR'}" placeholder="Origen"  :value="from_town.name" v-on:place_changed="(data) => getPlace(0, data)" class="form-control form-control-with-icon form-control-map-autocomplete origin"> </GmapAutocomplete>
        </div>
        <div class="col-xs-24 col-md-5"> 
            <GmapAutocomplete  :types="['(cities)']" :componentRestrictions="{country: 'AR'}" placeholder="Destino"  :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" class="form-control form-control-with-icon form-control-map-autocomplete destiny"> </GmapAutocomplete>
        </div> 
        <div class="col-xs-24 col-md-4">
              <Calendar :class="'calendar-date form-control form-control-with-icon form-control-date'" :value="date" @change="(date) => this.date = date"></Calendar>
        </div>
        <div class="col-xs-24 col-md-3">
            <button class="btn btn-primary" @click="emit">Buscar</button> 
        </div>
        
    </div>  
</template>

<script>
import {pointDistance} from '../../services/maps.js';
import Calendar from '../Calendar';

export default {
    name: 'loading',
    data () {
        return {
            isPassenger: false,
            from_town: {
                name: '',
                location: null,
                radio: 0
            },
            to_town: {
                name: '',
                location: null,
                radio: 0
            },
            date: ''
        };
    },
    mounted () {
        if (this.params) {
            if (this.params.origin_name) {
                this.from_town.name = this.params.origin_name;
                this.from_town.location = {
                    lat: this.params.origin_lat,
                    lng: this.params.origin_lng
                };
                this.from_town.radio = this.params.origin_radio;
            }

            if (this.params.destination_name) {
                this.to_town.name = this.params.destination_name;
                this.to_town.location = {
                    lat: this.params.destination_lat,
                    lng: this.params.destination_lng
                };
                this.to_town.radio = this.params.destination_radio;
            }
            if (this.params.is_passenger) {
                this.isPassenger = this.params.is_passenger;
            }
            if (this.params.date) {
                this.date = this.params.date;
            }
        }
    },
    computed: {

    },
    methods: {
        getPlace (i, data) {
            var viewport = JSON.parse((JSON.stringify(data.geometry.viewport)));
            let distance = pointDistance(viewport.north, viewport.east, viewport.south, viewport.west);
            let obj = {
                name: data.formatted_address,
                location: {
                    lat: data.geometry.location.lat(),
                    lng: data.geometry.location.lng()
                },
                radio: distance
            };
            if (i === 0) {
                this.from_town = obj;
            } else {
                this.to_town = obj;
            }
        },
        emit () {
            let params = {};
            if (this.from_town.location) {
                params.origin_lat = this.from_town.location.lat;
                params.origin_lng = this.from_town.location.lng;
                params.origin_radio = this.from_town.radio;
                params.origin_name = this.from_town.name;
            }
            if (this.to_town.location) {
                params.destination_lat = this.to_town.location.lat;
                params.destination_lng = this.to_town.location.lng;
                params.destination_radio = this.to_town.radio;
                params.destination_name = this.to_town.name;
            }
            if (this.date) {
                params.date = this.date;
            }
            params.is_passenger = this.isPassenger;
            this.$emit('trip-search', params);
        }
    },
    props: [
        'params'
    ],
    components: {
        Calendar
    }
};
</script>
