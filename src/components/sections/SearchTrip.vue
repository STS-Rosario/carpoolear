<template>
    <div>
        <div
            class="row text-center foreignCountry-select foreignCountry-select-desktop"
            v-show="!isMobile"
        >
            <div class="foreignCountry-select_wrapper">
                <input
                    type="checkbox"
                    v-model="allowForeignPoints"
                    id="cbxAllowForeignPoints"
                    class="cbx"
                />
                <label for="cbxAllowForeignPoints" class="cbx_label">
                    Origen o destino fuera de
                    {{ config ? config.country_name : '' }}
                </label>
                <span
                    class="tooltip-bottom"
                    data-tooltip="Marcando esta opción vas a poder seleccionar origen o destino fuera de Argentina. Recordá averiguar con la aseguradora del auto, si tenés cobertura contra terceros fuera de la Argentina. Si no es así, averiguá con ella para obtener la extensión fuera de Argentina, de forma de tener cobertura durante el viaje"
                ></span>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
        </div>
        <div class="row search-section">
            <div class="col-xs-12 col-md-3">
                <button
                    class="btn btn-option"
                    :class="{ active: !isPassenger }"
                    @click="isPassenger = false"
                >
                    <span class="fa fa-car" aria-hidden="true"></span>
                    <span>{{ $t('buscoConductor') }}</span>
                </button>
            </div>
            <div class="col-xs-12 col-md-3">
                <button
                    class="btn btn-option"
                    :class="{ active: isPassenger }"
                    @click="isPassenger = true"
                >
                    <img
                        alt=""
                        :src="
                            isPassenger
                                ? pasajero_logo_blanco
                                : pasajero_logo_gris
                        "
                    />
                    <span>{{ $t('buscoPasajero') }}</span>
                </button>
            </div>
            <div
                class="row text-center foreignCountry-select foreignCountry-select-mobile"
                v-show="isMobile"
            >
                <div class="foreignCountry-select_wrapper">
                    <input
                        type="checkbox"
                        v-model="allowForeignPoints"
                        id="cbxAllowForeignPoints"
                        class="cbx"
                    />
                    <label for="cbxAllowForeignPoints" class="cbx_label">
                        Origen o destino fuera de
                        {{ config ? config.country_name : '' }}
                    </label>
                    <span
                        class="tooltip-bottom"
                        data-tooltip="Marcando esta opción vas a poder seleccionar origen o destino fuera de Argentina. Recordá averiguar con la aseguradora del auto, si tenés cobertura contra terceros fuera de la Argentina. Si no es así, averiguá con ella para obtener la extensión fuera de Argentina, de forma de tener cobertura durante el viaje"
                    ></span>
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
            </div>
            <div class="col-xs-24 col-md-5 gmap-autocomplete origin">
                <autocomplete
                    :placeholder="'Origen'"
                    name="from_town"
                    ref="from_town"
                    :value="from_town.name"
                    v-on:place_changed="(data) => getPlace(0, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></autocomplete>
                <!-- <GmapAutocomplete name="from_town" ref="from_town" :selectFirstOnEnter="true" :types="['(cities)']"  :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}"  placeholder="Origen"  :value="from_town.name" v-on:place_changed="(data) => getPlace(0, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete>-->
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('from_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">(opcional)</div>
                <div class="swap btn">
                    <img
                        alt="swap"
                        class="swap-horizontal"
                        :src="swap_horizontal"
                        @click="swapCities"
                    />
                    <img
                        alt="swap"
                        class="swap-vertical"
                        :src="swap_vertical"
                        @click="swapCities"
                    />
                </div>
            </div>
            <div class="col-xs-24 col-md-5 gmap-autocomplete destiny">
                <autocomplete
                    :placeholder="'Destino'"
                    name="to_town"
                    ref="to_town"
                    :value="to_town.name"
                    v-on:place_changed="(data) => getPlace(1, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></autocomplete>
                <!-- <GmapAutocomplete name="to_town" ref="to_town" :selectFirstOnEnter="true" :types="['(cities)']"  :componentRestrictions="allowForeignPoints ? null : {country: 'AR'}"  placeholder="Destino"  :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)" class="form-control form-control-with-icon form-control-map-autocomplete"> </GmapAutocomplete> -->
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('to_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">(opcional)</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker
                    ref="datepicker"
                    :value="date"
                    :minDate="minDate"
                    :class="{ 'has-error': dateError.state }"
                ></DatePicker>
                <div class="optional-warning text-center">(opcional)</div>
            </div>
            <div class="col-xs-24 col-md-3 col-lg-4">
                <button class="btn btn-primary btn-search" @click="emit">
                    Buscar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DatePicker from '../DatePicker';
import autocomplete from '../Autocomplete.vue';
import bus from '../../services/bus-event.js';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'search-trip',
    data() {
        return {
            minDate: moment().toDate(),
            isPassenger: false,
            from_town: {
                name: '',
                location: null,
                radio: 0,
                country: ''
            },
            to_town: {
                name: '',
                location: null,
                radio: 0,
                country: ''
            },
            date: '',
            dateAnswer: '',
            dateError: {
                message: '',
                state: ''
            },
            chofer_logo_blanco:
                process.env.ROUTE_BASE +
                'static/img/icono-conductor-blanco.png',
            pasajero_logo_blanco:
                process.env.ROUTE_BASE + 'static/img/icono-pasajero-blanco.png',
            chofer_logo_gris:
                process.env.ROUTE_BASE + 'static/img/icono-conductor-gris.png',
            pasajero_logo_gris:
                process.env.ROUTE_BASE + 'static/img/icono-pasajero-gris.png',
            swap_horizontal:
                process.env.ROUTE_BASE + 'static/img/flechas_horizontales.png',
            swap_vertical:
                process.env.ROUTE_BASE + 'static/img/flechas_verticales.png',
            allowForeignPoints: false,
            options: []
        };
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile',
            config: 'auth/appConfig'
        })
    },
    mounted() {
        bus.on('date-change', this.dateChange);
        this.loadParams(this.params);
        this.from_town.country = this.config.osm_country;
        this.to_town.country = this.config.osm_country;
        this.$refs['from_town'].$el.addEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.addEventListener('input', this.checkInput);
    },
    updated() {},
    beforeDestroy() {
        this.$refs['from_town'].$el.removeEventListener(
            'input',
            this.checkInput
        );
        this.$refs['to_town'].$el.removeEventListener('input', this.checkInput);
        bus.off('date-change', this.dateChange);
    },
    methods: {
        dateChange(value) {
            this.dateAnswer = value;
        },
        checkInput(event) {
            let value = event.target.value;
            let name = event.target.name;
            if (value === '') {
                this[name] = '';
            }
        },
        getPlace(i, data) {
            console.log('getPlace', data);
            let obj = {};
            // FIXME falta bounding box
            if (data) {
                obj = {
                    name: data.name,
                    location: {
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lng)
                    },
                    country: data.country,
                    id: data.id
                };
            }
            if (i === 0) {
                this.from_town = obj;
            } else {
                this.to_town = obj;
            }
        },
        emit() {
            let params = {};
            let foreignCountry = 0;
            if (this.from_town.location) {
                console.log('from_town', this.from_town);
                params.origin_lat = this.from_town.location.lat;
                params.origin_lng = this.from_town.location.lng;
                params.origin_radio = this.from_town.radio;
                params.origin_name = this.from_town.name;
                params.origin_id = this.from_town.id;
            } else {
                params.origin_name = this.$refs['from_town'].input;
            }
            if (
                this.from_town &&
                this.from_town.country &&
                this.from_town.country.toLowerCase() !==
                    this.config.osm_country.toLowerCase()
            ) {
                foreignCountry++;
            }
            if (this.to_town.location) {
                params.destination_lat = this.to_town.location.lat;
                params.destination_lng = this.to_town.location.lng;
                params.destination_radio = this.to_town.radio;
                params.destination_name = this.to_town.name;
                params.destination_id = this.to_town.id;
            } else {
                params.destination_name = this.$refs['to_town'].input;
            }
            if (
                this.to_town &&
                this.to_town.country &&
                this.to_town.country.toLowerCase() !==
                    this.config.osm_country.toLowerCase()
            ) {
                foreignCountry++;
            }
            if (this.dateAnswer) {
                params.date = this.dateAnswer;
            }
            params.is_passenger = this.isPassenger;
            if (foreignCountry < 2) {
                // console.log('trip-search', params);
                this.$emit('trip-search', params);
            } else {
                dialogs.message(
                    'Origen y destino no pueden ser ambos del exterior.',
                    {
                        duration: 10,
                        estado: 'error'
                    }
                );
            }
        },
        resetInput(input) {
            if (this.$refs[input]) {
                this.$refs[input].input = '';
            }
            this[input] = {
                name: '',
                location: null,
                radio: 0,
                country: this.config.osm_country
            };
        },
        swapCities() {
            let temp;
            temp = this['to_town'];
            this['to_town'] = Object.assign({}, this['from_town']);
            this['from_town'] = Object.assign({}, temp);
        },
        clear() {
            this.resetInput('from_town');
            this.$refs['from_town'].input = '';
            this.resetInput('to_town');
            this.$refs['to_town'].input = '';
            this.$refs.datepicker.clear();
        },
        loadParams(parameters) {
            if (parameters) {
                if (parameters.origin_name) {
                    this.from_town.name = parameters.origin_name;
                    this.from_town.location = {
                        lat: parameters.origin_lat,
                        lng: parameters.origin_lng
                    };
                    this.from_town.radio = parameters.origin_radio;
                    this.from_town.id = parameters.origin_id;
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
                    this.to_town.id = parameters.destination_id;
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
        },
        onSearch(search, loading) {
            loading(true);
            this.search(loading, search, this);
        }
    },
    props: ['params'],
    components: {
        DatePicker,
        autocomplete
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
.foreignCountry-select {
    margin-bottom: 1em;
}
.foreignCountry-select-mobile {
    width: 100%;
}
.foreignCountry-select-desktop .foreignCountry-select_wrapper {
    margin-left: -10%;
}
.cbx,
.cbx_label {
    vertical-align: middle;
    margin: 0;
}
.cbx_label {
    margin-left: 0.5em;
}
.optional-warning {
    font-size: 0.8em;
    color: #999;
    position: relative;
    top: -0.8em;
    clear: both;
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
        padding: 1em 0.4em;
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
