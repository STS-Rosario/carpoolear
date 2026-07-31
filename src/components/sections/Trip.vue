<template>
    <div
        :class="[tripCardCountClass, { 'trip-needs-sellado': showSelladoPending }]"
    >
        <tripDisplay
            v-if="showTrip && clickModal"
            :trip="trip"
            :clickOutside="closeModal.bind(this)"
            @click.stop
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
            <TripCardShell
                :user="shellUser"
                :ratings="driverRatings"
                :trips-count-label="driverTripsLabel"
                :seats-available="seats_available"
                :show-seats-pill="!trip.is_passenger"
                :from-city="locationLabels.fromCity"
                :from-region="locationLabels.fromRegion"
                :from-point="locationLabels.fromPoint"
                :to-city="locationLabels.toCity"
                :to-region="locationLabels.toRegion"
                :to-point="locationLabels.toPoint"
                :date-label="cardDateLabel"
                :time-label="cardTimeLabel"
                @profile-click="goToProfile"
                @detail-click="onShellDetailClick"
            >
                <template #body-extra>
                    <div
                        v-if="showWeeklyScheduleOnly"
                        class="trip-card-weekly-schedule"
                    >
                        <WeeklySchedule
                            :weeklySchedule="trip.weekly_schedule"
                            :weeklyScheduleTime="trip.weekly_schedule_time"
                            readonly
                        />
                    </div>

                    <div v-if="showSelladoPending" class="trip-legend-sellado">
                        {{ $t('faltaPagarSellado') }}
                    </div>

                    <div
                        class="alert alert-warning trip-seat-request-limit-warning"
                        role="alert"
                        v-if="showSeatRequestLimitWarning"
                        @click.stop
                    >
                        {{ $t('tripSeatRequestLimitDriverWarning') }}
                    </div>

                    <div
                        v-if="!enableChangeSeats && trip.is_passenger"
                        class="passenger-looking-for-trip"
                    >
                        <strong class="warning-is-passenger">
                            {{ $t('pasajeroQueBuscaViaje') }}
                        </strong>
                    </div>
                </template>

                <template v-if="enableChangeSeats" #footer-extra>
                    <div class="row">
                        <div
                            v-if="!trip.is_passenger"
                            class="trip-seats-control col-xs-offset-2"
                        >
                            <button
                                :aria-label="$t('disminuirCantidadAsientos')"
                                v-on:click.stop="changeSeatsNumber(-1)"
                                :disabled="sending || trip.total_seats < 1"
                                class="btn btn-default"
                            >
                                -
                            </button>
                            <span class="trip_seats-available_value">
                                {{ seats_available }}
                            </span>
                            <button
                                :aria-label="$t('aumentarCantidadAsientos')"
                                v-on:click.stop="changeSeatsNumber(1)"
                                :disabled="sending || seats_available > 3"
                                class="btn btn-default"
                            >
                                +
                            </button>
                            <span
                                class="trip_seats-available_label"
                                v-if="seats_available > 1"
                            >
                                <span
                                    >{{ $t('Lugares') }}
                                    {{ $t('libres') }}</span
                                >
                            </span>
                            <span
                                class="trip_seats-available_label"
                                v-if="seats_available === 1"
                            >
                                <span
                                    >{{ $t('Lugar') }}
                                    {{ $t('libre') }}</span
                                >
                            </span>
                            <span
                                class="trip_seats-available_label"
                                v-if="seats_available === 0"
                            >
                                {{ $t('Carpooleado') }}
                            </span>
                        </div>
                        <div class="trip-inline-controls row">
                            <span class="col-xs-8">
                                <button
                                    v-on:click.stop="goToDetail(false)"
                                    class="btn btn-default"
                                    :aria-label="$t('verDetalleViaje')"
                                >
                                    <i
                                        class="fa fa-eye"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </span>
                            <span class="col-xs-8">
                                <button
                                    v-on:click.stop="goToDetail(true)"
                                    class="btn btn-default"
                                    :aria-label="$t('editarViaje')"
                                >
                                    <i
                                        class="fa fa-pencil"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </span>
                            <span class="col-xs-8">
                                <button
                                    v-on:click.stop="deleteTrip"
                                    class="btn btn-default"
                                    :aria-label="$t('eliminarViaje')"
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
            </TripCardShell>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event.js';
import tripDisplay from './TripDisplay';
import WeeklySchedule from '../elements/WeeklySchedule';
import TripCardShell from '../elements/TripCardShell.vue';
import dayjs from '../../dayjs';
import { userRatingsFromProfile } from '../../utils/tripRating';
import { shouldShowSelladoPending } from '../../utils/tripSelladoDisplay';
import { shouldShowDriverSeatRequestLimitWarning } from '../../utils/tripSeatRequestsWarning.js';
import { getTripLocationLabels } from '../../utils/ongoingTrip.js';
import { formatTripCardDate, formatTripCardTime } from '../../utils/tripCardDisplay.js';
import { normalizeTripsCount } from '../../utils/profileMemberStats.js';

export default {
    name: 'trip',
    props: {
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
            type: Boolean,
            required: false,
            default: false
        },
        embeddedInSeatRequest: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    methods: {
        ...mapActions(useTripsStore, {
            changeSeats: 'changeSeats',
            remove: 'remove'
        }),
        goToDetail: function (goToEdit) {
            if (goToEdit) {
                this.$router.push({
                    name: 'update-trip',
                    params: { id: this.trip.id }
                });
            } else {
                bus.emit('trip-click');
                this.$router.push({
                    name: 'detail_trip',
                    params: { id: this.trip.id }
                });
            }
        },
        goToProfile: function (event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (!this.trip.user) {
                return;
            }
            this.$router.push({
                name: 'profile',
                params: {
                    id: this.trip.user.id,
                    userProfile: this.trip.user,
                    activeTab: 1
                }
            });
        },
        onShellDetailClick: function (event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (this.clickModal) {
                this.openModal();
            } else {
                this.goToDetail(false);
            }
        },
        changeSeatsNumber: function (increment) {
            this.sending = true;
            let data = {
                id: this.trip.id,
                increment: increment
            };
            this.changeSeats(data)
                .then((data) => {
                    this.sending = false;
                    this.seats_available = data.seats_available;
                    this.trip.total_seats += increment;
                    this.$forceUpdate();
                })
                .catch((response) => {
                    this.sending = false;
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
                                    errorMessage =
                                        this.$t('asientosMenorACero');
                                    break;
                                case 'trip_seats_less_than_four':
                                    errorMessage = this.$t(
                                        'masDeCuatroAsientos'
                                    );
                                    break;
                                case 'trip_invalid_seats':
                                    errorMessage = this.$t(
                                        'noPuedesDisminuirAsientos'
                                    );
                                    break;
                                default:
                                    errorMessage = this.$t(
                                        'errorACambiarAsientos'
                                    );
                            }
                        } else {
                            errorMessage = this.$t('errorACambiarAsientos');
                        }
                    } else {
                        errorMessage = this.$t('errorACambiarAsientos');
                    }
                    dialogs.message(errorMessage, { estado: 'error' });
                });
        },
        deleteTrip: function () {
            if (window.confirm(this.$t('seguroCancelar'))) {
                this.remove(this.trip.id)
                    .then(() => {
                        dialogs.message(this.$t('viajeCancelado'), {
                            estado: 'success'
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        dialogs.message(this.$t('errorAlCancelar'), {
                            estado: 'error'
                        });
                    });
            }
        },
        openModal() {
            this.showTrip = true;
        },
        closeModal() {
            this.showTrip = false;
        }
    },
    data() {
        return {
            sending: false,
            seats_available: 0,
            showTrip: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        tripCardCountClass() {
            if (this.embeddedInSeatRequest) {
                return '';
            }
            if (this.config) {
                if (this.config.max_cards_per_row === 3) {
                    return 'col-lg-8 col-md-12 col-sm-12';
                } else {
                    return 'col-lg-6 col-md-8 col-sm-12';
                }
            } else {
                return 'col-lg-6 col-md-8 col-sm-12';
            }
        },
        showSelladoPending() {
            return shouldShowSelladoPending(this.trip, this.user);
        },
        isTripOwner() {
            return Boolean(
                this.user &&
                    this.trip &&
                    this.trip.user &&
                    this.user.id === this.trip.user.id
            );
        },
        showSeatRequestLimitWarning() {
            return shouldShowDriverSeatRequestLimitWarning(this.isTripOwner, {
                seat_request_limit_reached:
                    this.trip?.seat_request_limit_reached,
            });
        },
        getUserImage() {
            if (!this.trip || !this.trip.user) {
                return '';
            }
            if (!this.user || this.user.id == null) {
                return this.trip.user.image || '';
            }
            return this.user.id === this.trip.user.id
                ? this.user.image
                : this.trip.user.image;
        },
        shellUser() {
            if (!this.trip || !this.trip.user) {
                return null;
            }
            return { ...this.trip.user, image: this.getUserImage };
        },
        driverRatings() {
            if (!this.trip || !this.trip.user) {
                return null;
            }
            return userRatingsFromProfile(this.trip.user);
        },
        driverTripsLabel() {
            if (
                !this.trip ||
                !this.trip.user ||
                this.trip.user.trips_count == null
            ) {
                return '';
            }
            return this.$t('perfilViajesParticipados', {
                count: normalizeTripsCount(this.trip.user.trips_count)
            });
        },
        locationLabels() {
            return getTripLocationLabels(this.trip);
        },
        cardDateLabel() {
            if (!this.trip) {
                return '';
            }
            return formatTripCardDate(this.trip.trip_date, dayjs);
        },
        cardTimeLabel() {
            if (!this.trip) {
                return '';
            }
            return formatTripCardTime(this.trip.trip_date, dayjs);
        },
        showWeeklyScheduleOnly() {
            return Boolean(
                this.trip && this.trip.weekly_schedule && !this.trip.trip_date
            );
        }
    },
    components: {
        tripDisplay,
        WeeklySchedule,
        TripCardShell
    },
    mounted() {
        this.seats_available = this.trip.seats_available;
    }
};
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

.trip-needs-sellado {
    opacity: 0.6;
}
.trip-legend-sellado {
    display: block;
    width: fit-content;
    margin: 0 auto 0.5em;
    text-align: center;
    background: #c76b1a;
    color: #fff;
    padding: 0.35em 0.75em;
    border-radius: 0.5em;
    font-size: 0.9em;
}
</style>
