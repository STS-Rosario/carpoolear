import * as types from '../mutation-types';
import { AuthApi, UserApi } from '../../services/api';
import router from '../../router';
import cache, { keys } from '../../services/cache';
import localConfig from '../../../config/conf';
import globalStore from '../index';

let authApi = new AuthApi();
let userApi = new UserApi();

const state = {
    auth: false,
    user: null,
    token: null,
    firstTime: false,
    appConfig: null
};

// getters
const getters = {
    checkLogin: state => state.auth,
    authHeader: state => state.auth ? { 'Authorization': 'Bearer ' + state.token } : {},
    user: state => state.user,
    firstTime: state => state.firstTime,
    appConfig: state => state.appConfig,
    tripCardTheme: state => state.appConfig ? state.appConfig.trip_card_design : '',
    isRemoteConfig: state => state.appConfig && !state.appConfig.__isLocal
};

// actions

function onLoggin (store, token) {
    store.commit(types.AUTH_SET_TOKEN, token);
    fetchUser(store);
    if (globalStore.state.cordova.device) {
        globalStore.dispatch('device/register');
    }
    console.log('dispatch trips/tripsSearch on Loggin');
    globalStore.dispatch('trips/tripsSearch', { is_passenger: false });
    globalStore.dispatch('myTrips/tripAsDriver');
    globalStore.dispatch('myTrips/tripAsPassenger');
    globalStore.dispatch('rates/pendingRates');
    globalStore.dispatch('cars/index');
    globalStore.dispatch('passenger/getPendingRequest');
    globalStore.dispatch('startThread');
    if (store.getters.firstTime) {
        router.replace({ name: 'profile_update' });
    } else {
        router.rememberBack();
    }
}

function login (store, { email, password }) {
    let creds = {};
    creds.email = email;
    creds.password = password;

    return authApi.login(creds).then((response) => {
        onLoggin(store, response.token);
        return Promise.resolve();
    }, ({ data, status }) => {
        return Promise.reject(data);
    });
}

function firstTime (store, firstTime) {
    store.commit(types.AUTH_FIRST_TIME, firstTime);
}

// store = { commit, state, rootState, rootGetters }
function activate (store, activationToken) {
    console.log('activate action');
    firstTime(store, true);
    return authApi.activate(activationToken, {}).then((response) => {
        onLoggin(store, response.token);
    }).catch((err) => {
        if (err) {

        }
    });
}

function onBoardingViewed (store) {
    return authApi.onBoardingViewed();
}

function searchUsers (store, name) {
    if (store.state.user.is_admin) {
        return userApi.searchUsers({ name: name });
    }
}

function resetPassword (store, email) {
    return authApi.resetPassword({ email }).then(() => {
        return Promise.resolve();
    }).catch((err) => {
        return Promise.reject(err);
    });
}

function changePassword (store, { token, data }) {
    return authApi.changePassword(token, data).then(() => {
        router.push({ name: 'login' });
        return Promise.resolve();
    }).catch((err) => {
        if (err) {
            return Promise.reject(err);
        }
    });
}

function register (store, data) {
    return userApi.register(data).then((data) => {
        return Promise.resolve();
    }).catch((err) => {
        return Promise.reject(err);
    });
}

function fetchUser (store) {
    return userApi.show().then((response) => {
        console.log('fetch user', response.data);
        store.commit(types.AUTH_SET_USER, response.data);
    }).catch(({ data, status }) => {
        console.log(data, status);
    });
}

function getConfig (store) {
    localConfig.__isLocal = true;
    store.commit('AUTH_APP_CONFIG', localConfig);
    return authApi.config().then((response) => {
        response.__isLocal = false;
        console.log('Loading config from server: ', response);
        store.commit('AUTH_APP_CONFIG', response);
        return response;
    });
}

function retoken (store) {
    let data = {};
    // data.app_version = store.rootState.appVersion;

    return new Promise((resolve, reject) => {
        authApi.retoken(data).then((response) => {
            console.log('retoken response', response);
            store.commit(types.AUTH_SET_TOKEN, response.token);
            store.commit('AUTH_APP_CONFIG', response.config);
            resolve();
        }).catch(({ data, status }) => {
            // check for internet problems -> not resolve until retoken finish
            console.log(data, status);
            store.commit(types.AUTH_LOGOUT);
            router.push({ name: 'login' });
            resolve();
        });
    });
}

function logout (store) {
    let device = globalStore.state.device.current;
    if (device) {
        globalStore.dispatch('device/delete', device.id);
    }
    store.commit(types.AUTH_LOGOUT);
    globalStore.commit('device/' + types.DEVICE_SET_DEVICES, []);
    globalStore.dispatch('stopThread');
    router.replace({ name: 'trips' });
}

function update (store, data) {
    return userApi.update(data).then((response) => {
        firstTime(store, false);
        store.commit(types.AUTH_SET_USER, response.data);
        return Promise.resolve(response.data);
    }).catch(({ data, status }) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}
function adminUpdate (store, data) {
    return userApi.adminUpdate(data).then((response) => {
        return Promise.resolve(response.data);
    }).catch(({ data, status }) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

function updatePhoto (store, data) {
    return userApi.updatePhoto(data).then((response) => {
        console.log(response);
        store.commit(types.AUTH_SET_USER, response.data);
        return Promise.resolve(response.data);
    }).catch(({ data, status }) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

const actions = {
    login,
    activate,
    register,
    fetchUser,
    retoken,
    logout,
    resetPassword,
    changePassword,
    update,
    updatePhoto,
    onLoggin,
    searchUsers,
    adminUpdate,
    getConfig,
    onBoardingViewed
};

// mutations
const mutations = {
    [types.AUTH_SET_TOKEN] (state, token) {
        state.token = token.replace('"', '');
        state.auth = true;
        cache.setItem(keys.TOKEN_KEY, token);
    },
    [types.AUTH_SET_USER] (state, user) {
        state.user = user;
        cache.setItem(keys.USER_KEY, user);
    },
    [types.AUTH_LOGOUT] (state) {
        state.token = null;
        state.user = null;
        state.auth = false;
        cache.clear();
    },
    [types.AUTH_FIRST_TIME] (state, firstTime) {
        state.firstTime = firstTime;
    },

    AUTH_APP_CONFIG (state, appConfig) {
        state.appConfig = appConfig;
    },

    [types.DONATION_INTENT_PUSH] (state, donation) {
        if (state.user) {
            if (!state.user.donations) {
                state.user.donations = [];
            }
            state.user.donations.push(donation);
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
