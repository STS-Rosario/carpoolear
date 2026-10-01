import { defineStore } from 'pinia';

const RETRY_INTERVAL_MS = 15000;
const HEALTH_MONITOR_INTERVAL_MS = 30000;

export const useServerStatusStore = defineStore('serverStatus', {
    state: () => ({
        serverUnavailable: false,
        checking: false,
        _retryTimerId: null,
        _monitorTimerId: null
    }),

    actions: {
        markServerUnavailable() {
            if (this.serverUnavailable) {
                return;
            }
            this.serverUnavailable = true;
            this.startRetryPolling();
        },

        clearServerUnavailable() {
            this.serverUnavailable = false;
            this.stopRetryPolling();
        },

        startRetryPolling() {
            if (this._retryTimerId) {
                return;
            }
            this.tryRecover();
            this._retryTimerId = setInterval(() => {
                this.tryRecover();
            }, RETRY_INTERVAL_MS);
        },

        stopRetryPolling() {
            if (!this._retryTimerId) {
                return;
            }
            clearInterval(this._retryTimerId);
            this._retryTimerId = null;
        },

        startHealthMonitoring() {
            if (this._monitorTimerId) {
                return;
            }
            this.tryRecover();
            this._monitorTimerId = setInterval(() => {
                this.tryRecover();
            }, HEALTH_MONITOR_INTERVAL_MS);
        },

        stopHealthMonitoring() {
            if (!this._monitorTimerId) {
                return;
            }
            clearInterval(this._monitorTimerId);
            this._monitorTimerId = null;
        },

        async tryRecover() {
            if (this.checking) {
                return;
            }

            try {
                const { useCordovaStore } = await import('./cordova');
                const cordovaStore = useCordovaStore();
                if (cordovaStore.networkReady && !cordovaStore.networkState) {
                    return;
                }
            } catch (e) {
                console.warn('tryRecover network check:', e);
            }

            this.checking = true;
            try {
                const { default: HealthApi } = await import('../services/api/HealthApi');
                await new HealthApi().check();
            } catch (e) {
                // Server still unreachable; keep blocking UI.
            } finally {
                this.checking = false;
            }
        }
    }
});
