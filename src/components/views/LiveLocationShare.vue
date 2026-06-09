<template>
    <div class="live-location-share">
        <Loading :data="loadingData">
            <div v-if="share && share.is_active" class="live-location-share__active">
                <p>{{ $t('liveLocationSharingActive') }}</p>
                <div ref="mapEl" class="live-location-map" aria-label="Live location map"></div>
                <LiveLocationLastUpdated :recorded-at="share.recorded_at" />
                <p v-if="!hasCoordinates" class="alert alert-info">
                    {{ $t('liveLocationWaitingForPosition') }}
                </p>
                <label class="live-location-share__label" for="live-share-url">{{
                    $t('liveLocationShareUrlLabel')
                }}</label>
                <div class="live-location-share__url-row">
                    <input
                        id="live-share-url"
                        class="form-control live-location-share__url"
                        :value="shareUrl"
                        readonly
                    />
                    <button type="button" class="btn btn-default" @click="copyShareUrl">
                        {{ $t('liveLocationCopyUrl') }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary live-location-share__share-btn"
                        @click="shareLiveUrl"
                    >
                        <i class="fa fa-share-alt" aria-hidden="true"></i>
                        {{ $t('compartirUbicacionTiempoReal') }}
                    </button>
                </div>
                <button
                    type="button"
                    class="btn btn-danger live-location-share__stop"
                    @click="stopSharing"
                >
                    {{ $t('liveLocationStopSharing') }}
                </button>
            </div>
            <div v-else class="live-location-share__inactive">
                <p v-if="shareIntroKey" class="live-location-share__intro">
                    {{ $t(shareIntroKey) }}
                </p>
                <button type="button" class="btn btn-primary" @click="startSharing">
                    <i class="fa fa-wifi live-location-share__share-icon" aria-hidden="true"></i>
                    {{ $t('compartirUbicacionTiempoReal') }}
                </button>
                <p v-if="errorMessage" class="alert alert-warning">{{ errorMessage }}</p>
            </div>
        </Loading>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import Loading from '../Loading.vue';
import LiveLocationLastUpdated from '../elements/LiveLocationLastUpdated.vue';
import { useAuthStore } from '../../stores/auth.js';
import { useRootStore } from '../../stores/root.js';
import { useTripLiveShareStore } from '../../stores/tripLiveShare.js';
import toast from '../../cordova/toast.js';
import { shareContent } from '../../utils/shareContent.js';
import {
    createLiveLocationMap,
    createLiveLocationMarkerUpdater,
    destroyLiveLocationMap
} from '../../utils/liveLocationMap.js';
import { getLiveLocationShareIntroKey } from '../../utils/liveLocationShareIntro.js';

export default {
    name: 'LiveLocationShare',
    props: {
        id: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            loaded: false,
            errorMessage: '',
            mapInstance: null,
            marker: null,
            trip: null
        };
    },
    computed: {
        ...mapState(useTripLiveShareStore, {
            share: 'share',
            shareUrl: 'shareUrl'
        }),
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        shareIntroKey() {
            return getLiveLocationShareIntroKey(this.trip, this.user?.id);
        },
        hasCoordinates() {
            return (
                this.share &&
                this.share.lat != null &&
                this.share.lng != null
            );
        },
        loadingData() {
            if (!this.loaded) {
                return null;
            }
            return ['ready'];
        }
    },
    watch: {
        share: {
            handler() {
                this.$nextTick(() => this.syncMap());
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(useTripLiveShareStore, {
            fetchStatus: 'fetchStatus',
            resumeActiveSharing: 'resumeActiveSharing',
            startSharingAction: 'startSharing',
            stopSharingAction: 'stopSharing',
            resetStore: 'reset'
        }),
        async loadStatus() {
            this.loaded = false;
            try {
                await Promise.all([
                    this.fetchStatus(this.id),
                    useRootStore()
                        .getTrip(this.id)
                        .then((trip) => {
                            this.trip = trip;
                        })
                ]);
                this.resumeActiveSharing(this.id);
            } finally {
                this.loaded = true;
                await this.$nextTick();
                this.syncMap();
            }
        },
        syncMap() {
            if (!this.hasCoordinates || !this.$refs.mapEl) {
                return;
            }
            const { lat, lng } = this.share;
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
        },
        async startSharing() {
            this.errorMessage = '';
            try {
                await this.startSharingAction(this.id);
                await this.$nextTick();
                this.syncMap();
            } catch (err) {
                this.errorMessage = this.$t('liveLocationPermissionDenied');
                console.error('[LiveLocationShare] startSharing failed:', err);
            }
        },
        async stopSharing() {
            destroyLiveLocationMap(this.mapInstance);
            this.mapInstance = null;
            this.marker = null;
            await this.stopSharingAction(this.id);
        },
        async copyShareUrl() {
            if (!this.shareUrl) {
                return;
            }
            try {
                await navigator.clipboard.writeText(this.shareUrl);
                toast.toast(this.$t('liveLocationCopySuccess'));
            } catch (err) {
                console.error('[LiveLocationShare] copy failed:', err);
            }
        },
        async shareLiveUrl() {
            if (!this.shareUrl) {
                return;
            }
            const title = this.$t('compartirUbicacionTiempoReal');
            const result = await shareContent({
                title,
                text: title,
                url: this.shareUrl
            });
            if (!result.ok && !result.cancelled) {
                await this.copyShareUrl();
            }
        }
    },
    mounted() {
        this.loadStatus();
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
.live-location-share {
    max-width: 520px;
    margin: 0 auto;
    padding: 1rem;
}

.live-location-share__stop {
    margin-bottom: calc(52px + constant(safe-area-inset-bottom, 0px));
    margin-bottom: calc(52px + env(safe-area-inset-bottom, 0px));
}

.live-location-share__intro {
    margin-bottom: 1rem;
    line-height: 1.5;
}

.live-location-map {
    width: 100%;
    height: 360px;
    border-radius: 8px;
    margin-bottom: 0.75rem;
}

.live-location-share__url-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.75rem 0 1rem;
}

.live-location-share__url {
    flex: 1 1 220px;
}

.live-location-share__share-btn i {
    margin-right: 0.35rem;
}

.live-location-share__share-icon {
    transform: rotate(90deg);
    margin-right: 0.35rem;
}
</style>
