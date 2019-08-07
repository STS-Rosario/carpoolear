import { TripApi } from '../../services/api';
import * as types from '../mutation-types';

let tripsApi = new TripApi();

// initial state
const state = {
    userId: null,
    driver_trip: null,
    passenger_trip: null
};

// getters
const getters = {
    driverTrip: state => state.driver_trip,
    passengerTrip: state => state.passenger_trip
};

// actions
const actions = {
    tripAsDriver (store) {
        return tripsApi.userTrips(state.userId, true).then(response => {
            store.commit(types.USERTRIPS_SET_DRIVER_TRIPS, response.data);
        });
    },

    tripAsPassenger (store) {
        return tripsApi.userTrips(state.userId, false).then(response => {
            store.commit(types.USERTRIPS_SET_PASSENGER_TRIPS, response.data);
        });
    },

    setUserByID (store, id) {
        store.commit(types.USERTRIPS_SET_USER, id);
    }
};

// mutations
const mutations = {
    [types.USERTRIPS_SET_DRIVER_TRIPS] (state, trips) {
        state.driver_trip = trips;
    },
    [types.USERTRIPS_SET_PASSENGER_TRIPS] (state, trips) {
        state.passenger_trip = trips;
    },
    [types.USERTRIPS_SET_USER] (state, id) {
        state.userId = id;
        state.driver_trip = null;
        state.passenger_trip = null;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
