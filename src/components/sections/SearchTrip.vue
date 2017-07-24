<template>
    <div class="row search-section">  
        <div class="col-xs-12 col-md-3"> 
            <button class="btn btn-option" :class="{'active': !isPassenger}" @click="isPassenger = false" >
                <img alt="" :src="isPassenger ? chofer_logo_gris : chofer_logo_blanco" />
                <span>Busco conductor</span>
            </button> 
        </div>
        <div class="col-xs-12 col-md-3">
            <button class="btn btn-option" :class="{'active': isPassenger}" @click="isPassenger = true" >
                <img alt="" :src="isPassenger ? pasajero_logo_blanco : pasajero_logo_gris" />
                <span>Busco pasajero</span>
            </button>
        </div>
        <div class="col-xs-24 col-md-5 gmap-autocomplete origin"> 
            <GmapAutocomplete name="from_town" ref="from_town" :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="{country: 'AR'}" placeholder="Origen"  :value="from_town.name" v-on:place_changed="(data) => getPlace(0, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>
            <div class="date-picker--cross">
                <i v-on:click="resetInput('from_town')" class="fa fa-times" aria-hidden="true"></i>
            </div>
        </div>
        <div class="swap btn">
            <img alt="swap" class='swap-horizontal' :src="swap_horizontal" @click="swapCities" />
            <img alt="swap" class='swap-vertical' :src="swap_vertical" @click="swapCities" />
        </div>
        <div class="col-xs-24 col-md-5 gmap-autocomplete destiny"> 
            <GmapAutocomplete name="to_town" ref="to_town" :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="{country: 'AR'}" placeholder="Destino"  :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>
            <div class="date-picker--cross">
                <i v-on:click="resetInput('to_town')" class="fa fa-times" aria-hidden="true"></i>
            </div>
        </div> 
        <div class="col-xs-24 col-md-4">
              <Calendar :class="'calendar-date form-control form-control-with-icon form-control-date'" :value="date" @change="(date) => this.date = date" :limitFilter="datePickerLimitFilter"></Calendar>
        </div>
        <div class="col-xs-24 col-md-3">
            <button class="btn btn-primary btn-search" @click="emit">Buscar</button> 
        </div>
        
    </div>  
</template>

<script>
import {pointDistance} from '../../services/maps.js';
import Calendar from '../Calendar';
import {today} from '../../services/utility.js';

export default {
    name: 'search-trip',
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
            date: '',
            datePickerLimitFilter: {
                type: 'fromto',
                from: today()
            },
            chofer_logo_blanco: process.env.ROUTE_BASE + 'static/img/icono-conductor-blanco.png',
            pasajero_logo_blanco: process.env.ROUTE_BASE + 'static/img/icono-pasajero-blanco.png',
            chofer_logo_gris: process.env.ROUTE_BASE + 'static/img/icono-conductor-gris.png',
            pasajero_logo_gris: process.env.ROUTE_BASE + 'static/img/icono-pasajero-gris.png',
            swap_horizontal: process.env.ROUTE_BASE + 'static/img/flechas_horizontales.png',
            swap_vertical: process.env.ROUTE_BASE + 'static/img/flechas_verticales.png'
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
        this.$refs['from_town'].$el.addEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.addEventListener('input', this.checkInput);
    },
    beforeDestroy () {
        this.$refs['from_town'].$el.removeEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.removeEventListener('input', this.checkInput);
    },
    methods: {
        checkInput (event) {
            let value = event.target.value;
            let name = event.target.name;
            if (value === '') {
                this[name] = '';
            }
        },
        getPlace (i, data) {
            let obj = {};
            if (data && data.geometry) {
                var viewport = JSON.parse((JSON.stringify(data.geometry.viewport)));
                let distance = pointDistance(viewport.north, viewport.east, viewport.south, viewport.west);
                obj = {
                    name: data.formatted_address,
                    location: {
                        lat: data.geometry.location.lat(),
                        lng: data.geometry.location.lng()
                    },
                    radio: distance
                };
            }
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
        },
        resetInput (input) {
            this[input] = {
                name: '',
                location: null,
                radio: 0
            };
        },
        swapCities () {
            let temp;
            temp = this['to_town'];
            this['to_town'] = this['from_town'];
            this['from_town'] = temp;
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

<style scoped>
    .search-section {
        width: 100%;
    }
    .search-section .btn-option {
        width: 100%;
        margin-bottom: 1em;
    }
    .btn-option {
        height: 72px;
    }
    .btn-option img {
        width: 20px;
        display: inline-block;
        top: 10px;
        margin-right: 0;
    }
    .btn-option span {
        vertical-align: middle;
        display: inline-block;
        width: calc(100% - 30px);
    }
    .swap {
        display: none;
    }
    .swap-horizontal {
        display: none;
    }
    @media only screen and (min-width: 300px) {
        .swap {
            left: -30px;
            top: 122px;
            border-radius: 0;
            position: absolute;
            z-index: 1;
            text-align: center;
            cursor: pointer;
            background-color: #eee;
            box-sizing: border-box;
            padding: 2px 6px 3px;
            border: 1px solid #aaa;
            display: inline-block;
            margin: 0em;
        }
        .search-section {
            margin-left: 30px;
            width: calc(100% - 30px);
        }
    }
    @media only screen and (min-width: 414px) {
        .btn-option {
            height: initial;
        }
        .swap {
            top: 108px;
        }
        .btn-option img {
            width: initial;
            display: initial;
            top: initial;
            margin-right: 6px;
        }
        .btn-option span {
            display: initial;
            width: initial;
        }
    }
    @media only screen and (min-width: 768px) {
        .swap {
            left: initial;
            top: initial;
            transform: translate(-724px,106px);
            -webkit-transform: translate(-724px,106px);
            -o-transform: translate(-724px,106px);
            -moz-transform: translate(-724px,106px);
        }
    }
    @media only screen and (min-width: 856px) {
        .swap {
            transform: translate(-754px,106px);
            -webkit-transform: translate(-754px,106px);
            -o-transform: translate(-754px,106px);
            -moz-transform: translate(-754px,106px);
        }
        .search-section {
             width: 100%;
             margin-left: 0;
        }
    }
    @media only screen and (min-width: 992px) {
        .swap {
            transform: translate(-16px,20);
            -webkit-transform: translate(-16px,20px);
            -o-transform: translate(-16px,20px);
            -moz-transform: translate(-16px,20px);
        }
        .btn-option {
            height: 66px;
            padding: 1em .4em;
        }
        .btn-option span {
            vertical-align: middle;
            display: inline-block;
            width: calc(100% - 30px);
        }
        .btn-option img {
            width: 20px;
            display: inline-block;
            top: 10px;
            margin-right: 0;
        }
    }
    @media only screen and (min-width: 992px) {
        .swap-horizontal {
            display: block;
        }
        .swap-vertical {
            display: none;
        }
    }
</style>