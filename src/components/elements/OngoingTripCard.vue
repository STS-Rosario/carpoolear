<template>
    <div class="ongoing-trip" v-if="trip">
        <h2 class="ongoing-trip__heading">{{ $t('viajeEnProgreso') }}</h2>
        <TripCardShell
            :user="trip.user"
            :ratings="driverRatings"
            :trips-count-label="driverTripsLabel"
            :seats-available="trip.seats_available"
            :from-city="locations.fromCity"
            :from-region="locations.fromRegion"
            :from-point="locations.fromPoint"
            :to-city="locations.toCity"
            :to-region="locations.toRegion"
            :to-point="locations.toPoint"
            :date-label="dateLabel"
            :time-label="timeLabel"
            @profile-click="onProfileClick"
            @detail-click="onDetailClick"
        >
            <template #footer-extra>
                <AppButton
                    v-if="showShareLocationLink"
                    class="ongoing-trip__share-btn"
                    :class="{
                        'ongoing-trip__share-btn--active': isSharingLiveLocation
                    }"
                    variant="secondary"
                    block
                    icon-left="fa fa-wifi"
                    :to="{
                        name: 'trip_live_share',
                        params: { id: trip.id }
                    }"
                    @click.stop
                >
                    {{
                        isSharingLiveLocation
                            ? $t('compartiendoUbicacionTiempoReal')
                            : $t('compartirUbicacionTiempoReal')
                    }}
                </AppButton>
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
import AppButton from '../ui/AppButton.vue';

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
        TripCardShell,
        AppButton
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

.ongoing-trip__share-btn :deep(.app-button__icon--left) {
    transform: rotate(90deg);
}

.ongoing-trip__share-btn :deep(.app-button__label) {
    white-space: normal;
    text-align: center;
    line-height: 1.25;
}

.ongoing-trip__share-btn--active {
    color: #e53935;
    border-color: #e53935;
}
</style>
