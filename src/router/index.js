/*jshint esversion: 6 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes.js';

Vue.use(VueRouter);

export default new VueRouter({
  routes: routes,
  mode: 'history'
});
