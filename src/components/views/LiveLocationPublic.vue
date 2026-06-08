<template>
    <div class="live-location-public">
        <Loading :data="loadingData">
            <div v-if="viewMode === 'active'">
                <div class="live-location-public__driver" v-if="publicView.driver">
                    <router-link
                        :to="{
                            name: 'profile',
                            params: { id: publicView.driver.id, userProfile: publicView.driver }
                        }"
                    >
                        <UserNameWithBadge :user="publicView.driver" />
                    </router-link>
                    <UserRatingsCounts
                        :ratings="{
                            positive: publicView.driver.positive_ratings,
                            negative: publicView.driver.negative_ratings
                        }"
                    />
                </div>
                <div ref="mapEl" class="live-location-map" aria-label="Live location map"></div>
                <LiveLocationLastUpdated :recorded-at="publicView.recorded_at" />
                <p v-if="isWaitingForLiveLocation(publicView)" class="alert alert-info">
                    {{ $t('liveLocationWaitingForPosition') }}
                </p>
            </div>
            <p v-else-if="viewMode === 'stopped'" class="alert alert-warning">
                {{ $t('liveLocationSharingStopped') }}
            </p>
            <template #no-data>
                <p class="alert alert-warning">{{ $t('liveLocationNotFound') }}</p>
            </template>
        </Loading>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import Loading from '../Loading.vue';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import UserRatingsCounts from '../elements/UserRatingsCounts.vue';
import LiveLocationLastUpdated from '../elements/LiveLocationLastUpdated.vue';
import { useTripLiveShareStore } from '../../stores/tripLiveShare.js';
import {
    createLiveLocationMap,
    createLiveLocationMarkerUpdater,
    destroyLiveLocationMap
} from '../../utils/liveLocationMap.js';
import {
    getPublicLiveLocationViewMode,
    isWaitingForLiveLocation
} from '../../utils/liveLocationViewState.js';

export default {
    name: 'LiveLocationPublic',
    props: {
        token: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loaded: false,
            mapInstance: null,
            marker: null
        };
    },
    computed: {
        ...mapState(useTripLiveShareStore, {
            publicView: 'publicView'
        }),
        viewMode() {
            return getPublicLiveLocationViewMode(this.publicView, this.loaded);
        },
        hasCoordinates() {
            return (
                this.publicView &&
                this.publicView.lat != null &&
                this.publicView.lng != null
            );
        },
        loadingData() {
            if (!this.loaded) {
                return null;
            }
            return this.publicView ? ['ready'] : [];
        }
    },
    methods: {
        ...mapActions(useTripLiveShareStore, {
            fetchPublicView: 'fetchPublicView',
            beginViewerPolling: 'beginViewerPolling',
            resetStore: 'reset'
        }),
        isWaitingForLiveLocation,
        async loadView() {
            this.loaded = false;
            try {
                await this.fetchPublicView(this.token);
                this.beginViewerPolling(() =>
                    this.fetchPublicView(this.token).then(() => this.syncMapAfterRender())
                );
            } finally {
                this.loaded = true;
                await this.syncMapAfterRender();
            }
        },
        async syncMapAfterRender() {
            await this.$nextTick();
            this.syncMap();
        },
        syncMap() {
            if (!this.hasCoordinates || !this.$refs.mapEl) {
                return;
            }
            const { lat, lng } = this.publicView;
            if (!this.mapInstance) {
                const created = createLiveLocationMap(this.$refs.mapEl, lat, lng);
                this.mapInstance = created.map;
                this.marker = created.marker;
            } else {
                const updater = createLiveLocationMarkerUpdater(
                    this.mapInstance,
                    () => this.marker
                );
                updater(lat, lng);
            }
        }
    },
    mounted() {
        this.loadView();
    },
    beforeUnmount() {
        destroyLiveLocationMap(this.mapInstance);
        this.resetStore();
    },
    components: {
        Loading,
        UserNameWithBadge,
        UserRatingsCounts,
        LiveLocationLastUpdated
    }
};
</script>

<style scoped>
.live-location-public {
    padding: 1rem;
}

.live-location-public__driver {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.live-location-map {
    width: 100%;
    height: 360px;
    border-radius: 8px;
}
</style>
