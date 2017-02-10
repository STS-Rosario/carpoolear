import * as types from '../mutation-types'

// initial state
const state = {
  deviceReady: false,
  deviceOnline: false,
  device: null,
  deviceId: null
}

// getters
const getters = {
  device: state => state.device,
  networkState: state => state.deviceOnline,
  deviceReady: state => state.deviceReady,
  deviceId: state => state.deviceId
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
  },
  [types.CORDOVA_DEVICE_REGISTER] (state, id) { 
    state.deviceId = id
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
