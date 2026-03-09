import { defineStore } from 'pinia';
import { DeviceApi } from '../services/api';
import bus from '../services/bus-event';
import cache, { keys } from '../services/cache';

/* eslint-disable no-undef */

const deviceApi = new DeviceApi();

export const useDeviceStore = defineStore('device', {
    state: () => ({
        devices: [],
        current: null,
        resolution: {
            width: screen.width,
            height: screen.height
        },
        firsTimeMobileAppOpen: false
    }),

    getters: {
        // resolution and firsTimeMobileAppOpen are accessed via mapState directly from state.
        isMobile: (state) => state.resolution.width < 768,
        isTablet: (state) =>
            state.resolution.width >= 768 && state.resolution.width < 992,
        isDesktop: (state) => state.resolution.width >= 992,
        isNotLargeDesktop: (state) => state.resolution.width < 1300,
        isFacebokApp: (state) => window.name !== '',
        isBrowser: (state) => {
            let isBrowser = true;
            if (window.device && window.device.platform) {
                if (window.device.platform.toLowerCase() !== 'browser') {
                    isBrowser = false;
                }
            }
            return isBrowser;
        }
    },

    actions: {
        register() {
            const { useCordovaStore } = require('./cordova');
            const { useRootStore } = require('./root');
            const cordovaStore = useCordovaStore();
            const rootStore = useRootStore();

            const data = Object.assign({}, cordovaStore.deviceData);
            data.app_version = rootStore.appVersion;

            // Check if we have a Firebase token before registering
            if (!data.device_id) {
                return Promise.resolve();
            }

            return deviceApi
                .create(data)
                .then((response) => {
                    response.data.notifications = true;
                    this.setCurrentDevice(response.data);
                })
                .catch((err) => {
                    console.error('Device registration failed:', err);
                });
        },

        update(data = {}) {
            if (this.current) {
                const { useCordovaStore } = require('./cordova');
                const { useRootStore } = require('./root');
                const cordovaStore = useCordovaStore();
                const rootStore = useRootStore();

                Object.assign(data, cordovaStore.deviceData);
                data.app_version = rootStore.appVersion;
                data.notifications = this.current.notifications;
                return deviceApi
                    .update(this.current.id, data)
                    .then((response) => {
                        this.setCurrentDevice(response.data);
                    })
                    .catch((err) => {
                        console.error('Device update failed:', err);
                    });
            }
        },

        delete(id) {
            return deviceApi
                .remove(id)
                .then((response) => {
                    this.deleteDevice(id);
                })
                .catch((err) => {
                    console.error('Device deletion failed:', err);
                });
        },

        get() {
            return deviceApi
                .index()
                .then((response) => {
                    this.setDevices(response);
                })
                .catch((err) => {
                    console.error('Device fetch failed:', err);
                });
        },

        // State mutation methods
        setCurrentDevice(device) {
            this.current = device;
            if (device) {
                cache.setItem(keys.DEVICE_KEY, device);
                const i = this.devices.findIndex((item) => item.id === device.id);
                if (i >= 0) {
                    this.devices[i] = device;
                } else {
                    this.devices.push(device);
                }
            }
        },

        setDevices(devices) {
            this.devices = devices;
        },

        deleteDevice(id) {
            if (id) {
                const i = this.devices.findIndex((item) => item.id === id);
                if (i >= 0) {
                    this.devices.splice(i, 1);
                }
            } else {
                this.devices = [];
                this.current = null;
            }
        },

        setFirstTimeAppOpen(value) {
            this.firsTimeMobileAppOpen = value;
        },

        resize() {
            const w = window;
            const d = document;
            const e = d.documentElement;
            const g = d.getElementsByTagName('body')[0];
            const x = w.innerWidth || e.clientWidth || g.clientWidth;
            const y = w.innerHeight || e.clientHeight || g.clientHeight;

            this.resolution.width = x;
            this.resolution.height = y;
            bus.emit('resize', this.resolution);
        },

        scrolling() {
            const realScroll = document.body.scrollHeight - this.resolution.height;

            const supportPageOffset = window.pageXOffset !== undefined;
            const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

            const scrollPosition = supportPageOffset
                ? window.pageYOffset
                : isCSS1Compat
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop;

            if (scrollPosition + 400 > realScroll) {
                bus.emit('scroll-bottom', this.resolution);
            }
        },

        setFirstTimeAppOpenInDevice() {
            if (!this.isBrowser) {
                this.setFirstTimeAppOpen(true);
                cache.setItem(keys.FIRST_TIME_APP_KEY, true);
            }
            const { useAuthStore } = require('./auth');
            const { useProfileStore } = require('./profile');
            const authStore = useAuthStore();
            const profileStore = useProfileStore();
            const user = authStore.user;
            if (user && !user.on_boarding_view) {
                const data = {
                    property: 'on_boarding_view',
                    value: 1
                };
                profileStore.changeProperty(data);
            }
        }
    }
});

// Preserve window event listeners from original
window.addEventListener('resize', () => { useDeviceStore().resize(); }, false);
document.addEventListener('scroll', () => { useDeviceStore().scrolling(); }, false);
