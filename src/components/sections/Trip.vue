<template>
    <div
        :class="tripCardCountClass"
        v-on:click="clickModal ? openModal() : goToDetail(false)"
    >
        <tripDisplay
            v-if="showTrip && clickModal"
            :trip="trip"
            :clickOutside="closeModal"
        ></tripDisplay>
        <div
            class="trip"
            :class="{
                'trip-fill': seats_available === 0,
                'trip-almost-fill': seats_available === 1,
                'trip-mostly-available': seats_available > 3,
                'trip-with-driver': user,
                'trip-with-control': enableChangeSeats
            }"
        >
            <div
                class="panel panel-default panel-card card card-trip"
                :class="[tripCardClass]"
            >
                <div class="panel-heading card_heading">
                    <div class="panel-title card-trip_title row">
                        <div class="card-icon" v-if="tripCardTheme !== 'light'">
                            <span class="trip_visibility">
                                <span
                                    v-if="trip.friendship_type_id === 0"
                                    :title="t('visibilidadSoloAmigos')"
                                >
                                    <span
                                        class="tooltip"
                                        :title="t('visibilidadSoloAmigos')"
                                        :data-tooltip="t('soloAmigosTooltip')"
                                    >
                                        <i
                                            class="fa fa-user"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </span>
                                <span
                                    v-else-if="trip.friendship_type_id === 1"
                                    :title="t('visibilidadAmigosDeAmigos')"
                                >
                                    <i
                                        class="fa fa-users"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                <span
                                    v-else-if="trip.friendship_type_id === 2"
                                    :title="t('visibilidadPublico')"
                                >
                                    <span
                                        class="tooltip-bottom"
                                        :title="t('visibilidadAmigosDeAmigos')"
                                        :data-tooltip="t('publicoTooltip')"
                                    >
                                        <i
                                            class="fa fa-globe"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </span>
                            </span>
                        </div>

                        <time
                            class="trip_date_right"
                            :datetime="trip.trip_date"
                            v-if="tripCardTheme === 'light' && trip.trip_date"
                        >
                            <div class="trip_date_date">
                                <span class="trip_date_date_day">
                                    <span style="text-transform: uppercase">
                                        {{ formatDate(trip.trip_date, 'ddd') }}
                                    </span>
                                </span>
                                <br />
                                <span class="trip_date_date_month">
                                    {{ formatDate(trip.trip_date, 'MMM') }}
                                </span>
                            </div>
                        </time>
                        <template v-else-if="tripCardTheme === 'light' && !trip.trip_date">
                            <div class="trip_date_right">
                                <WeeklySchedule
                                    :weeklySchedule="trip.weekly_schedule"
                                    :weeklyScheduleTime="trip.weekly_schedule_time"
                                    readonly
                                    :theme="tripCardTheme"
                                />
                            </div>
                        </template>
                        <template v-if="user">
                            <div
                                class="trip_driver_img_container"
                                v-on:click="goToProfile"
                            >
                                <div
                                    class="trip_driver_img circle-box"
                                    v-imgSrc:profile="getUserImage"
                                ></div>
                            </div>
                            <div class="trip_driver_details">
                                <div
                                    class="trip_driver_name"
                                    v-on:click="goToProfile"
                                >
                                    <UserNameWithBadge :user="trip.user" />
                                </div>
                                <div
                                    class="trip_driver_ratings"
                                    v-if="
                                        config &&
                                        config.trip_stars &&
                                        tripStars &&
                                        tripStars.length > 0
                                    "
                                >
                                    <div
                                        v-if="
                                            trip.user.positive_ratings ||
                                            trip.user.positive_ratings
                                        "
                                    >
                                        <svg-item
                                            v-for="{ value, id } in tripStars"
                                            :key="id"
                                            :size="24"
                                            :icon="'star' + value"
                                        ></svg-item>
                                    </div>
                                    <div v-else>
                                        {{ t('noCalificado') }}
                                    </div>
                                </div>
                                <div class="trip_driver_ratings" v-else>
                                    {{
                                        trip.user.positive_ratings +
                                        trip.user.negative_ratings
                                    }}
                                    {{ t('calificaciones') }}
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="panel-body card_body">
                    <template v-if="tripCardTheme === 'light'">
                        <div class="trip_seats-available_with-icons">
                            <div
                                class="trip_seats-available"
                                v-if="!trip.is_passenger"
                            >
                                <template v-for="n in trip.total_seats">
                                    <span
                                        :class="
                                            n <
                                            trip.total_seats -
                                                trip.seats_available
                                                ? 'seat-taken'
                                                : 'seat-free'
                                        "
                                    >
                                        <svg-item
                                            :icon="'seat'"
                                            :size="18"
                                        ></svg-item>
                                    </span>
                                </template>
                            </div>
                        </div>
                    </template>
                    <div class="trip_location">
                        <template v-if="trip.points.length >= 2">
                            <div class="row trip_location_from">
                                <div
                                    class="col-xs-4"
                                    v-if="tripCardTheme === 'light'"
                                >
                                    <span class="trip_from_time">
                                        {{ formatDate(trip.trip_date, 'HH:mm') }}
                                    </span>
                                </div>
                                <div
                                    class="text-right"
                                    :class="
                                        tripCardTheme === 'light'
                                            ? 'col-xs-2'
                                            : 'col-xs-4'
                                    "
                                >
                                    <i
                                        class="fa fa-map-marker"
                                        aria-hidden="true"
                                        v-if="tripCardTheme !== 'light'"
                                    ></i>
                                    <i
                                        class="fa fa-circle"
                                        aria-hidden="true"
                                        v-else
                                    ></i>
                                </div>
                                <div
                                    :class="
                                        config &&
                                        config.trip_card_design === 'light'
                                            ? 'col-xs-14'
                                            : 'col-xs-18'
                                    "
                                >
                                    <span
                                        class="trip_location_from_city"
                                        :style="
                                            originLongName
                                                ? LONG_NAME_STYLE
                                                : {}
                                        "
                                    >
                                        {{ getLocationName(trip.points[0]) }}
                                    </span>
                                    <span
                                        class="trip_location_from_state-country"
                                    >
                                        {{
                                            googleInfoClean(getStateName(trip.points[0]))
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="row trip_location_to">
                                <div
                                    class="col-xs-4"
                                    v-if="tripCardTheme === 'light'"
                                >
                                    <span class="trip_to_time">
                                        {{ formatDate(tripArrivingTime, 'HH:mm') }}
                                    </span>
                                </div>
                                <div
                                    class="text-right"
                                    :class="
                                        tripCardTheme === 'light'
                                            ? 'col-xs-2'
                                            : 'col-xs-4'
                                    "
                                >
                                    <i
                                        class="fa fa-map-marker"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                                <div
                                    :class="
                                        config &&
                                        config.trip_card_design === 'light'
                                            ? 'col-xs-14'
                                            : 'col-xs-18'
                                    "
                                >
                                    <span
                                        class="trip_location_to_city"
                                        :style="
                                            destinyLongName
                                                ? LONG_NAME_STYLE
                                                : {}
                                        "
                                    >
                                        {{
                                            getLocationName(
                                                trip.points[
                                                    trip.points.length - 1
                                                ]
                                            )
                                        }}
                                    </span>
                                    <span
                                        class="trip_location_to_state-country"
                                    >
                                        {{
                                            googleInfoClean(getStateName(
                                                trip.points[
                                                    trip.points.length - 1
                                                ]
                                            ))
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div
                                class="col-xs-4 trip_location-dot-line trip_location-dot-line-small"
                            >
                                <div></div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="row trip_location_from">
                                <div class="col-xs-4 text-right">
                                    <i
                                        class="fa fa-map-marker"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                                <div class="col-xs-20">
                                    {{
                                        trip.from_town.slice(0, 23) +
                                        '' +
                                        (trip.from_town.length > 34
                                            ? '...'
                                            : '')
                                    }}
                                </div>
                            </div>
                            <div class="row trip_location_to">
                                <div class="col-xs-4 text-right">
                                    <i
                                        class="fa fa-map-marker"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                                <div class="col-xs-20">
                                    {{
                                        trip.to_town.slice(0, 23) +
                                        '' +
                                        (trip.to_town.length > 34 ? '...' : '')
                                    }}
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="row">
                        <time
                            class="trip_datetime col-xs-24"
                            :datetime="trip.trip_date"
                            v-if="tripCardTheme !== 'light' && trip.trip_date"
                        >
                            <div class="row">
                                <div class="col-xs-14 trip_datetime_date">
                                    <span class="trip_datetime_date_day">
                                        <span style="text-transform: uppercase">
                                            {{
                                                formatDate(trip.trip_date, 'ddd')
                                            }}
                                        </span>
                                        {{
                                            formatDate(trip.trip_date, 'DD MMMM')
                                        }}
                                    </span>
                                    <br />
                                    <span class="trip_datetime_date_year">
                                        {{ formatDate(trip.trip_date, 'YYYY') }}
                                    </span>
                                </div>
                                <div class="col-xs-10">
                                    <span class="trip_datetime_time">
                                        {{ formatDate(trip.trip_date, 'HH:mm') }}
                                        {{ t('horas') }}
                                    </span>
                                </div>
                            </div>
                        </time>
                        <div v-else-if="tripCardTheme !== 'light' && !trip.trip_date" class="col-xs-24">
                            <WeeklySchedule
                                :weeklySchedule="trip.weekly_schedule"
                                :weeklyScheduleTime="trip.weekly_schedule_time"
                                readonly
                                :theme="tripCardTheme"
                            />
                        </div>
                    </div>
                    <template v-if="tripCardTheme !== 'light'">
                        <template v-if="!enableChangeSeats">
                            <div v-if="trip.seats_available !== 0" class="row">
                                <div
                                    class="trip_seats-available col-xs-offset-2 col-xs-12"
                                    v-if="!trip.is_passenger"
                                >
                                    <span
                                        class="trip_seats-available_value pull-left"
                                    >
                                        {{ trip.seats_available }}
                                    </span>
                                    <span
                                        class="trip_seats-available_label"
                                        v-if="trip.seats_available > 1"
                                    >
                                        <span>{{ t('Lugares') }}</span>
                                        <span>{{ t('libres') }}</span>
                                    </span>
                                    <span
                                        class="trip_seats-available_label"
                                        v-else
                                    >
                                        <span>{{ t('Lugar') }}</span>
                                        <span>{{ t('libre') }}</span>
                                    </span>
                                </div>
                                <div class="col-xs-offset-2 col-xs-12" v-else>
                                    <div
                                        class="passenger-looking-for-trip"
                                        v-if="
                                            tripCardTheme !== 'light' &&
                                            trip.is_passenger
                                        "
                                    >
                                        <strong class="warning-is-passenger">
                                            {{ t('pasajeroQueBuscaViaje') }}
                                        </strong>
                                    </div>
                                </div>
                                <div class="trip_actions col-xs-10">
                                    <div
                                        class="btn btn-default btn-lg btn-trip-detail"
                                    >
                                        {{ t('Ver') }}
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="trip.seats_available === 0"
                                class="row row--carpooleado"
                            >
                                <div
                                    class="trip_seats-available col-xs-offset-6 col-xs-18 carpooleado"
                                >
                                    <span>{{ t('Carpooleado') }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="row">
                                <div
                                    v-if="!trip.is_passenger"
                                    class="trip-seats-control col-xs-offset-2"
                                >
                                    <button
                                        :aria-label="
                                            t('disminuirCantidadAsientos')
                                        "
                                        v-on:click.stop="changeSeatsNumber(-1)"
                                        :disabled="
                                            sending || trip.total_seats < 1
                                        "
                                        class="btn btn-default"
                                    >
                                        -
                                    </button>
                                    <span class="trip_seats-available_value">
                                        {{ seats_available }}
                                    </span>
                                    <button
                                        :aria-label="
                                            t('aumentarCantidadAsientos')
                                        "
                                        v-on:click.stop="changeSeatsNumber(1)"
                                        :disabled="
                                            sending || seats_available > 3
                                        "
                                        class="btn btn-default"
                                    >
                                        +
                                    </button>
                                    <span
                                        class="trip_seats-available_label"
                                        v-if="seats_available > 1"
                                    >
                                        <span
                                            >{{ t('Lugares') }}
                                            {{ t('libres') }}</span
                                        >
                                    </span>
                                    <span
                                        class="trip_seats-available_label"
                                        v-if="seats_available === 1"
                                    >
                                        <span
                                            >{{ t('Lugar') }}
                                            {{ t('libre') }}</span
                                        >
                                    </span>
                                    <span
                                        class="trip_seats-available_label"
                                        v-if="seats_available === 0"
                                    >
                                        {{ t('Carpooleado') }}
                                    </span>
                                </div>
                                <div class="trip-inline-controls row">
                                    <span class="col-xs-6">
                                        <button
                                            v-on:click.stop="goToDetail(false)"
                                            class="btn btn-default"
                                            :aria-label="t('verDetalleViaje')"
                                        >
                                            <i
                                                class="fa fa-eye"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </span>
                                    <span class="col-xs-6">
                                        <button
                                            v-on:click.stop="
                                                goToDetail(false, true)
                                            "
                                            v-if="!trip.is_passenger"
                                            :disabled="!trip.passenger.length"
                                            class="btn btn-default"
                                            :aria-label="
                                                t('verPasajerosSubidos')
                                            "
                                        >
                                            <i
                                                class="fa fa-users"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </span>
                                    <span class="col-xs-6">
                                        <button
                                            v-on:click.stop="goToDetail(true)"
                                            class="btn btn-default"
                                            :aria-label="t('editarViaje')"
                                        >
                                            <i
                                                class="fa fa-pencil"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </span>
                                    <span class="col-xs-6">
                                        <button
                                            v-on:click.stop="deleteTrip"
                                            class="btn btn-default"
                                            :aria-label="t('eliminarViaje')"
                                        >
                                            <i
                                                class="fa fa-trash-o"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event.js';
import tripDisplay from './TripDisplay';
import WeeklySchedule from '../elements/WeeklySchedule';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import moment from 'moment';
import SvgItem from '../SvgItem';
import { formatDate, googleInfoClean } from '@/composables/useFormatters';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const tripsStore = useTripsStore();

const props = defineProps({
    trip: {
        type: Object,
        required: false,
        default: () => {
            return {};
        }
    },
    user: {
        type: Object,
        required: false,
        default: () => {
            return {};
        }
    },
    enableChangeSeats: {
        type: Boolean,
        required: false,
        default: false
    },
    clickModal: {
        required: false,
        default: false
    }
});

const sending = ref(false);
const seats_available = ref(0);
const CITY_NAME_LONG_LENGTH = 16;
const LONG_NAME_STYLE = {
    'font-size': '17px'
};
const showTrip = ref(false);

const config = computed(() => authStore.appConfig);

const tripCardCountClass = computed(() => {
    if (config.value) {
        if (config.value.max_cards_per_row === 3) {
            return 'col-lg-8 col-md-12 col-sm-12';
        } else {
            return 'col-lg-6 col-md-8 col-sm-12';
        }
    } else {
        return 'col-lg-6 col-md-8 col-sm-12';
    }
});

const tripCardClass = computed(() => {
    return config.value
        ? 'card-trip-theme-' + config.value.trip_card_design
        : '';
});

const tripCardTheme = computed(() => {
    return config.value ? config.value.trip_card_design : '';
});

const originLongName = computed(() => {
    if (props.trip.points) {
        let name = getLocationName(props.trip.points[0]);
        return name.length > CITY_NAME_LONG_LENGTH;
    } else {
        return false;
    }
});

const destinyLongName = computed(() => {
    if (props.trip.points) {
        let name = getLocationName(
            props.trip.points[props.trip.points.length - 1]
        );
        return name.length > CITY_NAME_LONG_LENGTH;
    } else {
        return false;
    }
});

const getUserImage = computed(() => {
    return props.user.id === props.trip.user.id
        ? props.user.image
        : props.trip.user.image;
});

const tripArrivingTime = computed(() => {
    if (props.trip && props.trip.estimated_time) {
        let minutes = 0;
        minutes = parseInt(props.trip.estimated_time.split(':')[0]) * 60;
        minutes += parseInt(props.trip.estimated_time.split(':')[1]);
        return moment(props.trip.trip_date).add(minutes, 'minutes');
    }
    return '';
});

const tripStars = computed(() => {
    if (props.trip && props.trip.user) {
        let value =
            (props.trip.user.positive_ratings /
                (props.trip.user.positive_ratings +
                    props.trip.user.negative_ratings)) *
            5;
        let integerPart = Math.floor(value);
        let decimalPart = value - integerPart;
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i < integerPart) {
                stars.push({
                    id: i,
                    value: ''
                });
            } else {
                if (i === integerPart) {
                    if (decimalPart >= 0.5) {
                        stars.push({
                            id: i,
                            value: ''
                        });
                    } else {
                        stars.push({
                            id: i,
                            value: '-half'
                        });
                    }
                } else {
                    stars.push({
                        id: i,
                        value: '-empty'
                    });
                }
            }
        }
        return stars;
    } else {
        return [];
    }
});

function goToDetail(goToEdit, passengerView) {
    if (goToEdit) {
        router.push({
            name: 'update-trip',
            params: { id: props.trip.id }
        });
    } else {
        if (!passengerView) {
            bus.emit('trip-click');
            router.push({
                name: 'detail_trip',
                params: { id: props.trip.id }
            });
        } else {
            router.push({
                name: 'detail_trip_location',
                params: {
                    id: props.trip.id,
                    location: 'passenger'
                }
            });
        }
    }
}

function goToProfile(event) {
    event.stopPropagation();
    router.push({
        name: 'profile',
        params: {
            id: props.trip.user.id,
            userProfile: props.trip.user,
            activeTab: 1
        }
    });
}

function changeSeatsNumber(increment) {
    sending.value = true;
    let data = {
        id: props.trip.id,
        increment: increment
    };
    tripsStore.changeSeats(data)
        .then((data) => {
            sending.value = false;
            seats_available.value = data.seats_available;
            props.trip.total_seats += increment;
        })
        .catch((response) => {
            sending.value = false;
            let errorMessage = '';
            if (response.status === 422) {
                if (
                    response.data.errors &&
                    response.data.errors.error &&
                    response.data.errors.error.length
                ) {
                    let error = response.data.errors.error[0];
                    switch (error) {
                        case 'trip_seats_greater_than_zero':
                            errorMessage = t('asientosMenorACero');
                            break;
                        case 'trip_seats_less_than_four':
                            errorMessage = t('masDeCuatroAsientos');
                            break;
                        case 'trip_invalid_seats':
                            errorMessage = t('noPuedesDisminuirAsientos');
                            break;
                        default:
                            errorMessage = t('errorACambiarAsientos');
                    }
                } else {
                    errorMessage = t('errorACambiarAsientos');
                }
            } else {
                errorMessage = t('errorACambiarAsientos');
            }
            dialogs.message(errorMessage, { estado: 'error' });
        });
}

function deleteTrip() {
    if (window.confirm(t('seguroCancelar'))) {
        tripsStore.remove(props.trip.id)
            .then(() => {
                dialogs.message(t('viajeCancelado'), {
                    estado: 'success'
                });
            })
            .catch((error) => {
                console.error(error);
                dialogs.message(t('errorAlCancelar'), {
                    estado: 'error'
                });
            });
    }
}

function openModal() {
    showTrip.value = true;
}

function closeModal() {
    showTrip.value = false;
}

function getLocationName(location) {
    if (location.json_address) {
        if (location.json_address.ciudad) {
            return location.json_address.ciudad;
        }
        if (location.json_address.name) {
            return location.json_address.name;
        }
    }
    return location.address;
}

function getStateName(location) {
    if (location.json_address) {
        if (location.json_address.provincia) {
            return location.json_address.provincia;
        }
        if (location.json_address.state) {
            return location.json_address.state;
        }
    }
    return '';
}

onMounted(() => {
    if (props.trip) {
        seats_available.value = props.trip.seats_available;
    }
});
</script>
<style scoped>
.trip-seats-control .trip_seats-available_value {
    margin-right: 0.15em;
    margin-left: 0.15em;
}
.trip-seats-control .trip_seats-available_label {
    position: static;
    top: 0;
    margin-left: 0.5em;
}
.trip-fill .trip-seats-control .trip_seats-available_label {
    color: var(--trip-half-free-color);
}
.trip-seats-control .btn {
    background: #eee;
    min-width: 2.5em;
}
.trip-seats-control .btn[disabled] {
    opacity: 0.25;
}
.trip-seats-control .btn[disabled]:hover {
    background: #eee;
}
.trip-seats-control > * {
    vertical-align: middle;
}
.trip-with-control .card-trip {
    height: 470px;
}
.trip-inline-controls .btn {
    width: 100%;
}
.trip-inline-controls {
    margin-top: 1em;
}
.trip-inline-controls .btn[disabled] {
    opacity: 0.2;
}
.trip-inline-controls .btn[disabled]:hover {
    background: #eee;
}
@media (min-width: 1200px) {
    .trip-with-control .card-trip {
        height: 500px;
    }
}
</style>
