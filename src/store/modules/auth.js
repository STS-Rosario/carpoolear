import network from '../../services/network'
import * as types from '../mutation-types'
import { Auth } from '../../services/api'

let authApi = new Auth;

// initial state
// shape: [{ id, quantity }]
const state = {
  auth: false,
  user: null,
  token: null,
}

// getters
const getters = {
  checkLogin: state => state.auth,
  authHeader: state => state.auth ? { 'Authorization': 'Bearer ' + state.token } : {},
}

// actions
const actions = {
  login({ commit, state, rootState }, { email, password }) {
    let creds = {}
    if (rootState.cordova && rootState.cordova.deviceId && rootState.cordova.device && rootState.cordova.device.platform) {
      console.log('here');
      creds['device_id'] = rootState.cordova.deviceId;
      creds['device_type'] = rootState.cordova.device.platform;
    }
    creds['app_version'] = rootState.appVersion;
    creds['email'] = email;
    creds['password'] = password;
    creds['password_confirmation'] = password;
    authApi.login(creds).then((token) => {
      commit(types.AUTH_SET_TOKEN);
    }).catch((err) => {
      if (err.response && err.response.data.error === 'invalid_credentials') {
        console.log('Credenciales incorrectas');
      } else {
        console.log(err);
        window.err = err;
      }
    });
  },
  register({ commit, state, rootState }, { email, password, passwordConfirmation, name, sureName, termsAndConditions }) {
    let data = {}
    /* if (rootState.cordova && rootState.cordova.deviceId && rootState.cordova.device && rootState.cordova.device.platform) {
      console.log('here');
      creds['device_id'] = rootState.cordova.deviceId;
      creds['device_type'] = rootState.cordova.device.platform;
    }*/
    data['app_version'] = rootState.appVersion;
    data['email'] = email;
    data['password'] = password;
    data['password_confirmation'] = passwordConfirmation;
    data['name'] = name + sureName;
    data['password'] = password;
    data['terms_and_conditions'] = termsAndConditions;


    authApi.register(data).then((data) => {
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
    /*checkout ({ commit, state }) {
      commit(types.DUMMY_MUTATION)
    },*/
}

// mutations
const mutations = {
  [types.AUTH_SET_TOKEN] (state, token) {
    state.token = token;
  }, 
  [types.AUTH_SET_USER](state, user) {
    state.user = user;
  }, 
  [types.AUTH_LOGOUT](state) {
    state.token = null;
    state.user = null;
    state.auth = false;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
