import { TripApi, RateApi } from '../../services/api';
import * as types from '../mutation-types';

let tripsApi = new TripApi();
let rateApi = new RateApi();

// initial state
const state = {
    driver_trip: null,
    passenger_trip: null,
    driver_old_trips: null,
    passenger_old_trips: null
};

// getters
const getters = {
    myTrips: state => state.driver_trip,
    passengerTrips: state => state.passenger_trip,
    pendingRates: state => state.pending_rates,
    myOldTrips: state => state.driver_old_trips,
    passengerOldTrips: state => state.passenger_old_trips
};

// actions
const actions = {
    tripAsDriver (store, data) {
        return tripsApi.myTrips(true).then(response => {
            store.commit(types.MYTRIPS_SET_DRIVER_TRIPS, response.data);
        });
    },

    tripAsPassenger (store, data) {
        return tripsApi.myTrips(false).then(response => {
            store.commit(types.MYTRIPS_SET_PASSENGER_TRIPS, response.data);
        });
    },

    pendingRates (store) {
        return rateApi.pending(null).then(response => {
            store.commit(types.MYTRIPS_SET_PENDING_RATES, response.data);
        });
    },

    oldTripsAsDriver (store, data) {
        return tripsApi.myOldTrips(true).then(response => {
            store.commit(types.MYTRIPS_SET_DRIVER_TRIPS_OLD, response.data);
        });
    },

    oldTripsAsPassenger (store, data) {
        return tripsApi.myOldTrips(false).then(response => {
            store.commit(types.MYTRIPS_SET_PASSENGER_TRIPS_OLD, response.data);
        });
    }
};

// mutations
const mutations = {
    [types.MYTRIPS_SET_DRIVER_TRIPS] (state, trips) {
        state.driver_trip = trips;
    },
    [types.MYTRIPS_SET_PASSENGER_TRIPS] (state, trips) {
        state.passenger_trip = trips;
    },
    [types.MYTRIPS_ADD_TRIPS] (state, trip) {
        state.driver_trip.push(trip);
    },
    [types.MYTRIPS_UPDATE_TRIPS] (state, trip) {
        for (let i = 0; i < state.driver_trip.length; i++) {
            if (state.driver_trip[i].id === trip.id) {
                state.driver_trip[i] = trip;
                // Object.assing(state.driver_trip[i], trip);
            }
        }
    },
    [types.MYTRIPS_DELETE_TRIPS] (state, id) {
        let index = state.driver_trip.findIndex(item => item.id === id);
        if (index >= 0) {
            state.driver_trip.splice(index, 1);
        }
    },

    [types.MYTRIPS_SET_PENDING_RATES] (state, rates) {
        state.pending_rates = rates;
    },

    [types.MYTRIPS_ADD_PASSENGER] (state, { id, user }) {
        for (let i = 0; i < state.driver_trip.length; i++) {
            if (state.driver_trip[i].id === id) {
                if (!state.driver_trip[i].passenger) {
                    state.driver_trip[i].passenger = [];
                }
                state.driver_trip[i].passenger.push(user);
                return;
            }
        }
    },

    [types.MYTRIPS_REMOVE_PASSENGER] (state, { id, user }) {
        for (let i = 0; i < state.driver_trip.length; i++) {
            if (state.driver_trip[i].id === id) {
                if (!state.driver_trip[i].passenger) {
                    return;
                }
                var index = state.driver_trip[i].passenger.findIndex(item => item.id === user.id);
                if (index >= 0) {
                    state.driver_trip[i].passenger.splice(index, 1);
                }
                return;
            }
        }
    },

    [types.MYTRIPS_REMOVE_PASSENGER_TRIP] (state, id) {
        let index = state.passenger_trip.findIndex(item => item.id === id);
        if (index >= 0) {
            state.passenger_trip.splice(index, 1);
        }
    },

    [types.MYTRIPS_SET_DRIVER_TRIPS_OLD] (state, trips) {
        state.driver_old_trips = trips;
    },
    [types.MYTRIPS_SET_PASSENGER_TRIPS_OLD] (state, trips) {
        state.passenger_old_trips = trips;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
