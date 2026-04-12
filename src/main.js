/* jshint esversion: 6 */

import 'core-js/stable';

import { createApp } from 'vue';
import App from './App';

import dayjs from './dayjs';

import router from './router';
import pinia from './pinia';

import { useRootStore } from './stores/root';
import { useAuthStore } from './stores/auth';

/* eslint-disable no-unused-vars */
import './cordova';
import { registerDirectives } from './directives';

import './styles/bootstrap/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './styles/helpers.css';
import './styles/main.css';

import i18n, {
    appLocaleToBCP47,
    appLocaleToRoutingLanguage,
    applyPriceFormat
} from './i18n';

import { createHead } from '@unhead/vue/client';

import bus from './services/bus-event';
import { DebugApi } from './services/api';
import { init as initDebugLogger } from './services/debug';
import { installPrototypes } from './prototypes';

// Capacitor plugins
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app';

// Re-export locale maps so existing imports from '../../main' still work
export { appLocaleToBCP47, appLocaleToRoutingLanguage };

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '';

const debugApi = new DebugApi();

// Initialize debug logger: clear logs on app init, patch console if debug mode enabled
initDebugLogger();

const cordovaTag = document.createElement('script');
const cordovaPath = 'cordova.js';
console.log('ROUTE_BASE', ROUTE_BASE, cordovaPath);
cordovaTag.setAttribute('src', ROUTE_BASE + cordovaPath);
document.head.appendChild(cordovaTag);

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
        console.log(
            'Capacitor plugins not available (running in browser):',
            error
        );
    }
};

// Direct push notification initialization
const initializePushNotifications = async () => {
    try {
        const { Capacitor } = await import('@capacitor/core');

        if (Capacitor.isNativePlatform()) {
            const { PushNotifications } = await import(
                '@capacitor/push-notifications'
            );

            const result = await PushNotifications.requestPermissions();

            if (result.receive === 'granted') {
                await PushNotifications.register();

                // Listen for registration success
                PushNotifications.addListener('registration', (token) => {
                    console.log('Push registration token:', token.value);
                });

                // Listen for registration errors
                PushNotifications.addListener(
                    'registrationError',
                    () => {
                        return undefined;
                    }
                );

                // Listen for incoming push notifications
                PushNotifications.addListener(
                    'pushNotificationReceived',
                    () => {
                        return undefined;
                    }
                );

                // Listen for notification tap
                PushNotifications.addListener(
                    'pushNotificationActionPerformed',
                    () => {
                        return undefined;
                    }
                );
            }
        }
    } catch (error) {
        console.error('Push notification initialization error:', error);
    }
};

// Initialize plugins when app is ready
initializeCapacitorPlugins();

if (import.meta.env.VITE_SERVE) {
    console.log('Not running in cordova.');
    useRootStore().init();
} else {
    if (import.meta.env.DEV) {
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova.');
                useRootStore().init();
            }
        }, 2000);
    } else {
        console.log('no process at all', import.meta.env.PROD);
        setTimeout(function () {
            if (!window.cordova) {
                console.log('Not running in cordova.');
                useRootStore().init();
            }
        }, 2000);
    }
}
console.log('APP NAME: ' + import.meta.env.VITE_TARGET_APP);

bus.on('system-ready', () => {
    const app = createApp(App);
    app.use(router);
    app.use(pinia);
    app.use(i18n);
    app.use(createHead());

    // Install prototypes as globalProperties
    installPrototypes(app);

    // Register global directives
    registerDirectives(app);

    // Use correct Intl locale for currency so es-AR gets comma decimal, period thousands.
    const numberFormatLocaleMap = appLocaleToBCP47;
    const original$n = app.config.globalProperties.$n;
    app.config.globalProperties.$n = function (value, ...args) {
        if (args[0] === 'currency') {
            const intlLocale =
                numberFormatLocaleMap[this.$i18n.locale] || this.$i18n.locale;
            if (args.length === 1) { return this.$i18n.n(value, 'currency', intlLocale); }
            if (args.length === 2 && typeof args[1] === 'object') {
                return this.$i18n.n(value, {
                    key: 'currency',
                    locale: intlLocale,
                    ...args[1]
                });
            }
        }
        return original$n.call(this, value, ...args);
    };

    app.config.errorHandler = function (err, instance, info) {
        const data = {};
        data.log = err.stack;
        debugApi.log(data);
    };

    const vm = app.mount('#app');

    // Subscribe to auth store config changes for price formatting
    const authStore = useAuthStore();
    authStore.$subscribe((mutation, state) => {
        if (state.appConfig) {
            const showCents = state.appConfig.price_show_cents !== false;
            applyPriceFormat(showCents);
        }
    });

    // Set dayjs locale based on i18n language
    const dayjsLocaleMap = {
        arg: 'es',
        chl: 'es',
        en: 'en'
    };
    const currentLocale = i18n.global.locale || 'arg';
    dayjs.locale(dayjsLocaleMap[currentLocale] || 'es');

    // Watch for language changes and update dayjs locale
    vm.$watch('$i18n.locale', (newLocale) => {
        dayjs.locale(dayjsLocaleMap[newLocale] || 'es');
    });
});
