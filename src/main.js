import Vue from 'vue'
import App from './App'
import Hello from './Components/Hello'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import Services from './Services'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Services)

var router = new VueRouter({
  routes: [
    { 
      path: '/hello', 
      component: Hello, 
      beforeEnter: (to, from, next) => {
        if (1 === 2) {
          next()
        } else {
          next("/")
        }
      }
    }
  ]
})

// Any invalid route will redirect to home
/* router.redirect({
  '*': '/hello'
}) */

/* eslint-disable no-unused-vars */

var app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
 
window.Vue = Vue;