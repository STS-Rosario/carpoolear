import { defineStore } from 'pinia';
import cache, { keys } from '../services/cache';
import bus from '../services/bus-event';
import { Thread, stopThreads } from '../classes/Threads';

export const useRootStore = defineStore('root', {
    state: () => ({
        appVersion: 3,
        /** { version, versionSource: 'real'|'fallback', platform: 'android'|'ios'|'web' } from Capacitor/AppUpdate or fallback */
        appVersionInfo: null
    }),

    actions: {
        setAppVersionInfo(payload) {
            this.appVersionInfo = payload;
        },

        async init() {
            console.log('Starting app.');

            const { useAuthStore } = await import('./auth');
            const { useDeviceStore } = await import('./device');
            const authStore = useAuthStore();
            const deviceStore = useDeviceStore();

            const promises = [];
            const loadStateMap = [
                {
                    key: keys.TOKEN_KEY,
                    apply: (value) => { if (value) authStore.setToken(value); }
                },
                {
                    key: keys.USER_KEY,
                    apply: (value) => { if (value) authStore.setUser(value); }
                },
                {
                    key: keys.DEVICE_KEY,
                    apply: (value) => { if (value) deviceStore.setCurrentDevice(value); }
                },
                {
                    key: keys.FIRST_TIME_APP_KEY,
                    apply: (value) => { if (value) deviceStore.setFirstTimeAppOpen(value); }
                }
            ];

            loadStateMap.forEach((obj) => {
                const p = new Promise((resolve, reject) => {
                    cache
                        .getItem(obj.key)
                        .then((value) => {
                            obj.apply(value);
                            resolve();
                        })
                        .catch(() => {
                            resolve();
                        });
                });
                promises.push(p);
            });

            return Promise.all(promises).then(() => {
                console.log('State loaded from cache.');
                if (authStore.token) {
                    authStore.retoken().then(() => this.startApp());
                } else {
                    this.startApp();
                }
            });
        },

        async startApp() {
            const { useAuthStore } = await import('./auth');
            const { useTripsStore } = await import('./trips');
            const { useMyTripsStore } = await import('./myTrips');
            const { usePassengerStore } = await import('./passenger');
            const { useDeviceStore } = await import('./device');
            const { useCordovaStore } = await import('./cordova');

            const authStore = useAuthStore();
            const tripsStore = useTripsStore();
            const myTripsStore = useMyTripsStore();
            const passengerStore = usePassengerStore();
            const deviceStore = useDeviceStore();
            const cordovaStore = useCordovaStore();

            // Lazy require to avoid circular dependency
            let ratesStore, carsStore;
            try {
                const { useRatesStore } = await import('./rates');
                ratesStore = useRatesStore();
            } catch (e) { /* optional */ }
            try {
                const { useCarsStore } = await import('./car');
                carsStore = useCarsStore();
            } catch (e) { /* optional */ }

            tripsStore.tripsSearch({ is_passenger: false });
            if (authStore.auth) {
                authStore.fetchUser();
                myTripsStore.tripAsDriver();
                myTripsStore.tripAsPassenger();
                if (ratesStore) ratesStore.pendingRatesAction();
                passengerStore.getPendingRequest();
                if (carsStore) carsStore.index();
                this.startThread();
                if (cordovaStore.device) {
                    deviceStore.update();
                }
            }
            deviceStore.resize();

            bus.emit('system-ready');
        },

        async getTrip(id) {
            const { useTripsStore } = await import('./trips');
            const { useMyTripsStore } = await import('./myTrips');
            const { TripApi } = await import('../services/api');
            
            const tripsApi = new TripApi();
            const tripsStore = useTripsStore();
            const myTripsStore = useMyTripsStore();

            const trips = tripsStore.trips;
            if (trips) {
                for (let i = 0; i < trips.length; i++) {
                    if (trips[i].id === id) {
                        tripsStore.setCurrentTrip(trips[i]);
                        break;
                    }
                }
            }

            const driverTrips = myTripsStore.driver_trip;
            if (driverTrips) {
                for (let i = 0; i < driverTrips.length; i++) {
                    if (driverTrips[i].id === id) {
                        tripsStore.setCurrentTrip(driverTrips[i]);
                        break;
                    }
                }
            }

            const passengerTrips = myTripsStore.passenger_trip;
            if (passengerTrips) {
                for (let i = 0; i < passengerTrips.length; i++) {
                    if (passengerTrips[i].id === id) {
                        tripsStore.setCurrentTrip(passengerTrips[i]);
                        break;
                    }
                }
            }

            return tripsApi.show(id).then((response) => {
                tripsStore.setCurrentTrip(response.data);
                return Promise.resolve(response.data);
            });
        },

        async startThread() {
            const { useAuthStore } = await import('./auth');
            const { useNotificationsStore } = await import('./notifications');
            const authStore = useAuthStore();
            const notificationsStore = useNotificationsStore();

            const config = authStore.appConfig;
            if (
                config.web_push_notification &&
                window.Notification.permission === 'granted'
            ) {
                return;
            }

            const fn = function () {
                notificationsStore.countAction();
            };
            const th = new Thread(fn, 'NOTIFICATIONS');
            th.run(30000, true);
        },

        stopThread() {
            stopThreads('NOTIFICATIONS');
        }
    }
});
