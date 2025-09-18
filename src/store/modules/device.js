import { DeviceApi } from '../../services/api';
import * as types from '../mutation-types';
import bus from '../../services/bus-event';
import cache, { keys } from '../../services/cache';

/* eslint-disable no-undef */

// initial state
let deviceApi = new DeviceApi();

const state = {
    devices: [],
    current: null,
    resolution: {
        width: screen.width,
        height: screen.height
    },
    firsTimeMobileAppOpen: false
};

// getters
const getters = {
    resolution: (state) => state.resolution,
    isMobile: (state) => state.resolution.width < 768,
    isTablet: (state) =>
        state.resolution.width >= 768 && state.resolution.width < 992,
    isDesktop: (state) => state.resolution.width >= 992,
    isNotLargeDesktop: (sate) => sate.resolution.width < 1300,
    isFacebokApp: (state) => window.name !== '',
    isBrowser: (state) => {
        let isBrowser = true;
        if (window.device && window.device.platform) {
            if (window.device.platform.toLowerCase() !== 'browser') {
                isBrowser = false;
            }
        }
        return isBrowser;
    },
    firsTimeMobileAppOpen: (state) => state.firsTimeMobileAppOpen
};

// actions
const actions = {
    register(store) {
        let data = Object.assign({}, store.rootGetters['cordova/deviceData']);
        data.app_version = store.rootState.appVersion;
        // device_type is already set correctly in cordova/deviceData based on the actual platform

        console.log('🔧 === DEVICE REGISTRATION DEBUG ===');
        console.log(
            '📱 Platform:',
            store.rootGetters['cordova/deviceData'].device_type
        );
        console.log(
            '🔐 Device ID (Firebase token):',
            store.rootGetters['cordova/deviceData'].device_id
        );
        console.log(
            '📊 Full registration data:',
            JSON.stringify(data, null, 2)
        );
        console.log('🔧 === DEVICE REGISTRATION DEBUG END ===');

        // Check if we have a Firebase token before registering
        if (!data.device_id) {
            console.log(
                '⚠️ No Firebase token available, skipping device registration'
            );
            return Promise.resolve();
        }

        return deviceApi
            .create(data)
            .then((response) => {
                response.data.notifications = true;
                store.commit(types.DEVICE_SET_CURRENT_DEVICE, response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },

    update(store, data = {}) {
        if (state.current) {
            Object.assign(data, store.rootGetters['cordova/deviceData']);
            data.app_version = store.rootState.appVersion;
            data.notifications = state.current.notifications;
            return deviceApi
                .update(store.state.current.id, data)
                .then((response) => {
                    store.commit(
                        types.DEVICE_SET_CURRENT_DEVICE,
                        response.data
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },

    delete(store, id) {
        return deviceApi
            .remove(id)
            .then((response) => {
                store.commit(types.DEVICE_DELETE, id);
            })
            .catch((err) => {
                console.log(err);
            });
    },

    get(store) {
        return deviceApi
            .index()
            .then((response) => {
                store.commit(types.DEVICE_SET_DEVICES, response);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    resize() {
        var w = window;
        var d = document;
        var e = d.documentElement;
        var g = d.getElementsByTagName('body')[0];
        var x = w.innerWidth || e.clientWidth || g.clientWidth;
        var y = w.innerHeight || e.clientHeight || g.clientHeight;

        state.resolution.width = x;
        state.resolution.height = y;
        bus.emit('resize', state.resolution);
    },
    scrolling() {
        let realScroll = document.body.scrollHeight - state.resolution.height;

        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

        let scrollPosition = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
            ? document.documentElement.scrollTop
            : document.body.scrollTop;

        if (scrollPosition + 400 > realScroll) {
            bus.emit('scroll-bottom', state.resolution);
        }
    },
    setFirstTimeAppOpenInDevice({ commit, getters, rootGetters, dispatch }) {
        if (!getters['isBrowser']) {
            commit(types['DEVICE_SET_FIRST_TIME_APP_OPEN'], true);
            cache.setItem(keys['FIRST_TIME_APP_KEY'], true);
        }
        let user = rootGetters['auth/user'];
        if (user && !user.on_boarding_view) {
            let data = {
                property: 'on_boarding_view',
                value: 1
            };
            dispatch('profile/changeProperty', data, { root: true });
        }
    }
};

// mutations
const mutations = {
    [types.DEVICE_SET_CURRENT_DEVICE](state, device) {
        state.current = device;
        if (device) {
            cache.setItem(keys.DEVICE_KEY, device);
            let i = state.devices.findIndex((i) => i.id === device.id);
            if (i >= 0) {
                state.devices[i] = device;
            } else {
                state.devices.push(device);
            }
        }
    },

    [types.DEVICE_SET_DEVICES](state, devices) {
        state.devices = devices;
    },

    [types.DEVICE_DELETE](state, id) {
        if (id) {
            let i = state.devices.findIndex((i) => i.id === id);
            if (i >= 0) {
                state.devices.splice(i, 1);
            }
        } else {
            state.devices = [];
            state.current = null;
        }
    },

    [types.DEVICE_SET_FIRST_TIME_APP_OPEN](state, value) {
        state.firsTimeMobileAppOpen = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

window.addEventListener('resize', actions.resize, false);
document.addEventListener('scroll', actions.scrolling, false);
