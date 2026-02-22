// Root-level store actions that coordinate between stores
import cache, { keys } from '../services/cache';
import bus from '../services/bus-event';
import { TripApi } from '../services/api';
import { Thread, stopThreads } from '../classes/Threads';

const tripsApi = new TripApi();

export async function initApp(authStore, deviceStore, cordovaStore) {
    console.log('Starting app.');

    const loadStateMap = [
        { key: keys.TOKEN_KEY, setter: (val) => { if (val) authStore.setToken(val); } },
        { key: keys.USER_KEY, setter: (val) => { if (val) authStore.setUser(val); } },
        { key: keys.DEVICE_KEY, setter: (val) => { if (val) deviceStore.setCurrentDevice(val); } },
        { key: keys.FIRST_TIME_APP_KEY, setter: (val) => { if (val) deviceStore.setFirstTimeAppOpen(val); } }
    ];

    const promises = loadStateMap.map((obj) =>
        cache.getItem(obj.key)
            .then((value) => obj.setter(value))
            .catch(() => {})
    );

    await Promise.all(promises);
    console.log('State loaded from cache.');

    if (authStore.token) {
        await authStore.retoken();
    }
}

export function startApp(authStore, tripsStore, myTripsStore, ratesStore, passengerStore, carsStore, cordovaStore, deviceStore, notificationsStore) {
    tripsStore.tripsSearch({ is_passenger: false });
    if (authStore.auth) {
        authStore.fetchUser();
        myTripsStore.tripAsDriver();
        myTripsStore.tripAsPassenger();
        ratesStore.fetchPendingRates();
        passengerStore.getPendingRequest();
        carsStore.index();
        startThread(authStore, notificationsStore);
        if (cordovaStore.device) {
            deviceStore.update();
        }
    }
    deviceStore.resize();
    bus.emit('system-ready');
}

export function onLoggin(token, authStore, tripsStore, myTripsStore, ratesStore, carsStore, passengerStore, cordovaStore, deviceStore, router, notificationsStore) {
    authStore.setToken(token);
    authStore.fetchUser();
    if (cordovaStore.device) {
        deviceStore.register();
    }
    tripsStore.tripsSearch({ is_passenger: false });
    myTripsStore.tripAsDriver();
    myTripsStore.tripAsPassenger();
    ratesStore.fetchPendingRates();
    carsStore.index();
    passengerStore.getPendingRequest();
    startThread(authStore, notificationsStore);
    if (authStore.firstTime) {
        router.replace({ name: 'profile_update' });
    } else {
        if (router.rememberRoute) {
            router.push(router.rememberRoute);
            router.rememberRoute = null;
        } else {
            router.replace({ name: 'trips' });
        }
    }
}

export function getTrip(tripsStore, myTripsStore, id) {
    const trips = tripsStore.trips;
    if (trips) {
        for (let i = 0; i < trips.length; i++) {
            if (trips[i].id === id) {
                tripsStore.setCurrentTrip(trips[i]);
                break;
            }
        }
    }

    const driverTrips = myTripsStore.driverTrips;
    if (driverTrips) {
        for (let i = 0; i < driverTrips.length; i++) {
            if (driverTrips[i].id === id) {
                tripsStore.setCurrentTrip(driverTrips[i]);
                break;
            }
        }
    }

    const passengerTrips = myTripsStore.passengerTrips;
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
}

let notificationThread = null;

export function startThread(authStore, notificationsStore) {
    // If notificationsStore wasn't passed, we need it but can't get it here
    // This will be called from main.js with the proper store
    if (!notificationsStore) return;

    const config = authStore.appConfig;
    if (
        config &&
        config.web_push_notification &&
        window.Notification &&
        window.Notification.permission === 'granted'
    ) {
        return;
    }

    const fn = function () {
        notificationsStore.fetchCount();
    };
    notificationThread = new Thread(fn, 'NOTIFICATIONS');
    notificationThread.run(30000, true);
}

export function stopThread() {
    stopThreads('NOTIFICATIONS');
}
