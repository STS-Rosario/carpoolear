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
                return;
            }
        }
    },

    [types.TRIPS_SET_REQUEST] (state, id) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === id) {
                state.trips[i].request = 'send';
                return;
            }
        }
    },

    [types.TRIPS_ADD_PASSENGER] (state, {id, user}) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === id) {
                if (!state.trips[i].passenger) {
                    state.trips[i].passenger = [];
                }
                state.trips[i].passenger.push(user);
                return;
            }
        }
    },

    [types.TRIPS_REMOVE_PASSENGER] (state, {id, user}) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === id) {
                if (!state.trips[i].passenger) {
                    return;
                }
                var index = state.trips[i].passenger.findIndex(item => item.user_id === user.id);
                if (index >= 0) {
                    state.trips[i].passenger.splice(index, 1);
                }
                return;
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
