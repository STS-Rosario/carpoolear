import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { DeviceApi } from '../services/api';
import { useCordovaStore } from './cordova';
import { useProfileStore } from './profile';
import bus from '../services/bus-event';
import cache, { keys } from '../services/cache';

const deviceApi = new DeviceApi();

export const useDeviceStore = defineStore('device', () => {
    const devices = ref([]);
    const current = ref(null);
    const resolution = reactive({
        width: typeof screen !== 'undefined' ? screen.width : 1024,
        height: typeof screen !== 'undefined' ? screen.height : 768
    });
    const firsTimeMobileAppOpen = ref(false);

    const isMobile = computed(() => resolution.width < 768);
    const isTablet = computed(() => resolution.width >= 768 && resolution.width < 992);
    const isDesktop = computed(() => resolution.width >= 992);
    const isNotLargeDesktop = computed(() => resolution.width < 1300);
    const isFacebokApp = computed(() => window.name !== '');
    const isBrowser = computed(() => {
        let result = true;
        if (window.device && window.device.platform) {
            if (window.device.platform.toLowerCase() !== 'browser') {
                result = false;
            }
        }
        return result;
    });

    function register() {
        const cordovaStore = useCordovaStore();
        const data = { ...cordovaStore.deviceData };
        data.app_version = import.meta.env.VITE_APP_VERSION || '1.0.0';

        if (!data.device_id) {
            return Promise.resolve();
        }

        return deviceApi
            .create(data)
            .then((response) => {
                response.data.notifications = true;
                setCurrentDevice(response.data);
            })
            .catch((err) => {
                console.error('Device registration failed:', err);
            });
    }

    function update(data = {}) {
        if (current.value) {
            const cordovaStore = useCordovaStore();
            Object.assign(data, cordovaStore.deviceData);
            data.app_version = import.meta.env.VITE_APP_VERSION || '1.0.0';
            data.notifications = current.value.notifications;
            return deviceApi
                .update(current.value.id, data)
                .then((response) => {
                    setCurrentDevice(response.data);
                })
                .catch((err) => {
                    console.error('Device update failed:', err);
                });
        }
    }

    function deleteDevice(id) {
        return deviceApi
            .remove(id)
            .then(() => {
                if (id) {
                    const i = devices.value.findIndex((item) => item.id === id);
                    if (i >= 0) {
                        devices.value.splice(i, 1);
                    }
                } else {
                    devices.value = [];
                    current.value = null;
                }
            })
            .catch((err) => {
                console.error('Device deletion failed:', err);
            });
    }

    function get() {
        return deviceApi
            .index()
            .then((response) => {
                devices.value = response;
            })
            .catch((err) => {
                console.error('Device fetch failed:', err);
            });
    }

    function resize() {
        const w = window;
        const d = document;
        const e = d.documentElement;
        const g = d.getElementsByTagName('body')[0];
        const x = w.innerWidth || e.clientWidth || g.clientWidth;
        const y = w.innerHeight || e.clientHeight || g.clientHeight;

        resolution.width = x;
        resolution.height = y;
        bus.emit('resize', { ...resolution });
    }

    function scrolling() {
        const realScroll = document.body.scrollHeight - resolution.height;

        const supportPageOffset = window.pageXOffset !== undefined;
        const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

        const scrollPosition = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? document.documentElement.scrollTop
                : document.body.scrollTop;

        if (scrollPosition + 400 > realScroll) {
            bus.emit('scroll-bottom', { ...resolution });
        }
    }

    function setCurrentDevice(device) {
        current.value = device;
        if (device) {
            cache.setItem(keys.DEVICE_KEY, device);
            const i = devices.value.findIndex((item) => item.id === device.id);
            if (i >= 0) {
                devices.value[i] = device;
            } else {
                devices.value.push(device);
            }
        }
    }

    function setDevices(newDevices) {
        devices.value = newDevices;
    }

    function setFirstTimeAppOpen(value) {
        firsTimeMobileAppOpen.value = value;
        cache.setItem(keys.FIRST_TIME_APP_KEY, value);
    }

    function setFirstTimeAppOpenInDevice() {
        if (!isBrowser.value) {
            setFirstTimeAppOpen(true);
            // Persist to server so onboarding is not shown again after re-login
            try {
                const profileStore = useProfileStore();
                profileStore.changeProperty({ on_boarding_view: 1 });
            } catch (e) {
                // profileStore may not be available
            }
        }
    }

    // Set up window listeners (remove first to avoid stacking on HMR)
    window.removeEventListener('resize', resize, false);
    window.addEventListener('resize', resize, false);
    document.removeEventListener('scroll', scrolling, false);
    document.addEventListener('scroll', scrolling, false);

    return {
        devices,
        current,
        resolution,
        firsTimeMobileAppOpen,
        isMobile,
        isTablet,
        isDesktop,
        isNotLargeDesktop,
        isFacebokApp,
        isBrowser,
        register,
        update,
        deleteDevice,
        get,
        resize,
        scrolling,
        setCurrentDevice,
        setDevices,
        setFirstTimeAppOpen,
        setFirstTimeAppOpenInDevice
    };
});
