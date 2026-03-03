import { defineStore } from 'pinia';
import facebook from '../cordova/facebook.js';
import apple from '../cordova/apple.js';
import { AuthApi } from '../services/api';
import bus from '../services/bus-event.js';
import toast from '../cordova/toast.js';

// Lazy-load router to avoid circular dependency (stores → router → routes → components → stores)
let _router;
function getRouter() {
    if (!_router) _router = require('../router').default;
    return _router;
}

const authApi = new AuthApi();

export const useCordovaStore = defineStore('cordova', {
    state: () => ({
        deviceReady: false,
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

        setOnline() {
            this._deviceOnline = true;
        },

        setOffline() {
            this._deviceOnline = false;
        },

        setDevice(device) {
            this.device = device;
        },

        setDeviceId(id) {
            this.deviceId = id;
        },

        // Business logic actions
        notificationArrive(notification) {
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
                        const { useConversationsStore } = require('./conversations');
                        const conversationsStore = useConversationsStore();
                        conversationsStore.findConversation({
                            id: notification.data.conversation_id
                        });
                    }
                }
            } else {
                // Sino estoy entrando desde la notificacion debería abrirme la URL
                getRouter().push(
                    { path: notification.url },
                    function (a, b) {
                        console.log('router succes');
                    },
                    function (x, y) {
                        console.log('router abort');
                    }
                );
            }
            const { useNotificationsStore } = require('./notifications');
            const notificationsStore = useNotificationsStore();
            notificationsStore.add();
        },

        facebookLogin() {
            return facebook.login().then((response) => {
                const accessToken = response.authResponse.accessToken;
                authApi
                    .loginWithProvider('facebook', { access_token: accessToken })
                    .then((response) => {
                        const token = response.token;
                        const { useAuthStore } = require('./auth');
                        const authStore = useAuthStore();
                        authStore.onLoggin(token);
                        authApi.matchFriendsWithProvider('facebook', {
                            access_token: accessToken
                        });
                    });
            });
        },

        appleLogin() {
            return apple.login().then((response) => {
                let data = {
                    access_token: response.identityToken
                };
                data = Object.assign(data, response);

                authApi.loginWithProvider('apple', data).then((response) => {
                    const token = response.token;
                    const { useAuthStore } = require('./auth');
                    const authStore = useAuthStore();
                    authStore.onLoggin(token);
                });
            });
        },

        deviceOnline() {
            this._deviceOnline = true;
        },

        deviceOffline() {
            this._deviceOnline = false;
        },

        onPausa() {
            // do staff
        },

        onResumen() {
            // do staff
        },

        onBackButton() {
            const result = bus.emit('backbutton');
            if (!result) {
                if (getRouter().stack.length > 0) {
                    getRouter().go(-1);
                } else {
                    // In Capacitor, use App.exitApp() instead of navigator.Backbutton.goHome()
                    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                        import('@capacitor/app').then(({ App }) => {
                            App.exitApp();
                        });
                    }
                }
            }
        }
    }
});
