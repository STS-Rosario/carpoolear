import {PassengerApi} from '../../services/api';
import * as types from '../mutation-types';
import bus from '../../services/bus-event';
import globalStore from '../index';

/* eslint-disable no-undef */

// initial state
let passengerApi = new PassengerApi();

const state = {
    pendingRequest: null
};

// getters
const getters = {
    trips: state => state.trips
};

// actions
const actions = {
    getPendingRequest (store) {
        return passengerApi.allRequest().then(response => {
            store.commit(types.PASSENGER_SET_PENDING, response);
        });
    },

    makeRequest (store, tripId) {
        return passengerApi.make(tripId).then(response => {
            globalStore.commit('trips/' + types.TRIPS_SET_REQUEST, tripId);
            return Promise.resolve();
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    accept (store, {user, trip}) {
        return passengerApi.accept(trip.id, user.id).then(response => {
            let data = {
                user_id: user.id,
                trip_id: trip.id
            };
            store.commit(types.PASSENGER_REMOVE_PENDING, data);
            globalStore.commit('trips/' + types.TRIPS_ADD_PASSENGER, {id: trip.id, user});
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_PASSENGER, {id: trip.id, user});
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    reject (store, {user, trip}) {
        return passengerApi.reject(trip.id, user.id).then(response => {
            let data = {
                user_id: user.id,
                trip_id: trip.id
            };
            store.commit(types.PASSENGER_REMOVE_PENDING, data);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    cancel (store, {user, trip}) {
        return passengerApi.cancel(trip.id, user.id).then(response => {
            if (trip.user_id === user.id) {
                globalStore.commit('trips/' + types.TRIPS_REMOVE_PASSENGER, {id: trip.id, user});
                globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER, {id: trip.id, user});
            } else {
                globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER_TRIP, trip.id);
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    }

};

// mutations
const mutations = {
    [types.PASSENGER_SET_PENDING] (state, list) {
        state.pendingRequest = list;
    },

    [types.PASSENGER_REMOVE_PENDING] (state, data) {
        state.pendingRequest = state.pendingRequest.filter(item => item.user_id !== data.userId || item.trip_id !== data.tripId);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
