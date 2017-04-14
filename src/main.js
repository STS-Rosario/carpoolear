/*jshint esversion: 6 */

import Vue from 'vue';
import App from './App';

import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import VueMoment from 'vue-moment';
require('moment/locale/es');

import router from './router';
import store from './store';

import cordova from './cordova';

import font_awesome_css from './styles/font-awesome/css/font-awesome.min.css';

import bootstrap_css from './styles/bootstrap/css/bootstrap.min.css';

import css from './styles/main.css';


Vue.use(VueResource);

Vue.use(VueAnalytics, {
  id: 'UA-40995702-4'
});

Vue.use(VueMoment);

/* eslint-disable no-unused-vars */
let app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});


/* Just for debuggin */
window.Vue = Vue;
window.store = store; 


