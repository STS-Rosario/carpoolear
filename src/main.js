import Vue from 'vue'
import App from './App'
 
import VueResource from 'vue-resource' 
import router from './router'
import store from './store'


import css from './styles/main.css';
 
Vue.use(VueResource)
 

/* eslint-disable no-unused-vars */

var app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
 
window.Vue = Vue;