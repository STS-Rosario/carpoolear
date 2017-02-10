import * as types from '../mutation-types'

// initial state
const state = {
  deviceReady: false,
  deviceOnline: false,
  device: null
}

// getters
const getters = {
  device: state => state.device,
  networkState: state => state.deviceOnline,
  deviceReady: state => state.deviceReady
}

// actions
const actions = {

}

// mutations
const mutations = {
  [types.CORDOVA_DEVICEREADY] (state) {
    state.deviceReady = true
  },
  [types.CORDOVA_ONLINE] (state) {
    state.deviceOnline = true
  },
  [types.CORDOVA_OFFLINE] (state) {
    state.deviceOnline = false
  },
  [types.CORDOVA_SET_DEVICE] (state, device) {
    state.device = device
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
