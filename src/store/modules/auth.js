import network from '../../services/network'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  auth: false
}

// getters
const getters = {
  checkLogin: state => state.auth
}

// actions
const actions = {
  checkout ({ commit, state }) {
    commit(types.DUMMY_MUTATION)
  }
}

// mutations
const mutations = {
  [types.DUMMY_MUTATION] (state) {
    state.auth = !state.auth
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
