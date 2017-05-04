import {TripApi} from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';

let tripsApi = new TripApi();

const state = {
    trips: null,

    searchParams: {
        page: 1,
        pageSize: 20,
        lastPage: false,
        data: {}
    }
};

// getters
const getters = {
    trips: state => state.trips,
    myTrips: state => state.myTrips,
    morePage: state => !state.searchParams.lastPage,
    searchParams: state => state.searchParams.data
};

// actions
const actions = {
    search ({ commit, state }, data = {}) {
        commit(types.TRIPS_RESTORE_PAGE);
        commit(types.TRIPS_SET_SEARCH_FILTER, data);
        commit(types.TRIPS_SET_TRIPS, null);
        data.page = state.searchParams.page;
        data.page_size = state.searchParams.pageSize;

        return tripsApi.tag(['trips']).search(data).then(response => {
            if (response.meta.pagination.total_pages === response.meta.pagination.current_page) {
                commit(types.TRIPS_SET_LAST_PAGE);
            }
            commit(types.TRIPS_SET_TRIPS, response.data);
        }).catch(err => {
            console.log(err);
        });
    },

    nextPage ({ commit, state }, data = {}) {
        if (!state.searchParams.lastPage) {
            commit(types.TRIPS_NEXT_PAGE);
            let data = state.searchParams.data;
            data.page = state.searchParams.page;
            data.page_size = state.searchParams.pageSize;
            return tripsApi.tag(['trips']).search(data).then(response => {
                if (response.meta.pagination.total_pages === response.meta.pagination.current_page) {
                    commit(types.TRIPS_SET_LAST_PAGE);
                }
                commit(types.TRIPS_ADD_TRIPS, response.data);
            }).catch(err => {
                console.log(err);
            });
        } else {
            return null;
        }
    },

    create (store, data) {
        return tripsApi.create(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_TRIPS, response.data);
            store.dispatch('search', store.state.searchParams.data);
        });
    },

    update (store, data) {
        return tripsApi.update(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_UPDATE_TRIPS, response.data);
            store.dispatch('search', store.state.searchParams.data);
            // globalStore.commit(types.TRIPS_UPDATE_TRIPS, response.data);
        });
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
    [types.TRIPS_NEXT_PAGE] (state) {
        state.searchParams.page++;
    },
    [types.TRIPS_RESTORE_PAGE] (state) {
        state.searchParams.lastPage = false;
        state.searchParams.page = 1;
    },
    [types.TRIPS_SET_SEARCH_FILTER] (state, data) {
        state.searchParams.data = data;
    },
    [types.TRIPS_SET_LAST_PAGE] (state) {
        state.searchParams.lastPage = true;
    },
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
