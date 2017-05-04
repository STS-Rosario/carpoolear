import {DeviceApi} from '../../services/api';
import * as types from '../mutation-types';
import bus from '../../services/bus-event';

/* eslint-disable no-undef */

// initial state
// shape: [{ id, quantity }]
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
    trips: state => state.trips
};

// actions
const actions = {
    register (store) {
        let data = {};
        Object.assign(data, store.rootGetters['cordova/deviceData']);
        data.app_version = store.rootState.appVersion;

        return deviceApi.create(data).then(response => {
            store.commit(types.DEVICE_SET_CURRENT_DEVICE, response.data);
        }).catch(err => {
            console.log(err);
        });
    },

    update (store, data = {}) {
        Object.assign(data, store.rootGetters['cordova/deviceData']);
        data.app_version = store.rootState.appVersion;

        return deviceApi.update(store.state.current.id, data).then((response) => {
            store.commit(types.DEVICE_SET_CURRENT_DEVICE, response.data);
        }).catch((err) => {
            console.log(err);
        });
    },

    delete (store, id) {
        return deviceApi.delete(id).then((response) => {
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
    }

};

// mutations
const mutations = {
    [types.DEVICE_SET_CURRENT_DEVICE] (state, device) {
        state.current = device;
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

window.addEventListener('resize', function () {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    var y = w.innerHeight || e.clientHeight || g.clientHeight;

    state.resolution.width = x;
    state.resolution.height = y;
    bus.emit('resize', state.resolution);
}, false);
