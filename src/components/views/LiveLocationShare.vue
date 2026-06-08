<template>
    <div class="live-location-share">
        <Loading :data="loadingData">
            <div v-if="share && share.is_active" class="live-location-share__active">
                <p>{{ $t('liveLocationSharingActive') }}</p>
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
                <button type="button" class="btn btn-danger" @click="stopSharing">
                    {{ $t('liveLocationStopSharing') }}
                </button>
            </div>
            <div v-else class="live-location-share__inactive">
                <p>{{ $t('liveLocationSharingInactive') }}</p>
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
import { useTripLiveShareStore } from '../../stores/tripLiveShare.js';
import socialShare from '../../services/socialShare.js';
import toast from '../../cordova/toast.js';

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
            errorMessage: ''
        };
    },
    computed: {
        ...mapState(useTripLiveShareStore, {
            share: 'share',
            shareUrl: 'shareUrl'
        }),
        loadingData() {
            if (!this.loaded) {
                return null;
            }
            return ['ready'];
        }
    },
    methods: {
        ...mapActions(useTripLiveShareStore, {
            fetchStatus: 'fetchStatus',
            startSharingAction: 'startSharing',
            stopSharingAction: 'stopSharing',
            resetStore: 'reset'
        }),
        async loadStatus() {
            this.loaded = false;
            try {
                await this.fetchStatus(this.id);
            } finally {
                this.loaded = true;
            }
        },
        async startSharing() {
            this.errorMessage = '';
            try {
                await this.startSharingAction(this.id);
            } catch (err) {
                this.errorMessage = this.$t('liveLocationPermissionDenied');
                console.error('[LiveLocationShare] startSharing failed:', err);
            }
        },
        async stopSharing() {
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
        shareLiveUrl() {
            if (!this.shareUrl) {
                return;
            }
            if (navigator.share) {
                navigator.share({
                    title: this.$t('compartirUbicacionTiempoReal'),
                    url: this.shareUrl
                }).catch(() => {});
                return;
            }
            socialShare.share({
                message: this.$t('compartirUbicacionTiempoReal'),
                url: this.shareUrl
            });
        }
    },
    mounted() {
        this.loadStatus();
    },
    beforeUnmount() {
        this.resetStore();
    },
    components: {
        Loading
    }
};
</script>

<style scoped>
.live-location-share {
    max-width: 520px;
    margin: 0 auto;
    padding: 1rem;
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
