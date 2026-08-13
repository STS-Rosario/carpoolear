/* jshint esversion: 6 */

import 'core-js/stable';

import { createApp } from 'vue';
import App from './App';
import { Capacitor } from '@capacitor/core';

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

const debugApi = new DebugApi();

// Initialize debug logger: clear logs on app init, patch console if debug mode enabled
initDebugLogger();

// Initialize Capacitor plugins
const initializeCapacitorPlugins = async () => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    // iOS: header paints under the notch. Android: keep content below the status bar.
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#1E5F9E' });
    await StatusBar.setOverlaysWebView({
        overlay: Capacitor.getPlatform() === 'ios'
    });

    // Hide splash screen after app loads
    setTimeout(async () => {
        await SplashScreen.hide();
    }, 1000);
};

// Initialize plugins when app is ready
initializeCapacitorPlugins();

if (import.meta.env.VITE_SERVE) {
    useRootStore().init();
} else {
    if (import.meta.env.DEV) {
        setTimeout(function () {
            if (!window.cordova) {
                useRootStore().init();
            }
        }, 2000);
    } else {
        setTimeout(function () {
            if (!window.cordova) {
                useRootStore().init();
            }
        }, 2000);
    }
}

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

    // Public assets live in publicDir (static/) → served as {base}img/... (see vite.config publicDir)
    const assetBase = import.meta.env.BASE_URL;
    app.config.globalProperties.$publicImg = (filename) =>
        `${assetBase}img/${String(filename).replace(/^\/+/, '')}`;

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
