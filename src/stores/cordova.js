import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import facebook from '../cordova/facebook.js';
import apple from '../cordova/apple.js';
import { AuthApi } from '../services/api';
import bus from '../services/bus-event.js';
import toast from '../cordova/toast.js';

const authApi = new AuthApi();

export const useCordovaStore = defineStore('cordova', () => {
    const deviceReady = ref(false);
    const deviceOnline = ref(false);
    const device = ref(null);
    const deviceId = ref(null);

    const networkState = computed(() => deviceOnline.value);
    const deviceData = computed(() => {
        const data = {};
        if (device.value) {
            data.device_type = device.value.platform;
        }
        if (deviceId.value) {
            data.device_id = deviceId.value;
        }
        return data;
    });

    function notificationArrive(notification, router, conversationsStore, notificationsStore) {
        console.log('Notification arrive', notification);
        if (notification.foreground) {
            toast.toast(notification.content);
            if (notification.data) {
                if (
                    notification.data.type === 'conversation' &&
                    notification.data.conversation_id
                ) {
                    conversationsStore.findConversation({
                        id: notification.data.conversation_id
                    });
                }
            }
        } else {
            router.push({ path: notification.url })
                .then(() => {
                    console.log('router success');
                })
                .catch(() => {
                    console.log('router abort');
                });
        }
        notificationsStore.add();
    }

    function facebookLogin(authStore) {
        return facebook.login().then((response) => {
            const accessToken = response.authResponse.accessToken;
            authApi
                .loginWithProvider('facebook', { access_token: accessToken })
                .then((response) => {
                    const token = response.token;
                    bus.emit('social-login', token);
                    authApi.matchFriendsWithProvider('facebook', {
                        access_token: accessToken
                    });
                });
        });
    }

    function appleLogin(authStore) {
        return apple.login().then((response) => {
            let data = {
                access_token: response.identityToken
            };
            data = Object.assign(data, response);

            authApi.loginWithProvider('apple', data).then((response) => {
                const token = response.token;
                bus.emit('social-login', token);
            });
        });
    }

    function setDeviceReady() {
        deviceReady.value = true;
    }

    function setDeviceOnline() {
        deviceOnline.value = true;
    }

    function setDeviceOffline() {
        deviceOnline.value = false;
    }

    function setDevice(dev) {
        device.value = dev;
    }

    function setDeviceId(id) {
        deviceId.value = id;
    }

    function onBackButton(router) {
        const result = bus.emit('backbutton');
        if (!result) {
            if (router.stack && router.stack.length > 0) {
                router.go(-1);
            } else {
                if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                    import('@capacitor/app').then(({ App }) => {
                        App.exitApp();
                    });
                }
            }
        }
    }

    return {
        deviceReady,
        deviceOnline,
        device,
        deviceId,
        networkState,
        deviceData,
        notificationArrive,
        facebookLogin,
        appleLogin,
        setDeviceReady,
        setDeviceOnline,
        setDeviceOffline,
        setDevice,
        setDeviceId,
        onBackButton
    };
});
