import { PassengerApi } from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';
import { checkError } from '../../../utils/helpers';
import dialogs from '../../services/dialogs.js';

/* eslint-disable no-undef */

// initial state
let passengerApi = new PassengerApi();

const state = {
    pendingRequest: null,
    pendingPaymentRequests: null
};

// getters
const getters = {
    pendingRequest: state => state.pendingRequest,
    pendingPaymentRequests: state => state.pendingPaymentRequests
};

// actions
const actions = {
    getPendingPaymentRequests (store) {
        return passengerApi.pendingPaymentRequests().then(response => {
            store.commit(types.PASSENGER_SET_PENDING_PAYMENT, response.data);
        });
    },

    getPendingRequest (store) {
        return passengerApi.allRequest().then(response => {
            store.commit(types.PASSENGER_SET_PENDING, response.data);
        });
    },

    makeRequest (store, tripId) {
        return passengerApi.make(tripId).then(response => {
            globalStore.commit('trips/' + types.TRIPS_SET_REQUEST, { id: tripId, value: 'send' });

            // HANDLE SUCCESS
            if (response && response.data && response.data.request_state) {
                if (response.data.request_state === 0) {
                    dialogs.message('La solicitud fue enviada.');
                } else if (response.data.request_state === 1) {
                    dialogs.message('Te has subido al viaje.');
                } else if (response.data.request_state === 4 && this.config.module_trip_seats_payment) {
                    let baseUrl = network.getBaseURL();
                    let url = baseUrl + '/transbank?tp_id=' + response.data.id;
                    if (window.location.protocol.indexOf('http') >= 0) {
                        window.location.href = url;
                    } else {
                        var popup = window.open(url, '_blank', 'location=no,hidden=yes,zoom=no');
                        popup.addEventListener('message', (params) => {
                            console.log('message', params);
                            popup.close();
                        }, false);
                    }
                } else {
                    dialogs.message('La solicitud fue enviada.');
                }
            } else {
                dialogs.message('La solicitud fue enviada.');
            }
            return Promise.resolve(response);
        }).catch(error => {
            console.error(error);
            if (checkError(error, 'user_has_another_similar_trip')) {
                dialogs.message('Ya te encuentras subido en un viaje con el mismo origen y destino en esa fecha.', { duration: 10, estado: 'error' });
            } else if (checkError(error, 'user_has_reach_request_limit')) {
                dialogs.message('Se ha alcanzado el límite de consultas que el usuario acepta por este viaje.', { duration: 10, estado: 'error' });
            } else {
                dialogs.message('Ocurrió un problema al solicitar, por favor aguarde unos instante e intentelo nuevamente.', { estado: 'error' });
            }
            return Promise.reject(error);
        });
    },

    transactions (store) {
        return passengerApi.transactions();
    },

    accept (store, { user, trip }) {
        return passengerApi.accept(trip.id, user.id).then(response => {
            let data = {
                user_id: user.id,
                trip_id: trip.id
            };
            store.commit(types.PASSENGER_REMOVE_PENDING, data);
            globalStore.commit('trips/' + types.TRIPS_ADD_PASSENGER, { id: trip.id, user });
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_PASSENGER, { id: trip.id, user });
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    reject (store, { user, trip }) {
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

    cancel (store, { user, trip, cancelTripForPayment }) {
        return passengerApi.cancel(trip.id, user.id).then(response => {
            if (cancelTripForPayment) {
                globalStore.commit('passenger/' + types.PASSENGER_REMOVE_PENDING_PAYMENT, { trip_id: trip.id, value: '' });
            }
            if (trip.request !== 'send') {
                if (globalStore.getters['trips/currentTrip'] && globalStore.getters['trips/currentTrip'].id === trip.id) {
                    globalStore.commit('trips/' + types.TRIPS_CURRENT_REMOVE_PASSENGER_BY_ID, user.id);
                }
                globalStore.commit('trips/' + types.TRIPS_REMOVE_PASSENGER, { id: trip.id, user });
                let myUser = globalStore.getters['auth/user'];
                if (trip.user.id !== myUser.id) {
                    globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER, { id: trip.id, user, passenger: true });
                    globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER_TRIP, trip.id);
                } else {
                    globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER, { id: trip.id, user });
                }
            } else {
                globalStore.commit('trips/' + types.TRIPS_SET_REQUEST, { id: trip.id, value: '' });
            }
            return Promise.resolve(response);
        }).catch(error => {
            return Promise.reject(error);
        });
    }

};

// mutations
const mutations = {
    [types.PASSENGER_SET_PENDING_PAYMENT] (state, list) {
        state.pendingPaymentRequests = list;
    },

    [types.PASSENGER_SET_PENDING] (state, list) {
        state.pendingRequest = list;
    },

    [types.PASSENGER_REMOVE_PENDING_PAYMENT] (state, data) {
        let index = 0;
        if (state.pendingPaymentRequests && state.pendingPaymentRequests.length) {
            state.pendingPaymentRequests.forEach((item, i) => {
                if (item.trip_id === data.trip_id) {
                    index = i;
                }
            });
            state.pendingPaymentRequests.splice(index, 1);
        }
    },

    [types.PASSENGER_REMOVE_PENDING] (state, data) {
        let index = 0;
        if (state.pendingRequest && state.pendingRequest.length) {
            state.pendingRequest.forEach((item, i) => {
                if (item.user.id === data.user_id & item.trip_id === data.trip_id) {
                    index = i;
                }
            });
            state.pendingRequest.splice(index, 1);
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
