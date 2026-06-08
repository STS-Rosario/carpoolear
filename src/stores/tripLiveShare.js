import { defineStore } from 'pinia';
import TripLiveShareApi from '../services/api/TripLiveShare.js';
import {
    clearLocationWatch,
    requestLocationPermission,
    startLocationWatch
} from '../utils/geolocation.js';
import { buildLiveShareUrl, getUpdateIntervalMs } from '../utils/tripLiveShareUtils.js';

const api = new TripLiveShareApi();

export const useTripLiveShareStore = defineStore('tripLiveShare', {
    state: () => ({
        share: null,
        publicView: null,
        tripView: null,
        updateTimer: null,
        pollTimer: null,
        error: null
    }),

    getters: {
        shareUrl: (state) =>
            state.share && state.share.share_token
                ? buildLiveShareUrl(state.share.share_token)
                : '',
        isSharing: (state) => Boolean(state.share && state.share.is_active)
    },

    actions: {
        async fetchStatus(tripId) {
            const response = await api.status(tripId);
            this.share = response?.data ?? null;
            return this.share;
        },

        async startSharing(tripId) {
            this.error = null;
            await requestLocationPermission();
            const response = await api.start(tripId);
            this.share = response?.data ?? null;
            this.beginLocationUpdates(tripId);
            return this.share;
        },

        async stopSharing(tripId) {
            this.clearTimers();
            clearLocationWatch();
            const response = await api.stop(tripId);
            this.share = response?.data ?? null;
            return this.share;
        },

        beginLocationUpdates(tripId) {
            this.clearTimers();
            const pushLocation = async (coords) => {
                try {
                    const response = await api.updateLocation(
                        tripId,
                        coords.lat,
                        coords.lng
                    );
                    this.share = response?.data ?? this.share;
                } catch (err) {
                    console.error('[tripLiveShare] updateLocation failed:', err);
                }
            };

            startLocationWatch((coords) => {
                pushLocation(coords);
            }).catch((err) => {
                console.error('[tripLiveShare] watch failed:', err);
            });

            this.updateTimer = setInterval(() => {
                requestLocationPermission()
                    .then(pushLocation)
                    .catch((err) => {
                        console.error('[tripLiveShare] periodic location failed:', err);
                    });
            }, getUpdateIntervalMs('sharer'));
        },

        async fetchPublicView(token) {
            const response = await api.publicView(token);
            this.publicView = response?.data ?? null;
            return this.publicView;
        },

        async fetchTripView(tripId) {
            const response = await api.tripView(tripId);
            this.tripView = response?.data ?? null;
            return this.tripView;
        },

        beginViewerPolling(fetchFn) {
            this.clearPollTimer();
            this.pollTimer = setInterval(() => {
                fetchFn().catch((err) => {
                    console.error('[tripLiveShare] poll failed:', err);
                });
            }, getUpdateIntervalMs('viewer'));
        },

        clearTimers() {
            if (this.updateTimer) {
                clearInterval(this.updateTimer);
                this.updateTimer = null;
            }
            this.clearPollTimer();
        },

        clearPollTimer() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer);
                this.pollTimer = null;
            }
        },

        reset() {
            this.clearTimers();
            clearLocationWatch();
            this.share = null;
            this.publicView = null;
            this.tripView = null;
            this.error = null;
        }
    }
});
