import { defineStore } from 'pinia';

const RETRY_INTERVAL_MS = 15000;

export const useServerStatusStore = defineStore('serverStatus', {
    state: () => ({
        serverUnavailable: false,
        checking: false,
        _retryTimerId: null
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
                const { useAuthStore } = await import('./auth');
                const authStore = useAuthStore();
                await authStore.reloadConfigFromServer();
            } catch (e) {
                // Server still unreachable; keep blocking UI.
            } finally {
                this.checking = false;
            }
        }
    }
});
