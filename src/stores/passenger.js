import { ref } from 'vue';
import { defineStore } from 'pinia';
import { PassengerApi } from '../services/api';
import { checkError } from '../../utils/helpers';
import dialogs from '../services/dialogs.js';

const passengerApi = new PassengerApi();

export const usePassengerStore = defineStore('passenger', () => {
    const pendingRequest = ref(null);
    const pendingPaymentRequests = ref(null);

    function getPendingPaymentRequests() {
        return passengerApi.pendingPaymentRequests().then((response) => {
            pendingPaymentRequests.value = response.data;
        });
    }

    function getPendingRequest() {
        return passengerApi.allRequest().then((response) => {
            pendingRequest.value = response.data;
        });
    }

    function makeRequest(tripId, config, i18n, tripsStore) {
        return passengerApi
            .make(tripId)
            .then((response) => {
                tripsStore.setRequest({ id: tripId, value: 'send' });

                if (response && response.data && response.data.request_state) {
                    if (response.data.request_state === 0) {
                        dialogs.message(i18n.t('solicitudFueEnviada'));
                    } else if (response.data.request_state === 1) {
                        dialogs.message(i18n.t('teHasSubidoAlViaje'));
                    } else if (
                        response.data.request_state === 4 &&
                        config.module_trip_seats_payment
                    ) {
                        const baseUrl = import.meta.env.VITE_API_URL;
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
                        dialogs.message(i18n.t('solicitudFueEnviada'));
                    }
                } else {
                    dialogs.message(i18n.t('solicitudFueEnviada'));
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                console.error(error);
                if (checkError(error, 'user_has_another_similar_trip')) {
                    dialogs.message(i18n.t('yaSubidoMismoViaje'), {
                        duration: 10,
                        estado: 'error'
                    });
                } else if (checkError(error, 'user_has_reach_request_limit')) {
                    dialogs.message(
                        i18n.t('seHaAlcanzadoElLimiteDeConsultas'),
                        { duration: 10, estado: 'error' }
                    );
                } else {
                    dialogs.message(i18n.t('ocurrioUnProblemaAlSolicitar'), {
                        estado: 'error'
                    });
                }
                return Promise.reject(error);
            });
    }

    function transactions() {
        return passengerApi.transactions();
    }

    function accept({ user, trip }, tripsStore, myTripsStore) {
        return passengerApi
            .accept(trip.id, user.id)
            .then(() => {
                removePending({ user_id: user.id, trip_id: trip.id });
                tripsStore.addPassenger({ id: trip.id, user });
                myTripsStore.addPassenger({ id: trip.id, user });
            })
            .catch((error) => Promise.reject(error));
    }

    function reject({ user, trip }) {
        return passengerApi
            .reject(trip.id, user.id)
            .then(() => {
                removePending({ user_id: user.id, trip_id: trip.id });
            })
            .catch((error) => Promise.reject(error));
    }

    function cancel({ user, trip, cancelTripForPayment }, authStore, tripsStore, myTripsStore) {
        return passengerApi
            .cancel(trip.id, user.id)
            .then((response) => {
                if (cancelTripForPayment) {
                    removePendingPayment({ trip_id: trip.id });
                }
                if (trip.request !== 'send') {
                    if (
                        tripsStore.currentTrip &&
                        tripsStore.currentTrip.id === trip.id
                    ) {
                        tripsStore.removeCurrentTripPassengerById(user.id);
                    }
                    tripsStore.removePassenger({ id: trip.id, user });
                    const myUser = authStore.user;
                    if (trip.user.id !== myUser.id) {
                        myTripsStore.removePassenger({
                            id: trip.id,
                            user,
                            passenger: true
                        });
                        myTripsStore.removePassengerTrip(trip.id);
                    } else {
                        myTripsStore.removePassenger({ id: trip.id, user });
                    }
                } else {
                    tripsStore.setRequest({ id: trip.id, value: '' });
                }
                return Promise.resolve(response);
            })
            .catch((error) => Promise.reject(error));
    }

    function removePending(data) {
        if (pendingRequest.value && pendingRequest.value.length) {
            const index = pendingRequest.value.findIndex(
                (item) => item.user.id === data.user_id && item.trip_id === data.trip_id
            );
            if (index >= 0) {
                pendingRequest.value.splice(index, 1);
            }
        }
    }

    function removePendingPayment(data) {
        if (pendingPaymentRequests.value && pendingPaymentRequests.value.length) {
            const index = pendingPaymentRequests.value.findIndex(
                (item) => item.trip_id === data.trip_id
            );
            if (index >= 0) {
                pendingPaymentRequests.value.splice(index, 1);
            }
        }
    }

    return {
        pendingRequest,
        pendingPaymentRequests,
        getPendingPaymentRequests,
        getPendingRequest,
        makeRequest,
        transactions,
        accept,
        reject,
        cancel,
        removePending,
        removePendingPayment
    };
});
