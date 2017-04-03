import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import cordova from './cordova'

import css from './styles/main.css'

/* eslint-disable no-unused-vars */
let app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

/* Just for debuggin */
window.Vue = Vue
window.store = store

