<template>
    <div class="trip-driver">
        <div class="trip-driver__mobile" v-if="trip && trip.user">
            <div class="trip-driver__mobile-top">
                <router-link
                    class="trip-driver-profile-link trip_driver_img_container"
                    :to="driverProfileRoute"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="getUserImage"
                    ></div>
                </router-link>
                <div class="trip-driver__mobile-info">
                    <div class="trip-driver__mobile-name-row">
                        <div class="trip-driver__mobile-name-cluster">
                            <router-link
                                class="trip-driver-profile-link trip-driver__mobile-name"
                                :to="driverProfileRoute"
                            >
                                {{ trip.user.name }}
                            </router-link>
                            <span
                                v-if="isDriverVerified"
                                class="trip-driver__verified"
                                :title="$t('usuarioVerificado')"
                                :aria-label="$t('usuarioVerificado')"
                            >
                                <i class="fa fa-check-circle" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div
                            v-if="!trip.is_passenger && isMobile"
                            class="trip-driver__seats"
                            :class="'trip-driver__seats--' + seatsTone"
                        >
                            <i class="fa fa-user" aria-hidden="true"></i>
                            {{ seatsLabel }}
                        </div>
                    </div>
                    <div class="trip-driver__mobile-meta">
                        <UserRatingsCounts :ratings="driverRatings" />
                        <span
                            v-if="driverTripsLabel"
                            class="trip-driver__mobile-trips"
                        >
                            &middot; {{ driverTripsLabel }}
                        </span>
                    </div>
                    <div
                        v-if="membershipLabel || showResponseStats"
                        class="trip-driver__mobile-secondary"
                    >
                        <p
                            v-if="membershipLabel || responsePercentLabel"
                            class="trip-driver__mobile-line"
                        >
                            <template v-if="membershipLabel">{{
                                membershipLabel
                            }}</template>
                            <template
                                v-if="membershipLabel && responsePercentLabel"
                            >
                                &nbsp;&middot;&nbsp;
                            </template>
                            <template v-if="responsePercentLabel">{{
                                responsePercentLabel
                            }}</template>
                        </p>
                        <p
                            v-if="responseDelayLabel"
                            class="trip-driver__mobile-line"
                        >
                            {{ responseDelayLabel }}
                        </p>
                    </div>
                </div>
                <TripCarDetails
                    v-if="showDriverCarDetails"
                    class="trip-driver__car"
                    :car="trip.car"
                />
            </div>
        </div>
        <div
            class="panel-heading card_heading"
            v-else-if="tripCardTheme === 'light'"
        >
            <div class="panel-title card-trip_title row">
                <span class="trip-data--subtitle" v-if="!isMobile"
                    >{{ $t('conductor') }}</span
                >
                <TripDate v-if="isMobile" />
                <template v-if="trip && trip.user">
                    <router-link
                        class="trip-driver-profile-link trip_driver_img_container"
                        :to="driverProfileRoute"
                    >
                        <div
                            class="trip_driver_img circle-box"
                            v-imgSrc:profile="getUserImage"
                        ></div>
                    </router-link>
                    <div class="trip_driver_details">
                        <router-link
                            class="trip-driver-profile-link trip_driver_name"
                            :to="driverProfileRoute"
                        >
                            {{ trip.user.name }}
                        </router-link>
                        <div
                            class="trip_driver_ratings"
                            v-if="
                                config
                                    ? config.trip_stars
                                    : false && tripStars && tripStars.length > 0
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
                                {{ $t('noCalificado') }}
                            </div>
                        </div>
                        <div class="trip_driver_ratings" v-else>
                            {{ sumUserRatings(trip.user) }}
                            {{ $t('calificaciones') }}
                        </div>
                    </div>
                </template>
            </div>
            <div
                class="alert alert-info clearfix cf"
                v-if="config.module_conversation_average_delay"
            >
                <strong>{{ $t('velocidadDeRespuesta') }}</strong>
                {{ averageDelay }}.
                <br />
                <strong>{{ $t('porcentajeDeRespuestas') }}</strong>
                {{ percentageResponse }}
            </div>
        </div>
        <div class="driver-profile" v-else>
            <div class="row">
                <div class="col-xs-9 col-md-8 col-lg-8">
                    <router-link
                        class="trip-driver-profile-link"
                        :to="driverProfileRoute"
                    >
                        <div
                            class="trip_driver_img circle-box"
                            v-imgSrc:profile="getUserImage"
                        ></div>
                    </router-link>
                </div>
                <div class="col-xs-15 driver-data">
                    <router-link
                        class="trip-driver-profile-link"
                        :to="driverProfileRoute"
                    >
                        {{ trip.user.name }}
                    </router-link>
                    <div
                        class="trip_driver_ratings"
                        v-if="
                            config
                                ? config.trip_stars
                                : false && tripStars && tripStars.length > 0
                        "
                    >
                        <div
                            v-if="
                                this.trip.user.positive_ratings ||
                                this.trip.user.positive_ratings
                            "
                        >
                            <svg-item
                                v-for="{ value, id } in tripStars"
                                :key="id"
                                :size="$cssvar('--calification-star-size')"
                                :icon="'star' + value"
                            ></svg-item>
                        </div>
                        <div v-else>
                            {{ $t('noCalificado') }}
                        </div>
                    </div>
                    <div class="profile-info--ratings" v-else>
                        <UserRatingsCounts
                            :ratings="driverRatings"
                            variant="inverse"
                        />
                    </div>
                    <div class="user_pin">
                        <span v-if="trip.user.has_pin == 1">
                            <img
                                :src="$publicImg('pin.png')"
                                alt=""
                                :title="$t('aportanteMediaNaranja')"
                            />
                        </span>
                        <span v-if="trip.user.is_member == 1">
                            <img
                                :src="$publicImg('pin_member.png')"
                                alt=""
                                :title="$t('miembroEquipo')"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div
                class="alert alert-info clearfix cf"
                v-if="config.module_conversation_average_delay"
            >
                <strong>{{ $t('velocidadDeRespuesta') }}</strong>
                {{ averageDelay }}.
                <br />
                <strong>{{ $t('porcentajeDeRespuestas') }}</strong>
                {{ percentageResponse }}
            </div>
            <div class="row">
                <div class="col-md-24">
                    <router-link
                        class="btn-primary btn-search btn-shadowed-black"
                        :to="driverProfileRoute"
                    >
                        {{ $t('verPerfil') }}
                    </router-link>
                </div>
            </div>
            <TripDescription />
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';
import { useDeviceStore } from '../../stores/device';
import TripDate from './TripDate';
import TripDescription from './TripDescription';
import TripCarDetails from './TripCarDetails.vue';
import SvgItem from '../SvgItem';
import UserRatingsCounts from './UserRatingsCounts.vue';
import { sumUserRatings, userRatingsFromProfile } from '../../utils/tripRating';
import {
    getMembershipDuration,
    normalizeTripsCount
} from '../../utils/profileMemberStats.js';
import {
    getSeatsPillLabel,
    getSeatsPillTone
} from '../../utils/tripCardDisplay.js';

export default {
    name: 'TripDriver',
    methods: {
        sumUserRatings
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            tripCardTheme: 'tripCardTheme',
            config: 'appConfig'
        }),
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        getUserProfile() {
            return this.trip.user.id === this.user.id
                ? 'me'
                : this.trip.user.id;
        },
        driverProfileRoute() {
            return {
                name: 'profile',
                params: {
                    id: this.getUserProfile,
                    userProfile: this.trip.user
                }
            };
        },
        getUserImage() {
            return this.user.id === this.trip.user.id
                ? this.user.image
                : this.trip.user.image;
        },
        driverRatings() {
            if (!this.trip?.user) {
                return null;
            }

            return userRatingsFromProfile(this.trip.user);
        },
        isDriverVerified() {
            const driver = this.trip?.user;
            return !!(
                driver &&
                (driver.identity_validated || driver.identity_validated_at)
            );
        },
        driverTripsLabel() {
            if (!this.trip?.user || this.trip.user.trips_count == null) {
                return '';
            }
            return this.$t('perfilViajesParticipados', {
                count: normalizeTripsCount(this.trip.user.trips_count)
            });
        },
        seatsTone() {
            return getSeatsPillTone(this.trip?.seats_available);
        },
        seatsLabel() {
            return getSeatsPillLabel(this.trip?.seats_available, this.$t);
        },
        membershipLabel() {
            const duration = getMembershipDuration(this.trip?.user?.created_at);
            if (!duration) {
                return '';
            }
            if (duration.unit === 'years') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnAnio')
                    : this.$t('miembroHaceAnios', { count: duration.count });
            }
            if (duration.unit === 'months') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnMes')
                    : this.$t('miembroHaceMeses', { count: duration.count });
            }
            return duration.count === 1
                ? this.$t('miembroHaceUnDia')
                : this.$t('miembroHaceDias', { count: duration.count });
        },
        showResponseStats() {
            return Boolean(
                this.config?.module_conversation_average_delay && this.trip?.user
            );
        },
        responsePercentValue() {
            if (
                !this.trip?.user?.conversation_opened_count ||
                this.trip.user.conversation_opened_count <= 0
            ) {
                return null;
            }
            const percentage =
                this.trip.user.conversation_answered_count /
                this.trip.user.conversation_opened_count;
            return Math.round(percentage * 100);
        },
        responsePercentLabel() {
            if (!this.showResponseStats || this.responsePercentValue == null) {
                return '';
            }
            return this.$t('respondeMensajesPorcentaje', {
                percent: this.responsePercentValue
            });
        },
        responseDelayLabel() {
            if (!this.showResponseStats) {
                return '';
            }
            return this.$t('tiempoPromedioRespuesta', {
                delay: this.averageDelay
            });
        },
        showDriverCarDetails() {
            if (
                !this.trip ||
                this.trip.is_passenger ||
                !this.trip.car ||
                !this.trip.car.patente ||
                !this.user
            ) {
                return false;
            }
            if (this.user.is_admin) {
                return true;
            }
            // Viewer is a passenger (not the trip driver)
            return this.user.id !== this.trip.user.id;
        },
        tripStars() {
            if (this.trip && this.trip.user) {
                const total = sumUserRatings(this.trip.user);
                let value = total ? (this.trip.user.positive_ratings / total) * 5 : 0;
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
        },
        averageDelay() {
            var delay = '';
            if (this.trip && this.trip.user) {
                if (this.trip.user.conversation_answered_count) {
                    var time =
                        this.trip.user.answer_delay_sum /
                        this.trip.user.conversation_answered_count;
                    // var hours = Math.floor(time / 60 / 60);
                    // var minutes = Math.floor(time / 60) % 60;
                    // var seconds = Math.floor(time - minutes * 60 - hours * 3600);
                    // delay = hours + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
                    if (time / 3600 > 24) {
                        delay = this.$t('masDeUnDia');
                    } else if (time / 3600 > 12) {
                        delay = this.$t('enElDia');
                    } else if (time / 3600 > 1) {
                        delay = this.$t('enUnParDeHoras');
                    } else {
                        delay = this.$t('enElMomento');
                    }
                } else {
                    delay = this.$t('sinDatos');
                }
            }
            return delay;
        },
        percentageResponse() {
            var response = '';
            if (this.trip && this.trip.user) {
                if (this.trip.user.conversation_opened_count) {
                    var percentage =
                        this.trip.user.conversation_answered_count /
                        this.trip.user.conversation_opened_count;
                    response = Math.round(percentage * 100).toFixed(0) + '%';
                } else {
                    response = this.$t('noHaConversado');
                }
            }
            return response;
        }
    },
    components: {
        SvgItem,
        UserRatingsCounts,
        TripCarDetails,
        TripDate,
        TripDescription
    },

    secondsToHms(d) {
        var time = Number(d);
        var hours = Math.floor(time / 60 / 60);
        var minutes = Math.floor(time / 60) % 60;
        var seconds = Math.floor(time - minutes * 60);
        return (
            hours +
            ':' +
            minutes.toString().padStart(2, '0') +
            ':' +
            seconds.toString().padStart(2, '0')
        );
    }
};
</script>
<style scoped>
.trip-driver__mobile {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}
.trip-driver__mobile-top {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}
.trip-driver__car {
    flex: 0 0 auto;
    margin-left: auto;
    text-align: left;
    color: var(--ds-text-primary, #333);
}
.trip-driver__car :deep(.trip-car-details) {
    margin: 0;
}
.trip-driver__car :deep(.trip-car-details__title) {
    font-size: 1rem;
    margin-bottom: 0.25rem;
}
.trip-driver__car :deep(.trip-car-details__line) {
    margin: 0 0 0.1em;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: var(--ds-text-primary, #333);
}
.trip-driver__mobile .trip_driver_img_container {
    display: block;
    flex: 0 0 auto;
    float: none;
    width: auto;
    height: auto;
    margin: 0;
}
.trip-driver__mobile .trip_driver_img {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    margin: 0;
}
.trip-driver__mobile-info {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: stretch;
    gap: 0.2rem;
    min-width: 0;
    text-align: left;
}
.trip-driver__mobile-name-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;
}
.trip-driver__mobile-name-cluster {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 100%;
    line-height: 1.25;
}
.trip-driver__mobile-name {
    display: inline;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.25;
    text-align: left;
    overflow-wrap: anywhere;
    margin-right: 0.35rem;
}
.trip-driver__verified {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    color: #2e7d32;
    font-size: 1rem;
    line-height: 1;
}
.trip-driver__seats {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    flex: 0 0 auto;
    margin-top: 0.05rem;
    margin-left: 0;
    padding: 0.3rem 0.55rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
}
.trip-driver__seats--high {
    background: var(--ds-success-bg);
    color: var(--ds-success-text);
}
.trip-driver__seats--medium {
    background: var(--ds-warning-bg);
    color: var(--ds-warning-solid);
}
.trip-driver__seats--low {
    background: var(--ds-error-bg);
    color: var(--ds-error-solid);
}
.trip-driver__seats--full {
    background: var(--ds-input-disabled-bg);
    color: var(--ds-text-muted);
}
.trip-driver__mobile-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    color: var(--ds-text-secondary, #666);
    font-size: 0.85rem;
}
.trip-driver__mobile-secondary {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 100%;
}
.trip-driver__mobile-line {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--ds-text-secondary, #666);
    text-align: left;
}
.trip-driver__mobile-line strong {
    color: var(--ds-text-primary, #333);
    font-weight: 700;
}
.trip-driver-profile-link {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
}
.trip-driver-profile-link.trip_driver_img_container {
    display: inline-block;
}
.trip-driver-profile-link.trip_driver_name:hover,
.trip-driver-profile-link.trip_driver_name:focus {
    text-decoration: underline;
}
.user_pin {
    margin-top: 1em;
}
.user_pin img {
    width: 40px;
}
.driver-profile div.row:last-child {
    height: auto;
}
.driver-data > .trip-driver-profile-link:first-child {
    display: block;
    margin-top: 0.4em;
}
.trip-data--subtitle {
    font-size: 0.8em;
    font-weight: bold;
    display: block;
    color: black;
}
@media only screen and (min-width: 400px) and (max-width: 767px) {
    .trip_driver_img {
        width: 6.7rem;
        height: 6.7rem;
    }
}
@media only screen and (min-width: 768px) {
    .driver-profile div.row:last-child {
        min-height: 11rem;
    }
    .driver-data > .trip-driver-profile-link:first-child {
        margin-top: 16px;
    }
}
</style>
