<template>
    <div class="ongoing-trip" v-if="trip">
        <h2 class="ongoing-trip__heading">{{ $t('viajeEnProgreso') }}</h2>
        <div class="ongoing-trip-card">
            <div class="ongoing-trip-card__route">
                <div class="ongoing-trip-card__endpoint ongoing-trip-card__endpoint--from">
                    <div class="ongoing-trip-card__city">{{ locations.fromCity }}</div>
                    <div class="ongoing-trip-card__region">{{ locations.fromRegion }}</div>
                </div>
                <div class="ongoing-trip-card__endpoint ongoing-trip-card__endpoint--to">
                    <div class="ongoing-trip-card__city">{{ locations.toCity }}</div>
                    <div class="ongoing-trip-card__region">{{ locations.toRegion }}</div>
                </div>
            </div>

            <div class="ongoing-trip-card__middle">
                <div class="ongoing-trip-card__driver" v-if="trip.user">
                    <div
                        class="ongoing-trip-card__avatar circle-box"
                        v-imgSrc:profile="trip.user.image"
                    ></div>
                    <div class="ongoing-trip-card__driver-info">
                        <div class="ongoing-trip-card__driver-name">
                            <UserNameWithBadge :user="trip.user" />
                        </div>
                        <div class="ongoing-trip-card__driver-meta">
                            <UserRatingsCounts :ratings="driverRatings" />
                            <span
                                v-if="driverTripsLabel"
                                class="ongoing-trip-card__trips-count"
                            >
                                {{ driverTripsLabel }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="ongoing-trip-card__schedule">
                    <div class="ongoing-trip-card__date">{{ tripDateLabel }}</div>
                    <div class="ongoing-trip-card__time">{{ tripTimeLabel }}</div>
                </div>
            </div>

            <div class="ongoing-trip-card__actions">
                <router-link
                    v-if="showShareLocationLink"
                    :to="{
                        name: 'trip_live_share',
                        params: { id: trip.id }
                    }"
                    class="ongoing-trip-card__share"
                >
                    <i class="fa fa-wifi ongoing-trip-card__share-icon" aria-hidden="true"></i>
                    <span>{{ $t('compartirUbicacionTiempoReal') }}</span>
                </router-link>
                <router-link
                    :to="{ name: 'detail_trip', params: { id: trip.id } }"
                    class="ongoing-trip-card__detail"
                >
                    <span>{{ $t('verDetalle') }}</span>
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from '../../dayjs';
import {
    getTripLocationLabels,
    shouldShowLiveLocationShare
} from '../../utils/ongoingTrip.js';
import { normalizeTripsCount } from '../../utils/profileMemberStats.js';
import { useAuthStore } from '../../stores/auth.js';
import UserNameWithBadge from './UserNameWithBadge.vue';
import UserRatingsCounts from './UserRatingsCounts.vue';

export default {
    name: 'OngoingTripCard',
    props: {
        trip: {
            type: Object,
            default: null
        }
    },
    computed: {
        locations() {
            return getTripLocationLabels(this.trip);
        },
        driverRatings() {
            if (!this.trip || !this.trip.user) {
                return null;
            }
            return {
                positive: Number(this.trip.user.positive_ratings) || 0,
                negative: Number(this.trip.user.negative_ratings) || 0
            };
        },
        driverTripsLabel() {
            if (!this.trip || !this.trip.user || this.trip.user.trips_count == null) {
                return '';
            }
            return this.$t('perfilViajesParticipados', {
                count: normalizeTripsCount(this.trip.user.trips_count)
            });
        },
        tripDateLabel() {
            if (!this.trip || !this.trip.trip_date) {
                return '';
            }
            const formatted = dayjs(this.trip.trip_date).format('dddd D [de] MMMM');
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
        },
        tripTimeLabel() {
            if (!this.trip || !this.trip.trip_date) {
                return '';
            }
            return dayjs(this.trip.trip_date).format('HH:mm');
        },
        showShareLocationLink() {
            const authStore = useAuthStore();
            const user = authStore.user;
            if (!user) {
                return false;
            }
            return shouldShowLiveLocationShare(this.trip, user.id, dayjs());
        }
    },
    components: {
        UserNameWithBadge,
        UserRatingsCounts
    }
};
</script>

<style scoped>
.ongoing-trip {
    margin: 0 auto 1.25rem;
    max-width: 500px;
}

.ongoing-trip__heading {
    margin: 0 0 0.65rem;
    font-size: 1.05rem;
    font-weight: 700;
}

.ongoing-trip-card {
    border: 2px solid #e53935;
    border-radius: 10px;
    background: #fff8f8;
    padding: 1rem 1.1rem;
}

.ongoing-trip-card__route,
.ongoing-trip-card__middle,
.ongoing-trip-card__actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.ongoing-trip-card__route {
    margin-bottom: 0.9rem;
}

.ongoing-trip-card__endpoint--to {
    text-align: right;
}

.ongoing-trip-card__city {
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.2;
}

.ongoing-trip-card__region {
    font-size: 0.95rem;
    color: #555;
}

.ongoing-trip-card__middle {
    align-items: center;
    margin-bottom: 0.9rem;
}

.ongoing-trip-card__driver {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
}

.ongoing-trip-card__avatar {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
}

.ongoing-trip-card__driver-name {
    font-weight: 700;
    line-height: 1.2;
}

.ongoing-trip-card__driver-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.2rem;
    font-size: 0.9rem;
}

.ongoing-trip-card__schedule {
    text-align: right;
    flex-shrink: 0;
}

.ongoing-trip-card__date,
.ongoing-trip-card__time {
    line-height: 1.3;
}

.ongoing-trip-card__actions {
    align-items: center;
    font-weight: 700;
}

.ongoing-trip-card__share,
.ongoing-trip-card__detail {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: inherit;
    text-decoration: none;
}

.ongoing-trip-card__share-icon {
    transform: rotate(90deg);
}

.ongoing-trip-card__detail i {
    font-size: 1.1rem;
}

@media only screen and (max-width: 768px) {
    .ongoing-trip-card__middle {
        flex-direction: column;
        align-items: flex-start;
    }

    .ongoing-trip-card__schedule {
        text-align: left;
    }

    .ongoing-trip-card__actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>
