import { TripApi } from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';
import moment from 'moment';

import * as pagination from '../pagination';

let tripsApi = new TripApi();

// initial state
const state = {
    ...pagination.makeState('trips'),
    current_trip: null,
    refresh_list: false,
    scroll_offset: 0
};

// getters
const getters = {
    ...pagination.makeGetters('trips'),
    currentTrip: state => state.current_trip,
    refreshList: state => state.refresh_list,
    scrollOffset: state => state.scroll_offset
};

// actions
const actions = {
    ...pagination.makeActions('trips', ({ store, data }) => {
        return tripsApi.tag(['trips']).search(data);
    }),

    searchAgain (store, data) {
        store.dispatch('tripsSearch', store.state.tripsSearchParam.data);
    },

    create (store, data) {
        return tripsApi.create(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_TRIPS, response.data);
            store.dispatch('tripsSearch', store.state.tripsSearchParam.data);
            return Promise.resolve(response.data);
        });
    },

    update (store, data) {
        return tripsApi.update(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_UPDATE_TRIPS, response.data);
            store.dispatch('tripsSearch', store.state.tripsSearchParam.data);
            return Promise.resolve(response.data);
            // globalStore.commit(types.TRIPS_UPDATE_TRIPS, response.data);
        });
    },

    changeSeats (store, data) {
        return tripsApi.changeSeats(data).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_UPDATE_TRIPS, response.data);
            return Promise.resolve(response.data);
        });
    },

    remove (store, id) {
        return tripsApi.remove(id).then(response => {
            globalStore.commit('myTrips/' + types.MYTRIPS_DELETE_TRIPS, id);
            store.dispatch('tripsSearch', store.state.tripsSearchParam.data);
            return Promise.resolve({ status: 'ok' });
            // globalStore.commit(types.TRIPS_UPDATE_TRIPS, response.data);
        });
    },

    show (store, id) {
        return tripsApi.show(id);
    },

    tripsAsDriver (store, id) {
        return tripsApi.getTrips(id, true).then(response => {
            return response.data;
        });
    },

    tripsAsPassenger (store, id) {
        return tripsApi.getTrips(id, false).then(response => {
            return response.data;
        });
    },

    oldTripsAsDriver (store, id) {
        return tripsApi.getOldTrips(id, true).then(response => {
            return response.data;
        });
    },

    oldTripsAsPassenger (store, id) {
        return tripsApi.getOldTrips(id, false).then(response => {
            return response.data;
        });
    },

    price (store, data) {
        return tripsApi.price(data);
    },

    changeVisibility (store, data) {
        return tripsApi.changeVisibility(data);
    },

    refreshList (store, status) {
        store.commit(types.TRIPS_REFRESH, status);
    },

    setScrollOffset (store, pos) {
        console.log(pos);
        store.commit(types.TRIPS_SET_SCROLL, pos);
    },

    searchMatchers (store, { trip }) {
        let firstPoint = trip.points[0];
        let lastPoint = trip.points[trip.points.length - 1];
        let data = {
            is_passenger: !trip.is_passenger,
            date: moment(trip.trip_date).format('YYYY-MM-DD'),
            origin_lat: firstPoint.lat,
            origin_lng: firstPoint.lng,
            origin_radio: 25000, // Por ahora hardcoreado
            origin_name: firstPoint.address,

            destination_lat: lastPoint.lat,
            destination_lng: lastPoint.lng,
            destination_radio: 25000, // Por ahora hardcoreado
            destination_name: lastPoint.address

        };
        return tripsApi.tag(['trips']).search(data).then(trips => {
            let users = [];
            for (let i = 0; i < trips.data.length; i++) {
                let t = trips.data[i];
                if (t.id === trip.id) {
                    continue;
                }
                if (moment(trip.trip_date).format('YYYY-MM-DD') === moment(t.trip_date).format('YYYY-MM-DD')) {
                    const i = users.findIndex(item => t.user && item.id === t.user.id);
                    if (i < 0) {
                        let user = t.user;
                        delete t.user;
                        user.tripMatch = t;
                        users.push(user);
                    }
                }
            }
            return Promise.resolve(users);
        });
    }
};

// mutations
const mutations = {
    ...pagination.makeMutations('trips'),

    [types.TRIPS_REFRESH] (state, status) {
        state.refresh_list = status;
    },

    [types.TRIPS_SET_CURRENT] (state, trip) {
        state.current_trip = trip;
    },

    [types.TRIPS_UPDATE_TRIPS] (state, trip) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === trip.id) {
                state.trips[i] = trip;
                return;
            }
        }
    },

    [types.TRIPS_CURRENT_REMOVE_PASSENGER_BY_ID] (state, userId) {
        let index = state.current_trip.passenger.findIndex(item => item.id === userId && (item.request_state === 1 || item.request_state === 4));
        state.current_trip.passenger[index].request_state = 3;
        state.current_trip.seats_available++;
        state.current_trip.passenger_count--;
    },

    [types.TRIPS_SET_REQUEST] (state, { id, value }) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === id) {
                state.trips[i].request = value;
                return;
            }
        }
    },

    [types.TRIPS_ADD_PASSENGER] (state, { id, user }) {
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

    [types.TRIPS_REMOVE_PASSENGER] (state, { id, user }) {
        for (let i = 0; i < state.trips.length; i++) {
            if (state.trips[i].id === id) {
                if (!state.trips[i].passenger || !state.trips[i].passenger.length) {
                    return;
                }
                var index = state.trips[i].passenger.findIndex(item => item.id === user.id && (item.request_state === 1 || item.request_state === 4));
                if (index >= 0) {
                    state.trips[i].passenger[index].request_state = 3;
                    state.trips[i].seats_available++;
                    state.trips[i].passenger_count--;
                }
                return;
            }
        }
    },

    [types.TRIPS_SET_SCROLL] (state, scrollOffset) {
        state.scroll_offset = scrollOffset;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
