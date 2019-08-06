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
    }
};

// getters
const getters = {
    resolution: state => state.resolution,
    isMobile: state => state.resolution.width < 768,
    isTablet: state => state.resolution.width >= 768 && state.resolution.width < 992,
    isDesktop: state => state.resolution.width >= 992,
    isNotLargeDesktop: sate => sate.resolution.width < 1300,
    isFacebokApp: state => window.name !== '',
    isBrowser: state => {
        let isBrowser = true;
        if (window.device && window.device.platform) {
            if (window.device.platform.toLowerCase() !== 'browser') {
                isBrowser = false;
            }
        }
        return isBrowser;
    }
};

// actions
const actions = {
    register (store) {
        let data = Object.assign({}, store.rootGetters['cordova/deviceData']);
        console.log(store.rootGetters['cordova/deviceData']);
        data.app_version = store.rootState.appVersion;

        return deviceApi.create(data).then(response => {
            response.data.notifications = true;
            store.commit(types.DEVICE_SET_CURRENT_DEVICE, response.data);
        }).catch(err => {
            console.log(err);
        });
    },

    update (store, data = {}) {
        if (state.current) {
            Object.assign(data, store.rootGetters['cordova/deviceData']);
            data.app_version = store.rootState.appVersion;
            data.notifications = state.current.notifications;
            return deviceApi.update(store.state.current.id, data).then((response) => {
                store.commit(types.DEVICE_SET_CURRENT_DEVICE, response.data);
            }).catch((err) => {
                console.log(err);
            });
        }
    },

    delete (store, id) {
        return deviceApi.remove(id).then((response) => {
            store.commit(types.DEVICE_DELETE, id);
        }).catch((err) => {
            console.log(err);
        });
    },

    get (store) {
        return deviceApi.index().then((response) => {
            store.commit(types.DEVICE_SET_DEVICES, response);
        }).catch((err) => {
            console.log(err);
        });
    },
    resize () {
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
    scrolling () {
        let realScroll = document.body.scrollHeight - state.resolution.height;

        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');

        let scrollPosition = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

        if (scrollPosition + 400 > realScroll) {
            bus.emit('scroll-bottom', state.resolution);
        }
    }

};

// mutations
const mutations = {
    [types.DEVICE_SET_CURRENT_DEVICE] (state, device) {
        state.current = device;
        cache.setItem(keys.DEVICE_KEY, device);
        let i = state.devices.findIndex((i) => i.id === device.id);
        if (i >= 0) {
            state.devices[i] = device;
        } else {
            state.devices.push(device);
        }
    },

    [types.DEVICE_SET_DEVICES] (state, devices) {
        state.devices = devices;
    },

    [types.DEVICE_DELETE] (state, id) {
        if (id) {
            let i = state.devices.findIndex((i) => i.id === id);
            if (i >= 0) {
                state.devices.splice(i, 1);
            }
        } else {
            state.devices = [];
            state.current = null;
        }
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
console.log('EVENT BINDING', actions.scrolling);
document.addEventListener('scroll', actions.scrolling, false);
