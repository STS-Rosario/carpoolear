/* jshint esversion: 6 */

import 'babel-polyfill';

import Vue from 'vue';
import App from './App';

import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import VueMoment from 'vue-moment';

import router from './router';
import store from './store';

/* eslint-disable no-unused-vars */
import cordova from './cordova';
import directives from './directives';

import bootstrapCss from './styles/bootstrap/css/bootstrap.min.css';

import cssHelpers from './styles/helpers';
import css from './styles/main';

import VueI18n from 'vue-i18n';
import messages from './language/i18n';

import bus from './services/bus-event';
import { DebugApi } from './services/api';

import Vue2Leaflet from 'vue2-leaflet';

import * as VueGoogleMaps from 'vue2-google-maps';

let debugApi = new DebugApi();
let cordovaTag = document.createElement('script');
cordovaTag.setAttribute('src', process.env.ROUTE_BASE + 'cordova.js');
document.head.appendChild(cordovaTag);

var moment = require('moment-timezone');
moment.tz.setDefault('America/Argentina');
require('moment/locale/es');
require('font-awesome-webpack-4');

Vue.use(VueResource);

Vue.use(VueI18n);
const i18n = new VueI18n({ locale: 'arg', fallbackLocale: 'arg', messages });

Vue.use(VueAnalytics, {
    id: 'UA-40995702-4'
});

Vue.use(VueMoment);
require('./filters.js');

/* import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.MAPS_API,
        libraries: 'places',
        installComponents: true
    }
}); */

Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` is a Vue-specific error info, e.g. which lifecycle hook
    // the error was found in. Only available in 2.2.0+
    let data = {};
    data.log = err.stack;
    debugApi.log(data);
};
window.store = store;
if (process.env.SERVE) {
    console.log('Not running in cordova');
    store.dispatch('init');
} else {
    if (process.env.NODE_ENV === 'development') {
        console.log('In development wait for cordova');
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova');
                store.dispatch('init');
            }
        }, 2000);
    } else {
        console.log('no process at all');
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova');
                store.dispatch('init');
            }
        }, 2000);
    }
}
console.log('TARGET_APP', process.env.TARGET_APP);

bus.on('system-ready', () => {
    let app = new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App },
        i18n
    });
});
/* eslint-enable no-unused-vars */
