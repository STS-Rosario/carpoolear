import network from '../../services/network'
import * as types from '../mutation-types'
import { AuthApi, UserApi } from '../../services/api'
import router from '../../router';
import cache, {keys} from '../../services/cache' 

let authApi = new AuthApi;
let userApi = new UserApi;

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

  login({ commit, state, rootState, rootGetters }, { email, password }) {
    let creds = {}
    Object.assign(creds, rootGetters['cordova/deviceData']);
    creds.email = email;
    creds.password = password;
    creds.password_confirmation = password;

    return authApi.login(creds).then((token) => {
      commit(types.AUTH_SET_TOKEN);
    }).catch( ({data, status}) => { 
        console.log(data, status);  
    });
  },

  activate({ commit, state, rootState, rootGetters }, activationToken) {
    let creds = {}
    Object.assign(creds, rootGetters['cordova/deviceData']);

    return authApi.activate(activationToken, creds).then((token) => {
      commit(types.AUTH_SET_TOKEN);
      router.push({ name: 'trips' });
    }).catch((err) => { 

    });
  },

  register({ commit, state, rootState, rootGetters }, { email, password, passwordConfirmation, name, termsAndConditions }) {
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
  },

  user({state}) {

  }

}

// mutations
const mutations = {
  [types.AUTH_SET_TOKEN] (state, token) {
    state.token = token;
    cache.setItem(keys.TOKEN_KEY, token);
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
