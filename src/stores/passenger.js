import { defineStore } from 'pinia';
import { PassengerApi } from '../services/api';
import { checkError } from '../../utils/helpers';
import dialogs from '../services/dialogs.js';
import i18n from '../i18n';
// Lazy-load router to avoid circular dependency (stores → router → routes → components → stores)
let _router;
function getRouter() {
    if (!_router) _router = require('../router').default;
    return _router;
}
import network from '../services/network';

/* eslint-disable no-undef */

const passengerApi = new PassengerApi();

export const usePassengerStore = defineStore('passenger', {
    state: () => ({
        pendingRequest: null,
        pendingPaymentRequests: null
    }),

    getters: {
        // pendingRequest and pendingPaymentRequests are accessed via mapState
        // which maps state properties directly — no redundant getters needed.
    },

    actions: {
        // State mutation methods
        setPending(list) {
            this.pendingRequest = list;
        },

        setPendingPayment(list) {
            this.pendingPaymentRequests = list;
        },

        removePending({ user_id, trip_id }) {
            let index = 0;
            if (this.pendingRequest && this.pendingRequest.length) {
                this.pendingRequest.forEach((item, i) => {
                    if (
                        (item.user.id === user_id) &
                        (item.trip_id === trip_id)
                    ) {
                        index = i;
                    }
                });
                this.pendingRequest.splice(index, 1);
            }
        },

        removePendingPayment({ trip_id }) {
            let index = 0;
            if (
                this.pendingPaymentRequests &&
                this.pendingPaymentRequests.length
            ) {
                this.pendingPaymentRequests.forEach((item, i) => {
                    if (item.trip_id === trip_id) {
                        index = i;
                    }
                });
                this.pendingPaymentRequests.splice(index, 1);
            }
        },

        // Business logic actions
        getPendingRequest() {
            return passengerApi.allRequest().then((response) => {
                this.setPending(response.data);
            });
        },

        getPendingPaymentRequests() {
            return passengerApi.pendingPaymentRequests().then((response) => {
                this.setPendingPayment(response.data);
            });
        },

        makeRequest(tripId) {
            const { useTripsStore } = require('./trips');
            const { useAuthStore } = require('./auth');
            const tripsStore = useTripsStore();
            const authStore = useAuthStore();

            return passengerApi
                .make(tripId)
                .then((response) => {
                    tripsStore.setRequest({
                        id: tripId,
                        value: 'send'
                    });

                    // HANDLE SUCCESS
                    if (response && response.data && response.data.request_state) {
                        if (response.data.request_state === 0) {
                            dialogs.message(i18n.global.t('solicitudFueEnviada'));
                        } else if (response.data.request_state === 1) {
                            dialogs.message(i18n.global.t('teHasSubidoAlViaje'));
                        } else if (
                            response.data.request_state === 4 &&
                            authStore.appConfig &&
                            authStore.appConfig.module_trip_seats_payment
                        ) {
                            const baseUrl = network.getBaseURL();
                            const url =
                                baseUrl + '/transbank?tp_id=' + response.data.id;
                            if (window.location.protocol.indexOf('http') >= 0) {
                                window.location.href = url;
                            } else {
                                const popup = window.open(
                                    url,
                                    '_blank',
                                    'location=no,hidden=yes,zoom=no'
                                );
                                popup.addEventListener(
                                    'message',
                                    (params) => {
                                        console.log('message', params);
                                        popup.close();
                                    },
                                    false
                                );
                            }
                        } else {
                            dialogs.message(i18n.global.t('solicitudFueEnviada'));
                        }
                    } else {
                        dialogs.message(i18n.global.t('solicitudFueEnviada'));
                    }
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    console.error(error);
                    if (checkError(error, 'identity_validation_required')) {
                        getRouter().push({ name: 'identity_validation' });
                        dialogs.message(i18n.global.t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    } else if (checkError(error, 'user_has_another_similar_trip')) {
                        dialogs.message(i18n.global.t('yaSubidoMismoViaje'), {
                            duration: 10,
                            estado: 'error'
                        });
                    } else if (checkError(error, 'user_has_reach_request_limit')) {
                        dialogs.message(
                            i18n.global.t('seHaAlcanzadoElLimiteDeConsultas'),
                            { duration: 10, estado: 'error' }
                        );
                    } else {
                        dialogs.message(i18n.global.t('ocurrioUnProblemaAlSolicitar'), {
                            estado: 'error'
                        });
                    }
                    return Promise.reject(error);
                });
        },

        transactions() {
            return passengerApi.transactions();
        },

        accept({ user, trip }) {
            const { useTripsStore } = require('./trips');
            const { useMyTripsStore } = require('./myTrips');
            const tripsStore = useTripsStore();
            const myTripsStore = useMyTripsStore();

            return passengerApi
                .accept(trip.id, user.id)
                .then((response) => {
                    const data = {
                        user_id: user.id,
                        trip_id: trip.id
                    };
                    this.removePending(data);
                    tripsStore.addPassenger({
                        id: trip.id,
                        user
                    });
                    myTripsStore.addPassenger({
                        id: trip.id,
                        user
                    });
                })
                .catch((error) => {
                    if (checkError(error, 'identity_validation_required')) {
                        getRouter().push({ name: 'identity_validation' });
                        dialogs.message(i18n.global.t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    }
                    return Promise.reject(error);
                });
        },

        reject({ user, trip }) {
            return passengerApi
                .reject(trip.id, user.id)
                .then((response) => {
                    const data = {
                        user_id: user.id,
                        trip_id: trip.id
                    };
                    this.removePending(data);
                })
                .catch((error) => {
                    if (checkError(error, 'identity_validation_required')) {
                        getRouter().push({ name: 'identity_validation' });
                        dialogs.message(i18n.global.t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    }
                    return Promise.reject(error);
                });
        },

        cancel({ user, trip, cancelTripForPayment }) {
            const { useTripsStore } = require('./trips');
            const { useMyTripsStore } = require('./myTrips');
            const { useAuthStore } = require('./auth');
            const tripsStore = useTripsStore();
            const myTripsStore = useMyTripsStore();
            const authStore = useAuthStore();

            return passengerApi
                .cancel(trip.id, user.id)
                .then((response) => {
                    if (cancelTripForPayment) {
                        this.removePendingPayment({
                            trip_id: trip.id,
                            value: ''
                        });
                    }
                    if (trip.request !== 'send') {
                        if (
                            tripsStore.currentTrip &&
                            tripsStore.currentTrip.id === trip.id
                        ) {
                            tripsStore.currentRemovePassengerById(user.id);
                        }
                        tripsStore.removePassenger({
                            id: trip.id,
                            user
                        });
                        const myUser = authStore.user;
                        if (trip.user.id !== myUser.id) {
                            myTripsStore.removePassenger({
                                id: trip.id,
                                user,
                                passenger: true
                            });
                            myTripsStore.removePassengerTrip(trip.id);
                        } else {
                            myTripsStore.removePassenger({
                                id: trip.id,
                                user
                            });
                        }
                    } else {
                        tripsStore.setRequest({
                            id: trip.id,
                            value: ''
                        });
                    }
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
    }
});
