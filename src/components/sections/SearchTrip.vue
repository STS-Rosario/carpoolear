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
            <div class="col-xs-12 col-md-3">
                <button
                    class="btn btn-option"
                    :class="{ active: !isPassenger }"
                    @click="isPassenger = false"
                >
                    <span class="fa fa-car" aria-hidden="true"></span>
                    <span v-html="t('buscoConductor')"></span>
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
                    <span>{{ t('buscoPasajero') }}</span>
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
            <div class="col-xs-24 col-md-5 gmap-autocomplete origin">
                <autocomplete
                    :placeholder="t('origen')"
                    name="from_town"
                    ref="from_town_ref"
                    :value="from_town.name"
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
            <div class="col-xs-24 col-md-5 gmap-autocomplete destiny">
                <autocomplete
                    :placeholder="t('destino')"
                    name="to_town"
                    ref="to_town_ref"
                    :value="to_town.name"
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
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>
            <div class="col-xs-24 col-md-4 no-padding">
                <DatePicker
                    ref="datepickerRef"
                    :value="date"
                    :minDate="minDate"
                    :class="{ 'has-error': dateError.state }"
                ></DatePicker>
                <div class="optional-warning text-center">({{ t('opcional') }})</div>
            </div>
            <div v-if="!autoSearch" class="col-xs-24 col-md-3 col-lg-4">
                <button class="btn btn-primary btn-search" @click="emitSearch">
                    {{ t('buscar') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device';
import { useAuthStore } from '@/stores/auth';
import DatePicker from '../DatePicker';
import autocomplete from '../Autocomplete.vue';
import bus from '../../services/bus-event.js';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const authStore = useAuthStore();

const props = defineProps(['params']);
const emit = defineEmits(['trip-search']);

const from_town_ref = ref(null);
const to_town_ref = ref(null);
const datepickerRef = ref(null);

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';

const minDate = ref(moment().toDate());
const isPassenger = ref(false);
const from_town = ref({
    name: '',
    location: null,
    radio: 0,
    country: ''
});
const to_town = ref({
    name: '',
    location: null,
    radio: 0,
    country: ''
});
const date = ref('');
const dateAnswer = ref('');
const dateError = reactive({
    message: '',
    state: ''
});
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
const autoSearch = computed(() => {
    return config.value.trips_auto_search && !isMobile.value;
});

function dateChange(value) {
    dateAnswer.value = value;
}

function checkInput(event) {
    let value = event.target.value;
    let name = event.target.name;
    if (value === '') {
        if (name === 'from_town') {
            from_town.value = '';
        } else if (name === 'to_town') {
            to_town.value = '';
        }
    }
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
            country: data.country,
            id: data.id
        };
    }
    if (i === 0) {
        from_town.value = obj;
        if (config.value.trips_focus_next) {
            to_town_ref.value.focus();
        }
    } else {
        to_town.value = obj;
        if (config.value.trips_focus_next) {
            datepickerRef.value.setFocus();
        }
    }
}

function emitSearch() {
    let params = {};
    let foreignCountry = 0;
    if (from_town.value.location) {
        console.log('from_town', from_town.value);
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
    if (dateAnswer.value) {
        params.date = dateAnswer.value;
    }
    params.is_passenger = isPassenger.value;
    if (foreignCountry < 2) {
        emit('trip-search', params);
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
        refMap[input].value.focus();
    }
    dataMap[input].value = {
        name: '',
        location: null,
        radio: 0,
        country: config.value.osm_country
    };
}

function swapCities() {
    let temp = to_town.value;
    to_town.value = Object.assign({}, from_town.value);
    from_town.value = Object.assign({}, temp);

    // Search will only auto-trigger on desktop
    if (!isMobile.value && autoSearch.value) {
        emitSearch();
    }
}

function clear() {
    resetInput('from_town');
    from_town_ref.value.input = '';
    resetInput('to_town');
    to_town_ref.value.input = '';
    datepickerRef.value.clear();
}

function loadParams(parameters) {
    if (parameters) {
        if (parameters.origin_name) {
            from_town.value.name = parameters.origin_name;
            from_town.value.location = {
                lat: parameters.origin_lat,
                lng: parameters.origin_lng
            };
            from_town.value.radio = parameters.origin_radio;
            from_town.value.id = parameters.origin_id;
        } else {
            resetInput('from_town');
        }

        if (parameters.destination_name) {
            to_town.value.name = parameters.destination_name;
            to_town.value.location = {
                lat: parameters.destination_lat,
                lng: parameters.destination_lng
            };
            to_town.value.radio = parameters.destination_radio;
            to_town.value.id = parameters.destination_id;
        } else {
            resetInput('to_town');
        }
        if (parameters.is_passenger) {
            isPassenger.value = parameters.is_passenger;
        } else {
            isPassenger.value = false;
        }
        if (parameters.date) {
            date.value = parameters.date;
        } else {
            date.value = '';
        }
    }
}

watch(() => from_town.value.id, (newVal) => {
    if (autoSearch.value) {
        emitSearch();
    }
});

watch(() => to_town.value.id, (newVal) => {
    if (autoSearch.value) {
        emitSearch();
    }
});

watch(dateAnswer, (newVal) => {
    if (autoSearch.value) {
        emitSearch();
    }
});

watch(isPassenger, () => {
    if (autoSearch.value) {
        emitSearch();
    }
});

onMounted(() => {
    bus.on('date-change', dateChange);
    loadParams(props.params);
    from_town.value.country = config.value.osm_country;
    to_town.value.country = config.value.osm_country;
    from_town_ref.value?.$el.addEventListener('input', checkInput);
    to_town_ref.value?.$el.addEventListener('input', checkInput);
});

onBeforeUnmount(() => {
    from_town_ref.value?.$el.removeEventListener('input', checkInput);
    to_town_ref.value?.$el.removeEventListener('input', checkInput);
    bus.off('date-change', dateChange);
});

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
.search-section {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
}
</style>
