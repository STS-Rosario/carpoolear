import * as types from '../mutation-types';
import { AuthApi, UserApi } from '../../services/api';
import router from '../../router';
import cache, {keys} from '../../services/cache';

import globalStore from '../index';

let authApi = new AuthApi();
let userApi = new UserApi();

// initial state
// shape: [{ id, quantity }]
const state = {
    auth: false,
    user: null,
    token: null
};

// getters
const getters = {
    checkLogin: state => state.auth,
    authHeader: state => state.auth ? { 'Authorization': 'Bearer ' + state.token } : {},
    user: state => state.user
};

// actions

function login (store, { email, password }) {
    let creds = {};
    creds.email = email;
    creds.password = password;

    return authApi.login(creds).then((response) => {
        store.commit(types.AUTH_SET_TOKEN, response.token);
        fetchUser(store);
        globalStore.dispatch('device/register');
        router.push({ name: 'trips' });
    }).catch(({data, status}) => {
        console.log(data, status);
    });
}

// store = { commit, state, rootState, rootGetters }
function activate (store, activationToken) {
    return authApi.activate(activationToken, {}).then((token) => {
        store.commit(types.AUTH_SET_TOKEN, token);
        fetchUser(store);
        globalStore.dispatch('device/register');
        router.push({ name: 'trips' });
    }).catch((err) => {
        if (err) {

        }
    });
}

function register (store, { email, password, passwordConfirmation, name, termsAndConditions }) {
    let data = {};
    data.email = email;
    data.password = password;
    data.password_confirmation = passwordConfirmation;
    data.name = name;
    data.password = password;
    data.terms_and_conditions = termsAndConditions;

    return userApi.register(data).then((data) => {
        console.log(data);
    }).catch((err) => {
        if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else {
            console.log(err.message);
        }
    });
}

function fetchUser (store) {
    return userApi.show().then((user) => {
        store.commit(types.AUTH_SET_USER, user);
    }).catch(({data, status}) => {
        console.log(data, status);
    });
}

function retoken (store) {
    let data = {};
    data.app_version = store.rootState.appVersion;

    return authApi.retoken(data).then((response) => {
        store.commit(types.AUTH_SET_TOKEN, response.token);
        fetchUser(store);
        router.push({ name: 'trips' });
    }).catch(({data, status}) => {
        // check for no internet problems
        console.log(data, status);
        store.commit(types.AUTH_LOGOUT);
        router.push({ name: 'login' });
    });
}

const actions = {
    login,
    activate,
    register,
    fetchUser,
    retoken
};

// mutations
const mutations = {
    [types.AUTH_SET_TOKEN] (state, token) {
        state.token = token;
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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
