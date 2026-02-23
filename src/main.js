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

const debugApi = new DebugApi();
const cordovaTag = document.createElement('script');
const cordovaPath = 'cordova.js';
console.log('ROUTE_BASE', ROUTE_BASE, cordovaPath);
cordovaTag.setAttribute('src', ROUTE_BASE + cordovaPath);
document.head.appendChild(cordovaTag);

const moment = require('moment-timezone');
moment.tz.setDefault('America/Argentina');
require('moment/locale/es');
require('font-awesome-webpack-4');

Vue.use(VueResource);

Vue.use(VueI18n);

// Price format: controlled by config.price_show_cents (default: show cents).
// Set price_show_cents: false in config to hide cents in currency display.
const defaultCurrencyOptions = (fractionDigits = 2) => ({
    style: 'currency',
    currencyDisplay: 'symbol',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
});

// App locale -> Intl (BCP 47) locale for number formatting.
// es-AR: Argentina (comma decimal, period thousands). es-CL: Chile.
const numberFormatLocaleMap = {
    arg: 'es-AR',
    chl: 'es-CL'
};

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
                ...defaultCurrencyOptions(2)
            }
        },
        chl: {
            currency: {
                style: 'currency',
                currency: 'CHL',
                ...defaultCurrencyOptions(2)
            }
        },
        'es-AR': {
            currency: {
                style: 'currency',
                currency: 'ARS',
                ...defaultCurrencyOptions(2)
            }
        },
        'es-CL': {
            currency: {
                style: 'currency',
                currency: 'CLP',
                ...defaultCurrencyOptions(2)
            }
        }
    }
});

// Use correct Intl locale for currency so es-AR gets comma decimal, period thousands.
const original$n = Vue.prototype.$n;
Vue.prototype.$n = function (value, ...args) {
    if (args[0] === 'currency') {
        const intlLocale = numberFormatLocaleMap[this.$i18n.locale] || this.$i18n.locale;
        if (args.length === 1) return this.$i18n.n(value, 'currency', intlLocale);
        if (args.length === 2 && typeof args[1] === 'object') return this.$i18n.n(value, { key: 'currency', locale: intlLocale, ...args[1] });
    }
    return original$n.call(this, value, ...args);
};

function applyPriceFormat(showCents) {
    const fractionDigits = showCents !== false ? 2 : 0;
    const options = defaultCurrencyOptions(fractionDigits);
    const formats = [
        ['arg', 'ARS'],
        ['chl', 'CHL'],
        ['es-AR', 'ARS'],
        ['es-CL', 'CLP']
    ];
    formats.forEach(([locale, currency]) => {
        i18n.mergeNumberFormat(locale, {
            currency: { style: 'currency', currency, ...options }
        });
    });
    console.log('[price-format] applyPriceFormat(showCents=', showCents, ') → fractionDigits=', fractionDigits);
}

store.subscribe((mutation) => {
    const isConfig = mutation.type === 'auth/AUTH_APP_CONFIG' || mutation.type === 'AUTH_APP_CONFIG';
    if (isConfig && mutation.payload) {
        const payload = mutation.payload;
        const showCents = payload.price_show_cents !== false;
        console.log('[price-format] config received. mutation.type=', mutation.type, 'payload.price_show_cents=', payload.price_show_cents, '→ showCents=', showCents);
        console.log('[price-format] full appConfig (relevant):', { price_show_cents: payload.price_show_cents });
        applyPriceFormat(showCents);
    }
});

export { i18n };

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
    const data = {};
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
    const app = new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App },
        i18n
    });

    // Set moment locale based on i18n language
    const momentLocaleMap = {
        arg: 'es',
        chl: 'es',
        en: 'en'
    };
    const currentLocale = i18n.locale || 'arg';
    moment.locale(momentLocaleMap[currentLocale] || 'es');

    // Watch for language changes and update moment locale
    app.$watch('$i18n.locale', (newLocale) => {
        moment.locale(momentLocaleMap[newLocale] || 'es');
    });
});
