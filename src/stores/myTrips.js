import { ref } from 'vue';
import { defineStore } from 'pinia';
import { TripApi, RateApi } from '../services/api';

const tripsApi = new TripApi();
const rateApi = new RateApi();

export const useMyTripsStore = defineStore('myTrips', () => {
    const driverTrips = ref(null);
    const passengerTrips = ref(null);
    const driverOldTrips = ref(null);
    const passengerOldTrips = ref(null);
    const pendingRates = ref(null);

    function tripAsDriver() {
        return tripsApi.myTrips(true).then((response) => {
            driverTrips.value = response.data;
        });
    }

    function tripAsPassenger() {
        return tripsApi.myTrips(false).then((response) => {
            passengerTrips.value = response.data;
        });
    }

    function fetchPendingRates() {
        return rateApi.pending(null).then((response) => {
            pendingRates.value = response.data;
        });
    }

    function oldTripsAsDriver() {
        return tripsApi.myOldTrips(true).then((response) => {
            driverOldTrips.value = response.data;
        });
    }

    function oldTripsAsPassenger() {
        return tripsApi.myOldTrips(false).then((response) => {
            passengerOldTrips.value = response.data;
        });
    }

    function addTrip(trip) {
        if (driverTrips.value) {
            driverTrips.value.push(trip);
        }
    }

    function updateTrip(trip) {
        if (driverTrips.value) {
            for (let i = 0; i < driverTrips.value.length; i++) {
                if (driverTrips.value[i].id === trip.id) {
                    driverTrips.value[i] = trip;
                }
            }
        }
    }

    function deleteTrip(id) {
        if (driverTrips.value) {
            const index = driverTrips.value.findIndex((item) => item.id === id);
            if (index >= 0) {
                driverTrips.value.splice(index, 1);
            }
        }
    }

    function addPassenger({ id, user }) {
        if (!driverTrips.value) return;
        for (let i = 0; i < driverTrips.value.length; i++) {
            if (driverTrips.value[i].id === id) {
                if (!driverTrips.value[i].passenger) {
                    driverTrips.value[i].passenger = [];
                }
                driverTrips.value[i].passenger.push(user);
                return;
            }
        }
    }

    function removePassenger({ id, user, passenger = false }) {
        const tripTarget = passenger ? passengerTrips : driverTrips;
        if (!tripTarget.value) return;
        for (let i = 0; i < tripTarget.value.length; i++) {
            if (tripTarget.value[i].id === id) {
                if (
                    !tripTarget.value[i].passenger ||
                    !tripTarget.value[i].passenger.length
                ) {
                    return;
                }
                const index = tripTarget.value[i].passenger.findIndex(
                    (item) =>
                        item.id === user.id &&
                        (item.request_state === 1 || item.request_state === 4)
                );
                if (index >= 0) {
                    tripTarget.value[i].passenger[index].request_state = 3;
                    tripTarget.value[i].seats_available++;
                    tripTarget.value[i].passenger_count--;
                }
                return;
            }
        }
    }

    function removePassengerTrip(id) {
        if (passengerTrips.value) {
            const index = passengerTrips.value.findIndex((item) => item.id === id);
            if (index >= 0) {
                passengerTrips.value.splice(index, 1);
            }
        }
    }

    return {
        driverTrips,
        passengerTrips,
        driverOldTrips,
        passengerOldTrips,
        pendingRates,
        tripAsDriver,
        tripAsPassenger,
        fetchPendingRates,
        oldTripsAsDriver,
        oldTripsAsPassenger,
        addTrip,
        updateTrip,
        deleteTrip,
        addPassenger,
        removePassenger,
        removePassengerTrip
    };
});
