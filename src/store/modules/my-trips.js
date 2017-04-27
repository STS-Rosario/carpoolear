import {TripApi} from '../../services/api';
import * as types from '../mutation-types';

let tripsApi = new TripApi();

const state = {
    driver_trip: [],
    passenger_trip: []
};

// getters
const getters = {
    myTrips: state => state.driver_trip,
    passengerTrips: state => state.passenger_trip
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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
