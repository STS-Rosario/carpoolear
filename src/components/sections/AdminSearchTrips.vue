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
        <div class="row search-section">
            <div class="col-xs-12 col-md-4">
                <button
                    class="btn btn-option"
                    :class="{ active: !isPassenger }"
                    @click="isPassenger = false"
                >
                    <!--<img alt="" :src="isPassenger ? chofer_logo_gris : chofer_logo_blanco" />-->
                    <span class="fa fa-car" aria-hidden="true"></span>
                    <span>{{ $t('conductor') }}</span>
                </button>
            </div>
            <div class="col-xs-12 col-md-4">
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
                    <span>{{ $t('pasajero') }}</span>
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

            <div class="col-xs-24 col-md-8 location-autocomplete origin">
                <Autocomplete
                    :placeholder="$t('origen')"
                    name="from_town"
                    ref="from_town"
                    :model-value="from_town.name"
                    v-on:place_changed="(data) => getPlace(0, data)"
                    :classes="'admin-search-trips__autocomplete-input'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
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
            <div class="col-xs-24 col-md-8 location-autocomplete destiny">
                <Autocomplete
                    :placeholder="$t('destino')"
                    name="to_town"
                    ref="to_town"
                    :model-value="to_town.name"
                    v-on:place_changed="(data) => getPlace(1, data)"
                    :classes="'admin-search-trips__autocomplete-input'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
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
                <AppField>
                    <DatePicker
                        ref="datepicker"
                        :model-value="from_date"
                        :class="{ 'has-error': dateError.state }"
                        v-on:date_changed="(date) => (this.from_date = date)"
                    ></DatePicker>
                </AppField>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <AppField>
                    <DatePicker
                        ref="datepicker"
                        :model-value="to_date"
                        :class="{ 'has-error': dateError.state }"
                        v-on:date_changed="(date) => (this.to_date = date)"
                    ></DatePicker>
                </AppField>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
            </div>

            <div class="col-xs-24 col-md-8 location-autocomplete origin">
                <div class="search-users">
                    <UserSearchAutocomplete
                        v-model="user"
                        :placeholder="$t('escribeUnNombre')"
                        :max-results="3"
                        input-class="admin-search-trips__user-search-input"
                    />
                </div>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetUser()"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ $t('opcional') }})</div>
            </div>

            <div class="col-xs-24 col-md-8 col-lg-8">
                <AppButton
                    variant="primary"
                    class="btn-search"
                    @click="submitSearch"
                >
                    {{ $t('buscar') }}
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';
import DatePicker from '../DatePicker';
import dayjs from '../../dayjs';
import dialogs from '../../services/dialogs.js';
import loading from '../Loading';
import Autocomplete from '../Autocomplete';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';

export default {
    name: 'search-trip',
    data() {
        return {
            minDate: dayjs().toDate(),
            isPassenger: false,
            isAdmin: true,
            from_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'ARG'
            },
            to_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'ARG'
            },
            from_date: '',
            to_date: '',
            dateAnswer: '',
            dateError: {
                message: '',
                state: ''
            },
            user: null,
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
        paramsSignature() {
            const p = this.params || {};
            const keys = Object.keys(p).sort();
            return JSON.stringify(
                keys.reduce((acc, k) => {
                    acc[k] = p[k];
                    return acc;
                }, {})
            );
        }
    },
    methods: {
        ...mapActions(useTripsStore, {
            search: 'tripsSearch'
        }),
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
                    country: data.country
                };
            }
            if (i === 0) {
                this.from_town = obj;
            } else {
                this.to_town = obj;
            }
        },
        submitSearch() {
            this.emit(false);
        },
        emit(includeRoutePage = false) {
            let params = {};
            let foreignCountry = 0;
            if (this.from_town.location) {
                console.log('emit', this.from_town.location);
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
            if (this.from_date) {
                params.from_date = this.from_date;
            }
            if (this.to_date) {
                params.to_date = this.to_date;
            }

            if (!this.from_date && !this.to_date) {
                params.history = true;
            }
            if (this.user && this.user.id) {
                params.user_id = this.user.id;
            }
            params.is_passenger = this.isPassenger;
            params.is_admin = this.isAdmin;
            if (
                includeRoutePage &&
                this.params &&
                this.params.page != null
            ) {
                const p = parseInt(String(this.params.page), 10);
                if (Number.isFinite(p) && p >= 1) {
                    params.page = p;
                }
            }
            if (foreignCountry < 2) {
                this.$emit('admin-trip-search', params);
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
            }
            this[input] = {
                name: '',
                location: null,
                radio: 0,
                country: this.config.osm_country
            };
        },
        resetUser() {
            this.user = null;
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
        onSearch(search, loading) {
            loading(true);
            this.search(loading, search, this);
        },
        applyParams() {
            const params = this.params || {};
            if (params.user_id) {
                const userId = parseInt(params.user_id, 10);
                if (!Number.isNaN(userId) && userId > 0) {
                    this.user = {
                        id: userId,
                        name: params.user_name ? String(params.user_name) : ''
                    };
                }
            }
            if (params.is_passenger != null) {
                const raw = String(params.is_passenger).toLowerCase();
                this.isPassenger = raw === '1' || raw === 'true';
            }
            if (params.from_date) this.from_date = String(params.from_date);
            if (params.to_date) this.to_date = String(params.to_date);

            const hasAnyParam = Object.keys(params).length > 0;
            if (hasAnyParam) {
                this.emit(true);
            }
        }
    },
    props: ['params'],
    components: {
        DatePicker,
        Autocomplete,
        loading,
        UserSearchAutocomplete,
        AppButton,
        AppField
    },
    watch: {
        paramsSignature: {
            immediate: true,
            handler() {
                this.applyParams();
            }
        }
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
.search-users {
    position: relative;
}

.admin-search-trips__user-search-input,
.search-users-input {
    line-height: 42px;
}

.origin :deep(.admin-search-trips__autocomplete-input) {
    line-height: 22px;
    border-color: var(--trip-half-free-color);
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQeFSkEDUzeggAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAEdklEQVRYw62XS+hVVRTGf986ouTARw9KJfVvEYTRe9ADH5glgRIVlgMpbOYgaBoURU2CRkVRIKQNHKiEkNjA6A2BUEETaVT/wMLICgUN5X/W12Cfc+65lv97JA8c7r377r3X2mt96/vWlk8dhwXL+O8ngcA2SAgw9D4TOxA1VoXIbqUJxORnzqz/OkBQTBdnxowTSImpyiABrbNDrJcVszzKsq+KMdLFkJu/u5NmMShwCA80PtkByoG6aSFQFsvNmJptiqvZpOUyOWCLECR1k9/sTpw506SlvGF1eAllF6X/hQFJGAgq7BpJ6Mxf8M1bxPd7PuLU9MOeKeH34qkjun3HJu7eCfOvhoFp0KAqaEH3w0H4cOdPnPl9pSOITIgKqMGQCnTFVdPa8vaUb946yIdZHTC9gxw7APu32U5EQGRjtIFFqAUMGRVs3a+4+bEyJBp8xKVhoC05/30SDu38JUWH9lGOAwcNCBtgZk0c2nGGM78hlemtccMYPiZWATY6+hY++8fScEkJkdSAoyJcsBLZpExCBPXZ0/P9za6xaHZVo0twQBJ8v/egY4SLNFRL7niNpz4RL52Xtn+qXHrrG6loTCUVwHe7vsR144AvcCaxPQEDdim5V+c5sibVcKENT38spjaUsjQw/Rm8v9EtgWFwNRe9cE7diRs8lIqqBmBAJelRl1OEwWlQBVMbmgqpscAr7qd4MuIA1efH8aJ236obmkBEBViuircFhA3f//h5s4EwRtNfk4oGpYFdMNIadi/0l1AFwiQsXH4EF2MzynLS/VtPMP0FpIifv4IDj5/ANUUICjlpwfIj/YpqaRuPcDi7Gracf9OWTRx904Vmg3TAuT+vjT3rbQuHkHN0mibsuXrrpnBdUpZFJdGYnk9IAeWwuu3pEuwAZRLMEI1ISSacWNERjlXkWbc8UYy7CFlfJVMeRkQIWHInrFy7rSnz3rIkW2BldkFOarxq/TYtuauHgQtzrwEghCZ04PWv7LPVGMwRC3aR6LSbKkHrXt7XZ6AOA27BPYSImu7GrtGKNWjVA5s11uokERpHtgRTGzezYt0FYhKdJ63KDuSBUrcIvOWdw5q74HRhvDb0va0E9bwrf/Uj7x4eNS5ctDewPSAFvcV55Y1wz3ML1dZ6VNhQt3ggqO59dpkW3fAfAjAu8xqshm3O04Xf172Irr/vmVRCXeq9krAhVq7ZnmufHzWoPfDZ9QhTLRdIA8So6Y4dahZX+NHduz3/umOSu1jl/MUneWTP3qDq962dDEtVQysai8oEB3KsZov2ghZNUT2+d7WjgqxIoHryg2tYtBIkUjm0I5vkQHQ121ZtB4lVG9CDryvnQDz0hli+vgt91V5mhjw+dRzbF33TNZnt77p8Zj36/u17OGdwOyd78wa8szelLiDURRvFC4YSiOYSw7DGeLIWjN33erel9pYE1LgX8uHGB6hhjolSGevdkhpH5sRI5eye2Ol/RqCU0OiWK/XZL8cd6eZkw555GSLwL0KgZ1QTzhSDtv0HA/lOUhgOeYAAAAAASUVORK5CYII=') no-repeat center left white;
}

.destiny :deep(.admin-search-trips__autocomplete-input) {
    line-height: 22px;
    border-color: var(--trip-mostly-free-color);
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQeFSoMKLoFcwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAE50lEQVRYw6WXW4hVZRTH//+1z4MzqXmZcSZCJ51SGQQvoJZieAnEIDNF6sEyrJDoAr1ERAS+hNBDNU/dTLv4EkKkkCTWmDAviSBEUqCUjQ9qzWRZKs3Z37+H9e3L0ensY2447G9fzvetb631/621OXLlLCaPux1jHQLA0iC/zo8AwAAECObPggATJAOJysOaPw7xnMZFBAiQ4jNZbgSz900IUEuLVxsgxlMCwGAQwBAnN3dHNEJSnM5gSOL1TRpA+o7Z8Lp5LPKX4O5n5gPF27x5AwTLnFCERIAYcht8FKDoBQM9WAwtGVBr6oFrDRLxdzqML0/1Y3Doky8uXD2zLiAFBXS2zTy0YsZja9f2PofxtcnV6ZWt0UwFjd4IOHZ+P/Ycf+qXi+lv05NgqCcBVKNDJyVThrYuenvGkq5NLSVicwMEgAEpDMfP7cObxzarnJ++uOVqkQAmRFI3PL90Hxd3bYCgPD+g+JKxRRXEbP+rPoJdJ7afqynxRZjkO6cAKma/EUqFFCneP/HEuYv1Cw3JKPjiylVTmYTu+sOn+/FnfaQrtRQGQBJEwJAUu6dPSroXLo1e7Pr6p3d80VxVkWZRNZ60FQ6gDEeH9gxQhhAiGkT0Tli488Vlh7l3fcqXlh9iz4SFO8kkSsOVcfTMroHMVTkWFGEWDapMQinF1gPjNGp1JErynb68/CvOm7w6Whrw/fAAXhu8TzAW7lUNHz9wlZlhQgAdZ3lgqrVCYhR1UEDKNO4OmDdlJcAYABn6pq6C6OHJJg+swxcPDWRl67UAIAykA4lknMrw3fBAZh8E4OTwAGqqIcIzqsRKiM7oGG6EhM65zraeQ5TH1uQK6D+26Y+TwwMQUvzw+xG89e3mX+sMEIsa2dk2/UimApWwXTaiVkVqAljcvX7twZ/7lUow8xBc/ufSxJ2Da1SnGlhAEgye+3d3P7wqMHW1KHV3wSARZIDEqmrotL+nZ4vr3Qs+SGf9qGWQCe5uAkrldVPAkp5HvDIiALGiZkZmBay5DCUIht4JizCn494tjL1AGb+S54UYsWwAaOjrWLV51sSFcR8lHEUZIvKkuQeMYIzoptk79jp8LC+5FhonyfCcoo6Ns1/Zl3nQSnlPen1n9EQ1CeWp2Dd1BeZNXb3RpVaQKuM8I5ZFYEHHmgf7OlYCDNfnuewGGhI4930Hhm0L3v2svTb+MmlFiuQa91N7MuX84/Pf2++at7xryDsIFv1MdQjkJMxevm1cL+6/84VbklDYLxZnQ4J1s57t7m6bGVmf5o1NQxjifJUhcBcnTj8KgvDQXa9i9rTl23zRKD35eU7Hsm0b5u4ouiEmjZ11QEmuahHFCJARlIF0zD45/8Pdk5LOHxGcFMGAW2sdQ9vnf7TbSt0zy9jNI2IN0W+hLbdYvVySgqG7vQdPL907N2GCEATK8MzST2dMa78DhMGUXNNLNjlGrpz1+j7GL1XIxyH4OA2Cgt87cPp1PPp5TQdPvYEgIYR68f80/Oe85V9TA8J199JoWB0hjr8580HDtZT6OKglAyr6gRiCUO7jQmR50ecJBablZdNz4OY/zSwnYiFHllorr34sGcsbWLxFFWSllEVfF7ErOaozFkBZv6LGr6f//2XkPQDH+CrOWB7KhYYxUiQCW7Og+svIxure7JqOYQyEt/ht+C8WN+Pl02VYHAAAAABJRU5ErkJggg==') no-repeat center left white;
}

.autocomplete-users {
    position: absolute;
    top: 100%;
    z-index: 100;
    width: 100%;
    cursor: pointer;
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
