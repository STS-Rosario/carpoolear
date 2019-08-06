<template>
    <div class="row search-section">
        <div class="col-xs-12 col-md-3">
            <button class="btn btn-option" :class="{'active': !isPassenger}" @click="isPassenger = false" >
                <!--<img alt="" :src="isPassenger ? chofer_logo_gris : chofer_logo_blanco" />-->
                <span class="fa fa-car" aria-hidden="true"></span>
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
            <div class="swap btn">
                <img alt="swap" class='swap-horizontal' :src="swap_horizontal" @click="swapCities" />
                <img alt="swap" class='swap-vertical' :src="swap_vertical" @click="swapCities" />
            </div>
        </div>
        <div class="col-xs-24 col-md-5 gmap-autocomplete destiny">
            <GmapAutocomplete name="to_town" ref="to_town" :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="{country: 'AR'}" placeholder="Destino"  :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>
            <div class="date-picker--cross">
                <i v-on:click="resetInput('to_town')" class="fa fa-times" aria-hidden="true"></i>
            </div>
        </div>
        <div class="col-xs-24 col-md-4 no-padding">
            <DatePicker ref="datepicker" :value="date" :minDate="minDate" :class="{'has-error': dateError.state}"></DatePicker>
        </div>
        <div class="col-xs-24 col-md-3 col-lg-4">
            <button class="btn btn-primary btn-search" @click="emit">Buscar</button>
        </div>

    </div>
</template>

<script>
import { pointDistance } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import bus from '../../services/bus-event.js';
import moment from 'moment';

export default {
    name: 'search-trip',
    data () {
        return {
            minDate: moment().toDate(),
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
            dateAnswer: '',
            dateError: {
                message: '',
                state: ''
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
        bus.on('date-change', this.dateChange);
        this.loadParams(this.params);
        this.$refs['from_town'].$el.addEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.addEventListener('input', this.checkInput);
    },
    updated () {
    },
    beforeDestroy () {
        this.$refs['from_town'].$el.removeEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.removeEventListener('input', this.checkInput);
        bus.off('date-change', this.dateChange);
    },
    methods: {
        dateChange (value) {
            this.dateAnswer = value;
        },
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
            if (this.dateAnswer) {
                params.date = this.dateAnswer;
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
        },
        clear () {
            this.resetInput('from_town');
            this.resetInput('to_town');
            this.$refs.datepicker.clear();
        },
        loadParams (parameters) {
            if (parameters) {
                if (parameters.origin_name) {
                    this.from_town.name = parameters.origin_name;
                    this.from_town.location = {
                        lat: parameters.origin_lat,
                        lng: parameters.origin_lng
                    };
                    this.from_town.radio = parameters.origin_radio;
                } else {
                    this.resetInput('from_town');
                }

                if (parameters.destination_name) {
                    this.to_town.name = parameters.destination_name;
                    this.to_town.location = {
                        lat: parameters.destination_lat,
                        lng: parameters.destination_lng
                    };
                    this.to_town.radio = parameters.destination_radio;
                } else {
                    this.resetInput('to_town');
                }
                if (parameters.is_passenger) {
                    this.isPassenger = parameters.is_passenger;
                } else {
                    this.isPassenger = false;
                }
                if (parameters.date) {
                    this.date = parameters.date;
                } else {
                    this.date = '';
                }
            }
        }
    },
    props: [
        'params'
    ],
    components: {
        DatePicker
    }
};
</script>

<style scoped>
    .search-section {
        padding-left: 0;
        padding-right: 0;
    }
    .search-section .btn-option {
        width: 100%;
        margin-bottom: 1em;
    }
    .btn-option {
        height: 72px;
    }
    .btn-option .fa,
    .btn-option img {
        width: 20px;
        display: inline-block;
        top: 10px;
        margin-right: 0;
        font-size: 20px;
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
            bottom: -6px;
            left: -30px;
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
            padding-right: 15px;
        }
    }
    @media only screen and (min-width: 429px) {
        .btn-option {
            height: initial;
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
        .search-section {
            padding-left: 0;
            padding-right: 0;
            width: calc(100% - 30px);
        }
    }
    @media only screen and (min-width: 856px) {
        .search-section {
             width: 100%;
             margin-left: 0;
             padding-left: 0;
        }
    }
    @media only screen and (min-width: 992px) {
        .swap {
            bottom: unset;
            top: 20px;
            right: -17px;
            left: unset;
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
