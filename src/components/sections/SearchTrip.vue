<template>
    <div>
        <div
            class="row text-center search-filters-desktop foreignCountry-select foreignCountry-select-desktop"
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
                    {{ $t('origenODestinoFueraDe') }}
                    {{ config ? config.country_name : '' }}
                </label>
                <span
                    class="tooltip-bottom"
                    :data-tooltip="$t('marcandoEstaOpcionPodrasSeleccionar')"
                ></span>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div class="advanced-filters-toggle_wrapper advanced-filters-toggle-desktop">
                <input
                    type="checkbox"
                    v-model="showAdvancedFilters"
                    id="cbxAdvancedFilters"
                    class="cbx"
                />
                <label for="cbxAdvancedFilters" class="cbx_label">
                    {{ $t('filtrosAvanzados') }}
                </label>
            </div>
        </div>
        <div
            class="row text-center search-advanced-filters search-advanced-filters-desktop"
            v-show="showAdvancedFilters && !isMobile"
        >
            <div class="search-advanced-filters__content">
                <div class="hide-carpooleado-select_wrapper">
                    <input
                        type="checkbox"
                        v-model="hideCarpooleado"
                        id="cbxHideCarpooleado"
                        class="cbx"
                    />
                    <label for="cbxHideCarpooleado" class="cbx_label">
                        {{ $t('esconderViajesCarpooleados') }}
                    </label>
                </div>
                <div class="allow-preference-filter">
                    <label for="allowAnimalsFilterDesktop">{{ $t('preferenciaPermitidoAnimales') }}</label>
                    <select id="allowAnimalsFilterDesktop" v-model="allowAnimalsFilter" class="form-control">
                        <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                        <option value="yes">{{ $t('filtroPermitido') }}</option>
                        <option value="no">{{ $t('filtroNoPermitido') }}</option>
                    </select>
                </div>
                <div class="allow-preference-filter">
                    <label for="allowSmokingFilterDesktop">{{ $t('preferenciaPermitidoFumar') }}</label>
                    <select id="allowSmokingFilterDesktop" v-model="allowSmokingFilter" class="form-control">
                        <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                        <option value="yes">{{ $t('filtroPermitido') }}</option>
                        <option value="no">{{ $t('filtroNoPermitido') }}</option>
                    </select>
                </div>
                <div class="allow-preference-filter">
                    <label for="allowKidsFilterDesktop">{{ $t('preferenciaPermitidoNinos') }}</label>
                    <select id="allowKidsFilterDesktop" v-model="allowKidsFilter" class="form-control">
                        <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                        <option value="yes">{{ $t('filtroPermitido') }}</option>
                        <option value="no">{{ $t('filtroNoPermitido') }}</option>
                    </select>
                </div>
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
                    <span v-html="$t('buscoConductor')"></span>
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
                    {{ $t('origenODestinoFueraDe') }}
                    {{ config ? config.country_name : '' }}
                </label>
                <span
                    class="tooltip-bottom"
                    :data-tooltip="$t('marcandoEstaOpcionPodrasSeleccionar')"
                ></span>
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
            </div>
            <div class="col-xs-24 col-md-5 location-autocomplete origin">
                <autocomplete
                    :placeholder="$t('origen')"
                    name="from_town"
                    ref="from_town"
                    :model-value="from_town.name"
                    v-on:place_changed="(data) => getPlace(0, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></autocomplete>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('from_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
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
            <div class="col-xs-24 col-md-5 location-autocomplete destiny">
                <autocomplete
                    :placeholder="$t('destino')"
                    name="to_town"
                    ref="to_town"
                    :model-value="to_town.name"
                    v-on:place_changed="(data) => getPlace(1, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></autocomplete>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('to_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker
                    ref="datepicker"
                    :model-value="date"
                    :minDate="minDate"
                    :class="{ 'has-error': dateError.state }"
                ></DatePicker>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
            </div>
            <div
                class="col-xs-24 advanced-filters-toggle-mobile"
                v-show="isMobile && !autoSearch"
            >
                <div class="advanced-filters-toggle_wrapper">
                    <input
                        type="checkbox"
                        v-model="showAdvancedFilters"
                        id="cbxAdvancedFiltersMobile"
                        class="cbx"
                    />
                    <label for="cbxAdvancedFiltersMobile" class="cbx_label">
                        {{ $t('filtrosAvanzados') }}
                    </label>
                </div>
            </div>
            <div
                class="col-xs-24 search-advanced-filters search-advanced-filters-mobile"
                v-show="showAdvancedFilters && isMobile && !autoSearch"
            >
                <div class="search-advanced-filters__content">
                    <div class="hide-carpooleado-select_wrapper">
                        <input
                            type="checkbox"
                            v-model="hideCarpooleado"
                            id="cbxHideCarpooleadoMobile"
                            class="cbx"
                        />
                        <label for="cbxHideCarpooleadoMobile" class="cbx_label">
                            {{ $t('esconderViajesCarpooleados') }}
                        </label>
                    </div>
                    <div class="allow-preference-filter">
                        <label for="allowAnimalsFilterMobile">{{ $t('preferenciaPermitidoAnimales') }}</label>
                        <select id="allowAnimalsFilterMobile" v-model="allowAnimalsFilter" class="form-control">
                            <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                            <option value="yes">{{ $t('filtroPermitido') }}</option>
                            <option value="no">{{ $t('filtroNoPermitido') }}</option>
                        </select>
                    </div>
                    <div class="allow-preference-filter">
                        <label for="allowSmokingFilterMobile">{{ $t('preferenciaPermitidoFumar') }}</label>
                        <select id="allowSmokingFilterMobile" v-model="allowSmokingFilter" class="form-control">
                            <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                            <option value="yes">{{ $t('filtroPermitido') }}</option>
                            <option value="no">{{ $t('filtroNoPermitido') }}</option>
                        </select>
                    </div>
                    <div class="allow-preference-filter">
                        <label for="allowKidsFilterMobile">{{ $t('preferenciaPermitidoNinos') }}</label>
                        <select id="allowKidsFilterMobile" v-model="allowKidsFilter" class="form-control">
                            <option :value="anyAllowFilter">{{ $t('filtroCualquiera') }}</option>
                            <option value="yes">{{ $t('filtroPermitido') }}</option>
                            <option value="no">{{ $t('filtroNoPermitido') }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="!autoSearch" class="col-xs-24 col-md-3 col-lg-4">
                <button class="btn btn-primary btn-search" @click="emit">
                    {{ $t('buscar') }} 
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
import DatePicker from '../DatePicker';
import autocomplete from '../Autocomplete.vue';
import bus from '../../services/bus-event.js';
import dayjs from '../../dayjs';
import dialogs from '../../services/dialogs.js';
import {
    ANY_ALLOW_FILTER,
    appendAllowPreferenceParams,
    hydrateAllowPreferenceFilters,
    hasAdvancedSearchFilters
} from '../../utils/searchAdvancedFilters.js';

export default {
    name: 'search-trip',
    data() {
        return {
            minDate: dayjs().toDate(),
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
                'img/icono-conductor-blanco.png',
            pasajero_logo_blanco:
                process.env.ROUTE_BASE + 'img/icono-pasajero-blanco.png',
            chofer_logo_gris:
                process.env.ROUTE_BASE + 'img/icono-conductor-gris.png',
            pasajero_logo_gris:
                process.env.ROUTE_BASE + 'img/icono-pasajero-gris.png',
            swap_horizontal:
                process.env.ROUTE_BASE + 'img/flechas_horizontales.png',
            swap_vertical:
                process.env.ROUTE_BASE + 'img/flechas_verticales.png',
            allowForeignPoints: false,
            showAdvancedFilters: false,
            hideCarpooleado: false,
            allowAnimalsFilter: ANY_ALLOW_FILTER,
            allowSmokingFilter: ANY_ALLOW_FILTER,
            allowKidsFilter: ANY_ALLOW_FILTER,
            anyAllowFilter: ANY_ALLOW_FILTER,
            options: []
        };
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        autoSearch() {
            return this.config.trips_auto_search && !this.isMobile;
        }
    },
    watch: {
        'from_town.id'(newVal) {
            if (this.autoSearch) {
                this.emit();
            }
        },
        'to_town.id'(newVal) {
            if (this.autoSearch) {
                this.emit();
            }
        },
        dateAnswer(newVal) {
            if (this.autoSearch) {
                this.emit();
            }
        },
        isPassenger() {
            if (this.autoSearch) {
                this.emit();
            }
        }
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
    beforeUnmount() {
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
                if (this.config.trips_focus_next) {
                    this.$refs.to_town.focus();
                }
            } else {
                this.to_town = obj;
                if (this.config.trips_focus_next) {
                    this.$refs.datepicker.setFocus();
                }
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
            if (this.hideCarpooleado) {
                params.hide_carpooleado = this.hideCarpooleado;
            }
            appendAllowPreferenceParams(params, {
                allowAnimals: this.allowAnimalsFilter,
                allowSmoking: this.allowSmokingFilter,
                allowKids: this.allowKidsFilter
            });
            if (foreignCountry < 2) {
                // console.log('trip-search', params);
                this.$emit('trip-search', params);
            } else {
                dialogs.message(
                    this.$t('origenYDestinoNoPuedenSerAmbosDelExterior'),
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
                this.$refs[input].focus();
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
            
            // Search will only auto-trigger on desktop
            if (!this.isMobile && this.autoSearch) {
                this.emit();
            }
        },
        clear() {
            this.resetInput('from_town');
            this.$refs['from_town'].input = '';
            this.resetInput('to_town');
            this.$refs['to_town'].input = '';
            this.$refs.datepicker.clear();
            this.resetAdvancedFilters();
        },
        resetAdvancedFilters() {
            this.showAdvancedFilters = false;
            this.hideCarpooleado = false;
            this.allowAnimalsFilter = ANY_ALLOW_FILTER;
            this.allowSmokingFilter = ANY_ALLOW_FILTER;
            this.allowKidsFilter = ANY_ALLOW_FILTER;
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
                const allowFilters = hydrateAllowPreferenceFilters(parameters);
                this.allowAnimalsFilter = allowFilters.allowAnimals;
                this.allowSmokingFilter = allowFilters.allowSmoking;
                this.allowKidsFilter = allowFilters.allowKids;
                this.hideCarpooleado = Boolean(parameters.hide_carpooleado);
                this.showAdvancedFilters = hasAdvancedSearchFilters(parameters);
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
.search-filters-desktop {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.foreignCountry-select-desktop .foreignCountry-select_wrapper {
    margin-left: -10%;
}
.advanced-filters-toggle-desktop {
    margin-left: 2em;
}
.advanced-filters-toggle-mobile,
.search-advanced-filters-mobile {
    margin-bottom: 1em;
}
.search-advanced-filters {
    margin-bottom: 1em;
}
.search-advanced-filters__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1em 2em;
}
.allow-preference-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 180px;
}
.allow-preference-filter label {
    margin-bottom: 0.25em;
}
.allow-preference-filter select {
    width: 100%;
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
.search-section {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
}
</style>
