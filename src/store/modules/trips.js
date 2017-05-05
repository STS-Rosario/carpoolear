import {TripApi} from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';

import * as pagination from '../pagination';

let tripsApi = new TripApi();

// initial state
const state = {
    ...pagination.makeState('trips')
};

// getters
const getters = {
    ...pagination.makeGetters('trips')
};

// actions
const actions = {
    ...pagination.makeActions('trips', (data) => {
        return tripsApi.tag(['trips']).search(data);
    }),

    create (store, data) {
        return tripsApi.create(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_TRIPS, response.data);
            store.dispatch('tripsSearch', store.state.tripsSearchParams.data);
        });
    },

    update (store, data) {
        return tripsApi.update(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_UPDATE_TRIPS, response.data);
            store.dispatch('tripsSearch', store.state.tripsSearchParams.data);
            // globalStore.commit(types.TRIPS_UPDATE_TRIPS, response.data);
        });
    }
};

// mutations
const mutations = {
    ...pagination.makeMutations('trips'),

    [types.TRIPS_UPDATE_TRIPS] (state, trip) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === trip.id) {
                state.trips[i] = trip;
            }
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
