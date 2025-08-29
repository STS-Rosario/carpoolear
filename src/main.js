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

// Capacitor plugins
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app';

import Vue2Leaflet from 'vue2-leaflet';

import * as VueGoogleMaps from 'vue2-google-maps';

const ROUTE_BASE = process.env.ROUTE_BASE;

let debugApi = new DebugApi();
let cordovaTag = document.createElement('script');
let cordovaPath = 'cordova.js';
console.log('ROUTE_BASE', ROUTE_BASE, cordovaPath);
cordovaTag.setAttribute('src', ROUTE_BASE + cordovaPath);
document.head.appendChild(cordovaTag);

var moment = require('moment-timezone');
moment.tz.setDefault('America/Argentina');
require('moment/locale/es');
require('font-awesome-webpack-4');

Vue.use(VueResource);

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'arg',
    fallbackLocale: 'arg',
    messages,
    silentFallbackWarn: true,
    numberFormats: {
        arg: {
            currency: {
                style: 'currency',
                currency: 'ARS',
                currencyDisplay: 'symbol'
            }
        },
        chl: {
            currency: {
                style: 'currency',
                currency: 'CHL',
                currencyDisplay: 'symbol'
            }
        }
    }
});

Vue.use(VueAnalytics, {
    id: 'UA-40995702-4'
});

Vue.use(VueMoment);
require('./filters.js');
require('./prototypes.js');

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

// Initialize Capacitor plugins
const initializeCapacitorPlugins = async () => {
    try {
        // Configure StatusBar to fix overlay issues
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        await StatusBar.setOverlaysWebView({ overlay: false });
        
        // Hide splash screen after app loads
        setTimeout(async () => {
            await SplashScreen.hide();
        }, 1000);
        
        // Initialize push notifications directly here
        await initializePushNotifications();
        
        console.log('Capacitor plugins initialized');
    } catch (error) {
        console.log('Capacitor plugins not available (running in browser):', error);
    }
};

// Direct push notification initialization
const initializePushNotifications = async () => {
    try {
        const { Capacitor } = await import('@capacitor/core');
        
        
        if (Capacitor.isNativePlatform()) {
            const { PushNotifications } = await import('@capacitor/push-notifications');
            
            const result = await PushNotifications.requestPermissions();
            
            if (result.receive === 'granted') {
                await PushNotifications.register();
                
                // Listen for registration success
                PushNotifications.addListener('registration', (token) => {
                    console.log('Push registration token:', token.value);
                });
                
                // Listen for registration errors
                PushNotifications.addListener('registrationError', (error) => {
                });
                
                // Listen for incoming push notifications
                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                });
                
                // Listen for notification tap
                PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                });
            } else {
            }
        } else {
        }
    } catch (error) {
        console.error('Push notification initialization error:', error);
    }
};

// Initialize plugins when app is ready
initializeCapacitorPlugins();

window.store = store;
if (process.env.SERVE) {
    console.log('Not running in cordova.');
    store.dispatch('init');
} else {
    if (process.env.NODE_ENV === 'development') {
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova.');
                store.dispatch('init');
            }
        }, 2000);
    } else {
        console.log('no process at all', process.env.NODE_ENV);
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova.');
                store.dispatch('init');
            }
        }, 2000);
    }
}
console.log('APP NAME: ' + process.env.TARGET_APP);

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
