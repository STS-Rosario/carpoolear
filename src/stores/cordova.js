import { defineStore } from 'pinia';
import facebook from '../cordova/facebook.js';
import apple from '../cordova/apple.js';
import { AuthApi } from '../services/api';
import bus from '../services/bus-event.js';
import toast from '../cordova/toast.js';
import { fireLazyRouterPush, getLazyRouter } from '../utils/routerLazy.js';

const authApi = new AuthApi();

export const useCordovaStore = defineStore('cordova', {
    state: () => ({
        deviceReady: false,
        networkReady: false,
        _deviceOnline: false,
        device: null,
        deviceId: null
    }),

    getters: {
        // device, deviceReady, deviceId are accessed via mapState directly from state.
        networkState: (state) => state._deviceOnline,
        deviceData: (state) => {
            const data = {};
            if (state.device) {
                data.device_type = state.device.platform;
            }
            if (state.deviceId) {
                data.device_id = state.deviceId;
            }
            return data;
        }
    },

    actions: {
        // State mutation methods
        setDeviceReady() {
            this.deviceReady = true;
        },

        setNetworkState(connected) {
            const wasOnline = this._deviceOnline;
            this.networkReady = true;
            this._deviceOnline = Boolean(connected);
            if (connected && !wasOnline) {
                import('./serverStatus')
                    .then(({ useServerStatusStore }) => {
                        const serverStatusStore = useServerStatusStore();
                        if (serverStatusStore.serverUnavailable) {
                            serverStatusStore.tryRecover();
                        }
                    })
                    .catch((e) => {
                        console.warn('setNetworkState tryRecover:', e);
                    });
            }
        },

        setOnline() {
            this.setNetworkState(true);
        },

        setOffline() {
            this.setNetworkState(false);
        },

        setDevice(device) {
            this.device = device;
        },

        setDeviceId(id) {
            this.deviceId = id;
        },

        // Business logic actions
        async notificationArrive(notification) {
            // [TODO] Determinar logica
            console.log('Notification arrive', notification);
            if (notification.foreground) {
                toast.toast(notification.content);
                // tendria que recargar cierto dato
                if (notification.data) {
                    if (
                        notification.data.type === 'conversation' &&
                        notification.data.conversation_id
                    ) {
                        const { useConversationsStore } = await import('./conversations');
                        const conversationsStore = useConversationsStore();
                        conversationsStore.findConversation({
                            id: notification.data.conversation_id
                        });
                    }
                }
            } else {
                // Sino estoy entrando desde la notificacion debería abrirme la URL
                fireLazyRouterPush({ path: notification.url });
            }
            const { useNotificationsStore } = await import('./notifications');
            const notificationsStore = useNotificationsStore();
            notificationsStore.add();
        },

        async facebookLogin() {
            return facebook.login().then((response) => {
                const accessToken = response.authResponse.accessToken;
                authApi
                    .loginWithProvider('facebook', { access_token: accessToken })
                    .then(async (response) => {
                        const token = response.token;
                        const { useAuthStore } = await import('./auth');
                        const authStore = useAuthStore();
                        authStore.onLoggin(token);
                        authApi.matchFriendsWithProvider('facebook', {
                            access_token: accessToken
                        });
                    });
            });
        },

        async appleLogin() {
            return apple.login().then((response) => {
                let data = {
                    access_token: response.identityToken
                };
                data = Object.assign(data, response);

                authApi.loginWithProvider('apple', data).then(async (response) => {
                    const token = response.token;
                    const { useAuthStore } = await import('./auth');
                    const authStore = useAuthStore();
                    authStore.onLoggin(token);
                });
            });
        },

        deviceOnline() {
            this.setNetworkState(true);
        },

        deviceOffline() {
            this.setNetworkState(false);
        },

        onPausa() {
            // do staff
        },

        onResumen() {
            // do staff
        },

        async onBackButton() {
            const result = bus.emit('backbutton');
            if (!result) {
                const router = await getLazyRouter();
                if (window.history.length > 1) {
                    router.back();
                } else if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                    import('@capacitor/app').then(({ App }) => {
                        App.exitApp();
                    });
                }
            }
        }
    }
});
