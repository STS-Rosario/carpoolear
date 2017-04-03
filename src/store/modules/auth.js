import network from '../../services/network'
import * as types from '../mutation-types'

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
  checkout ({ commit, state }) {
    commit(types.DUMMY_MUTATION)
  },

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
