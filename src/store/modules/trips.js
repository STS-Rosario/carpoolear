import {TripApi} from '../../services/api';
import * as types from '../mutation-types';

// initial state
// shape: [{ id, quantity }]
let tripsApi = new TripApi();

const state = {
    trips: null,
    myTrips: null,

    searchParams: {
        page: 1,
        pageSize: 20,
        lastPage: false,
        data: null
    }
};

// getters
const getters = {
    trips: state => state.trips,
    myTrips: state => state.myTrips,
    morePage: state => state.searchParams.last_page
};

// actions
const actions = {
    search ({ commit, state }, data = {}) {
        commit(types.TRIPS_RESTORE_PAGE);
        commit(types.TRIPS_SET_SEARCH_FILTER, data);
        data.page = state.searchParams.page;
        data.page_size = state.searchParams.pageSize;

        return tripsApi.tag(['trips']).search(data).then(response => {
            if (response.last_page === response.current_page) {
                commit(types.TRIPS_SET_LAST_PAGE);
            }
            commit(types.TRIPS_SET_TRIPS, response.data);
        }).catch(err => {
            console.log(err);
        });
    },

    nextPage ({ commit, state }, data = {}) {
        if (!state.searchParams.last_page) {
            commit(types.TRIPS_NEXT_PAGE);
            let data = state.searchParams.data;
            data.page = state.searchParams.page;
            data.page_size = state.searchParams.pageSize;

            return tripsApi.tag(['trips']).search(data).then(response => {
                if (response.last_page === response.current_page) {
                    commit(types.TRIPS_SET_LAST_PAGE);
                }
                commit(types.TRIPS_ADD_TRIPS, response.data);
            }).catch(err => {
                console.log(err);
            });
        } else {
            return null;
        }
    }
};

// mutations
const mutations = {
    [types.TRIPS_SET_TRIPS] (state, trips) {
        state.trips = trips;
    },
    [types.TRIPS_ADD_TRIPS] (state, trips) {
        state.trips = [...state.trips, ...trips];
    },
    [types.TRIPS_SET_MY_TRIPS] (state, trips) {
        state.trips = trips;
    },
    [types.TRIPS_ADD_MY_TRIPS] (state, trips) {
        state.trips = [...state.trips, ...trips];
    },
    [types.TRIPS_NEXT_PAGE] (state) {
        state.searchParams.page++;
    },
    [types.TRIPS_RESTORE_PAGE] (state) {
        state.searchParams.last_page = false;
        state.searchParams.page = 1;
    },
    [types.TRIPS_SET_SEARCH_FILTER] (state, data) {
        state.searchParams.data = data;
    },
    [types.TRIPS_SET_LAST_PAGE] (state) {
        state.searchParams.last_page = true;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
