import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerDirectives } from './directives';
import { i18n } from './i18n';
import bus from './services/bus-event';
import { DebugApi } from './services/api';
import {
    cssvar,
    scrollToElement,
    checkError,
    getErrors
} from '../utils/helpers';

// Styles
import './styles/bootstrap/css/bootstrap.min.css';
import './styles/helpers.css';
import './styles/main.css';
import 'font-awesome/css/font-awesome.min.css';

// Capacitor plugins
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Moment timezone setup
import moment from 'moment-timezone';
moment.tz.setDefault('America/Argentina');
import 'moment/locale/es';

// Store imports
import { useAuthStore } from './stores/auth';
import { useTripsStore } from './stores/trips';
import { useMyTripsStore } from './stores/myTrips';
import { useRatesStore } from './stores/rates';
import { usePassengerStore } from './stores/passenger';
import { useCarsStore } from './stores/cars';
import { useCordovaStore } from './stores/cordova';
import { useDeviceStore } from './stores/device';
import { useNotificationsStore } from './stores/notifications';
import { initApp, startApp, startThread, onLoggin } from './stores/index';

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';

const debugApi = new DebugApi();

// Cordova script injection (for mobile builds)
const cordovaTag = document.createElement('script');
const cordovaPath = 'cordova.js';
cordovaTag.setAttribute('src', ROUTE_BASE + cordovaPath);
document.head.appendChild(cordovaTag);

// i18n is imported from src/i18n.js (breaks circular import with router)

// Capacitor initialization
const initializeCapacitorPlugins = async () => {
    try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        await StatusBar.setOverlaysWebView({ overlay: false });

        setTimeout(async () => {
            await SplashScreen.hide();
        }, 1000);

        await initializePushNotifications();
        console.log('Capacitor plugins initialized');
    } catch (error) {
        console.log('Capacitor plugins not available (running in browser):', error);
    }
};

const initializePushNotifications = async () => {
    try {
        const { Capacitor } = await import('@capacitor/core');

        if (Capacitor.isNativePlatform()) {
            const { PushNotifications } = await import('@capacitor/push-notifications');

            const result = await PushNotifications.requestPermissions();

            if (result.receive === 'granted') {
                await PushNotifications.register();

                PushNotifications.addListener('registration', (token) => {
                    console.log('Push registration token:', token.value);
                });

                PushNotifications.addListener('registrationError', (error) => {});
                PushNotifications.addListener('pushNotificationReceived', (notification) => {});
                PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {});
            }
        }
    } catch (error) {
        console.error('Push notification initialization error:', error);
    }
};

initializeCapacitorPlugins();

// Create app
const pinia = createPinia();

// Initialize stores and start app
const initStores = async () => {
    const authStore = useAuthStore();
    const tripsStore = useTripsStore();
    const myTripsStore = useMyTripsStore();
    const ratesStore = useRatesStore();
    const passengerStore = usePassengerStore();
    const carsStore = useCarsStore();
    const cordovaStore = useCordovaStore();
    const deviceStore = useDeviceStore();
    const notificationsStore = useNotificationsStore();

    if (import.meta.env.VITE_ROUTE_BASE) {
        console.log('Not running in cordova.');
        await initApp(authStore, deviceStore, cordovaStore);
        startApp(authStore, tripsStore, myTripsStore, ratesStore, passengerStore, carsStore, cordovaStore, deviceStore, notificationsStore);
    } else {
        setTimeout(async function () {
            if (!window.cordova) {
                console.log('Not running in cordova.');
                await initApp(authStore, deviceStore, cordovaStore);
                startApp(authStore, tripsStore, myTripsStore, ratesStore, passengerStore, carsStore, cordovaStore, deviceStore, notificationsStore);
            }
        }, 2000);
    }

    // Start notification thread after login
    bus.on('system-ready', () => {
        if (authStore.auth) {
            startThread(authStore, notificationsStore);
        }
    });

    // Handle social login from cordova store
    bus.on('social-login', (token) => {
        onLoggin(token, authStore, tripsStore, myTripsStore, ratesStore, carsStore, passengerStore, cordovaStore, deviceStore, router, notificationsStore);
    });
};

console.log('APP NAME: ' + import.meta.env.VITE_TARGET_APP);

bus.on('system-ready', () => {
    const app = createApp(App);

    app.use(pinia);
    app.use(router);
    app.use(i18n);

    // Register directives
    registerDirectives(app);

    // Global properties (replacing Vue.prototype)
    app.config.globalProperties.$cssvar = cssvar;
    app.config.globalProperties.$scrollToElement = scrollToElement;
    app.config.globalProperties.$checkError = checkError;
    app.config.globalProperties.$getErrors = getErrors;
    app.config.globalProperties.$moment = moment;

    // Error handler
    app.config.errorHandler = function (err, vm, info) {
        const data = {};
        data.log = err.stack;
        debugApi.log(data);
    };

    app.mount('#app');

    // Set moment locale
    const momentLocaleMap = { arg: 'es', chl: 'es', en: 'en' };
    const currentLocale = i18n.global.locale.value || 'arg';
    moment.locale(momentLocaleMap[currentLocale] || 'es');
});

// Pinia must be installed before stores can be used
// We create a temporary app just to install pinia, then use stores
const tempApp = createApp({ render: () => null });
tempApp.use(pinia);

// Now initialize stores (pinia is installed)
initStores();
