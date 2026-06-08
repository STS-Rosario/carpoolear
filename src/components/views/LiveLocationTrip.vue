<template>
    <div class="live-location-trip">
        <Loading :data="loadingData">
            <div v-if="viewMode === 'active'">
                <div ref="mapEl" class="live-location-map" aria-label="Trip live location map"></div>
                <LiveLocationLastUpdated :recorded-at="tripView.recorded_at" />
                <p v-if="tripView.sharer" class="live-location-trip__sharer">
                    {{ $t('liveLocationSharerLabel', { name: tripView.sharer.name }) }}
                </p>
                <p v-if="isWaitingForLiveLocation(tripView)" class="alert alert-info">
                    {{ $t('liveLocationWaitingForPosition') }}
                </p>
            </div>
            <p v-else-if="viewMode === 'stopped'" class="alert alert-warning">
                {{ $t('liveLocationSharingStopped') }}
            </p>
            <p v-else-if="viewMode === 'waiting'" class="alert alert-info">
                {{ $t('liveLocationWaitingForPosition') }}
            </p>
        </Loading>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import Loading from '../Loading.vue';
import LiveLocationLastUpdated from '../elements/LiveLocationLastUpdated.vue';
import { useTripLiveShareStore } from '../../stores/tripLiveShare.js';
import {
    createLiveLocationMap,
    createLiveLocationMarkerUpdater,
    destroyLiveLocationMap
} from '../../utils/liveLocationMap.js';
import {
    getTripLiveLocationViewMode,
    isWaitingForLiveLocation
} from '../../utils/liveLocationViewState.js';

export default {
    name: 'LiveLocationTrip',
    props: {
        id: {
            type: [String, Number],
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
            tripView: 'tripView'
        }),
        viewMode() {
            return getTripLiveLocationViewMode(this.tripView, this.loaded);
        },
        hasCoordinates() {
            return (
                this.tripView &&
                this.tripView.lat != null &&
                this.tripView.lng != null
            );
        },
        loadingData() {
            if (!this.loaded) {
                return null;
            }
            return ['ready'];
        }
    },
    methods: {
        ...mapActions(useTripLiveShareStore, {
            fetchTripView: 'fetchTripView',
            beginViewerPolling: 'beginViewerPolling',
            resetStore: 'reset'
        }),
        isWaitingForLiveLocation,
        async loadView() {
            this.loaded = false;
            try {
                await this.fetchTripView(this.id);
                this.beginViewerPolling(() =>
                    this.fetchTripView(this.id).then(() => this.syncMapAfterRender())
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
            const { lat, lng } = this.tripView;
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
        LiveLocationLastUpdated
    }
};
</script>

<style scoped>
.live-location-trip {
    padding: 1rem;
}

.live-location-map {
    width: 100%;
    height: 360px;
    border-radius: 8px;
}

.live-location-trip__sharer {
    margin-top: 0.75rem;
}
</style>
