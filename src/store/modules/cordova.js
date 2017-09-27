import * as types from '../mutation-types';
import facebook from '../../cordova/facebook.js';
import {AuthApi} from '../../services/api';
import globalStore from '../index';
import router from '../..//router';
import bus from '../../services/bus-event.js';

let authApi = new AuthApi();
// initial state
const state = {
    deviceReady: false,
    deviceOnline: false,
    device: null,
    deviceId: null
};

// getters
const getters = {
    device: state => state.device,

    networkState: state => state.deviceOnline,

    deviceReady: state => state.deviceReady,

    deviceId: state => state.deviceId,

    deviceData: state => {
        let data = {};
        if (state.device) {
            data.device_type = state.device.platform;
        }
        if (state.deviceId) {
            data.device_id = state.deviceId;
        }
        return data;
    }

};

// actions
const actions = {
    notificationArrive (context, notification) {
    // [TODO] Determinar logica
        console.log(notification);
        globalStore.dispatch('notifications/add');
    },
    facebookLogin (context) {
        return facebook.login().then((response) => {
            let accessToken = response.authResponse.accessToken;
            authApi.loginWithProvider('facebook', {access_token: accessToken}).then((response) => {
                let token = response.token;
                globalStore.dispatch('auth/onLoggin', token);
                authApi.matchFriendsWithProvider('facebook', {access_token: accessToken});
            });
        });
    },

    deviceOnline (store) {
        store.commit(types.CORDOVA_ONLINE);
    },

    deviceOffline (store) {
        store.commit(types.CORDOVA_OFFLINE);
    },

    onPausa (store) {
        // do staff
    },

    onResumen (store) {
        // do staff
    },

    onBackButton (store) {
        let result = bus.emit('backbutton');
        if (!result) {
            if (router.stack.length > 0) {
                router.go(-1);
            } else {
                navigator.Backbutton.goHome();
            }
        }
    }
};

// mutations
const mutations = {
    [types.CORDOVA_DEVICEREADY] (state) {
        state.deviceReady = true;
    },
    [types.CORDOVA_ONLINE] (state) {
        state.deviceOnline = true;
    },
    [types.CORDOVA_OFFLINE] (state) {
        state.deviceOnline = false;
    },
    [types.CORDOVA_SET_DEVICE] (state, device) {
        state.device = device;
    },
    [types.CORDOVA_DEVICE_REGISTER] (state, id) {
        state.deviceId = id;
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

