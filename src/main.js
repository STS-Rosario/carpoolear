/* jshint esversion: 6 */

let cordovaTag = document.createElement('script');
cordovaTag.setAttribute('src', process.env.ROUTE_BASE + 'cordova.js');
document.head.appendChild(cordovaTag);

import 'babel-polyfill';

import Vue from 'vue';
import App from './App';

import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import VueMoment from 'vue-moment';
require('moment/locale/es');

import router from './router';
import store from './store';

/* eslint-disable no-unused-vars */
import cordova from './cordova';
import directives from './directives';
require('font-awesome-webpack');

import bootstrapCss from './styles/bootstrap/css/bootstrap.min.css';

import cssHelpers from './styles/helpers.css';
import css from './styles/main.css';

import bus from './services/bus-event';

Vue.use(VueResource);

Vue.use(VueAnalytics, {
    id: 'UA-40995702-4'
});

Vue.use(VueMoment);
require('./filters.js');

import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.MAPS_API,
        libraries: 'places',
        installComponents: true
    }
});

window.store = store;
if (process.env.NODE_ENV === 'development') {
    console.log('In development wait for cordova');
    setTimeout(function () {
        if (!window.cordova) {
            console.log('Not running in cordova');
            store.dispatch('init');
        }
    }, 2000);
}

bus.on('system-ready', () => {
    let app = new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App }
    });
});
/* eslint-enable no-unused-vars */
