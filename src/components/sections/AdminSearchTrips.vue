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
                    {{ t('origenODestinoFueraDe') }}
                    {{ config ? config.country_name : '' }}
                </label>
                <span
                    class="tooltip-bottom"
                    :data-tooltip="t('marcandoEstaOpcionPodrasSeleccionar')"
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
                    <span>{{ t('conductor') }}</span>
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
                    <span>{{ t('pasajero') }}</span>
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
                        {{ t('origenODestinoFueraDe') }}
                        {{ config ? config.country_name : '' }}
                    </label>
                    <span
                        class="tooltip-bottom"
                        :data-tooltip="t('marcandoEstaOpcionPodrasSeleccionar')"
                    ></span>
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
            </div>

            <div class="col-xs-24 col-md-8 gmap-autocomplete origin">
                <Autocomplete
                    :placeholder="t('origen')"
                    name="from_town"
                    ref="from_town_ref"
                    :value="from_town.name"
                    v-on:place_changed="(data) => getPlace(0, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('from_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
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
            <div class="col-xs-24 col-md-8 gmap-autocomplete destiny">
                <Autocomplete
                    :placeholder="t('destino')"
                    name="to_town"
                    ref="to_town_ref"
                    :value="to_town.name"
                    v-on:place_changed="(data) => getPlace(1, data)"
                    :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetInput('to_town')"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>

            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker
                    ref="datepicker"
                    :value="from_date"
                    :class="{ 'has-error': dateError.state }"
                    v-on:date_changed="(date) => (from_date = date)"
                ></DatePicker>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker
                    ref="datepicker"
                    :value="to_date"
                    :class="{ 'has-error': dateError.state }"
                    v-on:date_changed="(date) => (to_date = date)"
                ></DatePicker>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>

            <div class="col-xs-24 col-md-8 gmap-autocomplete origin">
                <div class="search-users">
                    <input
                        v-model="userSearch"
                        v-on:keyup="onSearchUsers"
                        type="text"
                        class="form-control form-control-with-icon search-users-input"
                        :placeholder="t('escribeUnNombre')"
                    />
                    <div v-if="userSearch.length != 0 && showAutocomplete">
                        <loading class="autocomplete-users" :data="userList">
                            <li
                                v-for="user in userList"
                                class="list-group-item conversation_header"
                                @click="selectUser(user)"
                                v-bind:key="user.id"
                            >
                                <div class="media">
                                    <div class="media-body">
                                        <h4 class="media-heading">
                                            <span class="conversation-title">{{
                                                user.name
                                            }}</span>
                                        </h4>
                                        <span>{{ user.email }}</span>
                                    </div>
                                </div>
                            </li>
                            <template #no-data>
                                <li
                                    class="list-group-item alert alert-warning"
                                    role="alert"
                                >
                                    {{ t('noSeEncontroNingunUsuario') }}
                                </li>
                            </template>
                            <template #loading>
                                <li
                                    class="list-group-item alert alert-info"
                                    role="alert"
                                >
                                    <img
                                        src="https://carpoolear.com.ar/static/img/loader.gif"
                                        alt=""
                                        class="ajax-loader"
                                    />
                                    {{ t('cargandoUsuarios') }}
                                </li>
                            </template>
                        </loading>
                    </div>
                </div>
                <div class="date-picker--cross">
                    <i
                        v-on:click="resetUser()"
                        class="fa fa-times"
                        aria-hidden="true"
                    ></i>
                </div>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>

            <div class="col-xs-24 col-md-8 col-lg-8">
                <button class="btn btn-primary btn-search" @click="emitSearch">
                    {{ t('buscar') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useAdminStore } from '@/stores/admin';
import DatePicker from '../DatePicker';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import loading from '../Loading';
import Autocomplete from '../Autocomplete';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const props = defineProps(['params']);
const emit = defineEmits(['admin-trip-search']);

const from_town_ref = ref(null);
const to_town_ref = ref(null);
const datepicker = ref(null);

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';

const minDate = ref(moment().toDate());
const isPassenger = ref(false);
const isAdmin = ref(true);
const from_town = ref({
    name: '',
    location: null,
    radio: 0,
    country: 'ARG'
});
const to_town = ref({
    name: '',
    location: null,
    radio: 0,
    country: 'ARG'
});
const from_date = ref('');
const to_date = ref('');
const dateAnswer = ref('');
const dateError = reactive({
    message: '',
    state: ''
});
const user = ref('');
const showAutocomplete = ref(false);
const userSearch = ref('');
const userList = ref([]);
const chofer_logo_blanco = ROUTE_BASE + 'static/img/icono-conductor-blanco.png';
const pasajero_logo_blanco = ROUTE_BASE + 'static/img/icono-pasajero-blanco.png';
const chofer_logo_gris = ROUTE_BASE + 'static/img/icono-conductor-gris.png';
const pasajero_logo_gris = ROUTE_BASE + 'static/img/icono-pasajero-gris.png';
const swap_horizontal = ROUTE_BASE + 'static/img/flechas_horizontales.png';
const swap_vertical = ROUTE_BASE + 'static/img/flechas_verticales.png';
const allowForeignPoints = ref(false);
const options = ref([]);

const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

function onSearchUsers() {
    showAutocomplete.value = true;
    adminStore.searchUsers(userSearch.value)
        .then((data) => {
            userList.value = data.data.slice(0, 3);
        })
        .catch((err) => {
            console.log(err);
            userList.value = [];
        });
}

function selectUser(u) {
    showAutocomplete.value = false;
    userList.value = null;
    userSearch.value = u.name;
    user.value = u;
}

function getPlace(i, data) {
    console.log('getPlace', data);
    let obj = {};
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
        from_town.value = obj;
    } else {
        to_town.value = obj;
    }
}

function emitSearch() {
    let params = {};
    let foreignCountry = 0;
    if (from_town.value.location) {
        console.log('emit', from_town.value.location);
        params.origin_lat = from_town.value.location.lat;
        params.origin_lng = from_town.value.location.lng;
        params.origin_radio = from_town.value.radio;
        params.origin_name = from_town.value.name;
        params.origin_id = from_town.value.id;
    } else {
        params.origin_name = from_town_ref.value?.input;
    }
    if (
        from_town.value &&
        from_town.value.country &&
        from_town.value.country.toLowerCase() !==
            config.value.osm_country.toLowerCase()
    ) {
        foreignCountry++;
    }
    if (to_town.value.location) {
        params.destination_lat = to_town.value.location.lat;
        params.destination_lng = to_town.value.location.lng;
        params.destination_radio = to_town.value.radio;
        params.destination_name = to_town.value.name;
        params.destination_id = to_town.value.id;
    } else {
        params.destination_name = to_town_ref.value?.input;
    }
    if (
        to_town.value &&
        to_town.value.country &&
        to_town.value.country.toLowerCase() !==
            config.value.osm_country.toLowerCase()
    ) {
        foreignCountry++;
    }
    if (from_date.value) {
        params.from_date = from_date.value;
    }
    if (to_date.value) {
        params.to_date = to_date.value;
    }

    if (!from_date.value && !to_date.value) {
        params.history = true;
    }
    if (user.value.id) {
        params.user_id = user.value.id;
    }
    params.is_passenger = isPassenger.value;
    params.is_admin = isAdmin.value;
    if (foreignCountry < 2) {
        emit('admin-trip-search', params);
    } else {
        dialogs.message(
            t('origenYDestinoNoPuedenSerAmbosDelExterior'),
            {
                duration: 10,
                estado: 'error'
            }
        );
    }
}

function resetInput(input) {
    const refMap = { from_town: from_town_ref, to_town: to_town_ref };
    const dataMap = { from_town, to_town };
    if (refMap[input]?.value) {
        refMap[input].value.input = '';
    }
    dataMap[input].value = {
        name: '',
        location: null,
        radio: 0,
        country: config.value.osm_country
    };
}

function resetUser() {
    user.value = {};
    userSearch.value = '';
}

function swapCities() {
    let temp = to_town.value;
    to_town.value = Object.assign({}, from_town.value);
    from_town.value = Object.assign({}, temp);
}

function clear() {
    resetInput('from_town');
    from_town_ref.value.input = '';
    resetInput('to_town');
    to_town_ref.value.input = '';
    datepicker.value.clear();
}

function onSearch(search, loadingFn) {
    loadingFn(true);
}

defineExpose({ clear });
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

.search-users-input {
    line-height: 42px;
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
