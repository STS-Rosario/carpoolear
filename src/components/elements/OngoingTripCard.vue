<template>
    <div class="ongoing-trip" v-if="trip">
        <h2 class="ongoing-trip__heading">{{ $t('viajeEnProgreso') }}</h2>
        <TripCardShell
            :user="trip.user"
            :ratings="driverRatings"
            :trips-count-label="driverTripsLabel"
            :seats-available="trip.seats_available"
            :from-city="locations.fromCity"
            :from-point="locations.fromPoint"
            :to-city="locations.toCity"
            :to-point="locations.toPoint"
            :date-label="dateLabel"
            :time-label="timeLabel"
            @profile-click="onProfileClick"
            @detail-click="onDetailClick"
        >
            <template #actions-extra>
                <router-link
                    v-if="showShareLocationLink"
                    :to="{
                        name: 'trip_live_share',
                        params: { id: trip.id }
                    }"
                    :class="[
                        'ongoing-trip__share',
                        { 'ongoing-trip__share--active': isSharingLiveLocation }
                    ]"
                    @click.stop
                >
                    <i class="fa fa-wifi ongoing-trip__share-icon" aria-hidden="true"></i>
                    <span>{{
                        isSharingLiveLocation
                            ? $t('compartiendoUbicacionTiempoReal')
                            : $t('compartirUbicacionTiempoReal')
                    }}</span>
                </router-link>
            </template>
        </TripCardShell>
    </div>
</template>

<script>
import dayjs from '../../dayjs';
import {
    getTripLocationLabels,
    shouldShowLiveLocationShare
} from '../../utils/ongoingTrip.js';
import { normalizeTripsCount } from '../../utils/profileMemberStats.js';
import { formatTripCardDate, formatTripCardTime } from '../../utils/tripCardDisplay.js';
import { useAuthStore } from '../../stores/auth.js';
import TripLiveShareApi from '../../services/api/TripLiveShare.js';
import TripCardShell from './TripCardShell.vue';

const tripLiveShareApi = new TripLiveShareApi();

export default {
    name: 'OngoingTripCard',
    props: {
        trip: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            isSharingLiveLocation: false
        };
    },
    watch: {
        'trip.id': {
            immediate: true,
            handler() {
                this.loadLiveShareStatus();
            }
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
                neutral: Number(this.trip.user.neutral_ratings) || 0,
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
        dateLabel() {
            if (!this.trip) {
                return '';
            }
            return formatTripCardDate(this.trip.trip_date, dayjs);
        },
        timeLabel() {
            if (!this.trip) {
                return '';
            }
            return formatTripCardTime(this.trip.trip_date, dayjs);
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
    methods: {
        async loadLiveShareStatus() {
            if (!this.trip || !this.trip.id) {
                this.isSharingLiveLocation = false;
                return;
            }
            try {
                const response = await tripLiveShareApi.status(this.trip.id);
                this.isSharingLiveLocation = Boolean(response?.data?.is_active);
            } catch (err) {
                this.isSharingLiveLocation = false;
            }
        },
        onProfileClick() {
            if (!this.trip || !this.trip.user) {
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
        onDetailClick() {
            if (!this.trip) {
                return;
            }
            this.$router.push({ name: 'detail_trip', params: { id: this.trip.id } });
        }
    },
    components: {
        TripCardShell
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

.ongoing-trip__share {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: inherit;
    text-decoration: none;
    font-weight: 700;
}

.ongoing-trip__share--active {
    color: #e53935;
}

.ongoing-trip__share-icon {
    transform: rotate(90deg);
}
</style>
