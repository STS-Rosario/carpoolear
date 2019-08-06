import * as types from './mutation-types';
import cache, { keys } from '../services/cache';
import bus from '../services/bus-event';
import { TripApi } from '../services/api';
import { Thread, stopThreads } from '../classes/Threads';

let tripsApi = new TripApi();

export const init = (store) => {
    console.log('starting application');

    let promises = [];
    let loadStateMap = [
        {
            key: keys.TOKEN_KEY,
            mutation: 'auth/' + types.AUTH_SET_TOKEN
        },
        {
            key: keys.USER_KEY,
            mutation: 'auth/' + types.AUTH_SET_USER
        },
        {
            key: keys.DEVICE_KEY,
            mutation: 'device/' + types.DEVICE_SET_CURRENT_DEVICE
        }
    ];

    loadStateMap.forEach(obj => {
        var p = new Promise((resolve, reject) => {
            cache.getItem(obj.key).then((value) => {
                // console.log(value);
                store.commit(obj.mutation, value);
                resolve();
            }).catch(() => {
                resolve();
            });
        });
        promises.push(p);
    });

    return Promise.all(promises).then(() => {
        console.log('State loaded from cache');
        if (store.state.auth.token) {
            store.dispatch('auth/retoken').then(() => startApp(store));
        } else {
            startApp(store);
        }
    });
};

export const startApp = (store) => {
    store.dispatch('trips/tripsSearch', { is_passenger: false });
    if (store.state.auth.auth) {
        store.dispatch('auth/fetchUser');
        store.dispatch('myTrips/tripAsDriver');
        store.dispatch('myTrips/tripAsPassenger');
        store.dispatch('rates/pendingRates');
        store.dispatch('passenger/getPendingRequest');
        store.dispatch('cars/index');
        store.dispatch('startThread');
        if (store.state.cordova.device) {
            store.dispatch('device/update');
        }
    }
    store.dispatch('device/resize');

    bus.emit('system-ready');
};

export const getTrip = (store, id) => {
    let trips = store.getters['trips/trips'];
    if (trips) {
        for (let i = 0; i < trips.length; i++) {
            if (trips[i].id === id) {
                store.commit('trips/' + types.TRIPS_SET_CURRENT, trips[i]);
                break;
                // return Promise.resolve(trips[i]);
            }
        }
    }

    let myTrips = store.state.myTrips.driver_trip;
    if (myTrips) {
        for (let i = 0; i < myTrips.length; i++) {
            if (myTrips[i].id === id) {
                store.commit('trips/' + types.TRIPS_SET_CURRENT, myTrips[i]);
                break;
                // return Promise.resolve(myTrips[i]);
            }
        }
    }

    myTrips = store.state.myTrips.passenger_trip;
    if (myTrips) {
        for (let i = 0; i < myTrips.length; i++) {
            if (myTrips[i].id === id) {
                store.commit('trips/' + types.TRIPS_SET_CURRENT, myTrips[i]);
                break;
                // return Promise.resolve(myTrips[i]);
            }
        }
    }

    return tripsApi.show(id).then(response => {
        store.commit('trips/' + types.TRIPS_SET_CURRENT, response.data);
        return Promise.resolve(response.data);
    });
};

export const startThread = (store) => {
    let fn = function () {
        store.dispatch('notifications/count');
    };
    let th = new Thread(fn, 'NOTIFICATIONS');
    th.run(30000, true);
};

export const stopThread = (store) => {
    stopThreads('NOTIFICATIONS');
};
