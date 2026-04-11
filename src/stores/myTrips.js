import { defineStore } from 'pinia';
import { TripApi, RateApi } from '../services/api';

const tripsApi = new TripApi();
const rateApi = new RateApi();

function tripsListFromResponse(response) {
    if (Array.isArray(response)) {
        return response;
    }
    if (response && Array.isArray(response.data)) {
        return response.data;
    }
    return [];
}

export const useMyTripsStore = defineStore('myTrips', {
    state: () => ({
        driver_trip: null,
        passenger_trip: null,
        driver_old_trips: null,
        passenger_old_trips: null,
        pending_rates: null
    }),

    getters: {
        myTrips: (state) => state.driver_trip,
        passengerTrips: (state) => state.passenger_trip,
        pendingRates: (state) => state.pending_rates,
        myOldTrips: (state) => state.driver_old_trips,
        passengerOldTrips: (state) => state.passenger_old_trips
    },

    actions: {
        // Data-fetching actions
        tripAsDriver() {
            return tripsApi
                .myTrips(true)
                .then((response) => {
                    const list = tripsListFromResponse(response);
                    this.driver_trip = list;
                })
                .catch((err) => {
                    console.error('[myTrips] tripAsDriver failed:', err);
                    this.driver_trip = [];
                });
        },

        tripAsPassenger() {
            return tripsApi
                .myTrips(false)
                .then((response) => {
                    const list = tripsListFromResponse(response);
                    this.passenger_trip = list;
                })
                .catch((err) => {
                    console.error('[myTrips] tripAsPassenger failed:', err);
                    this.passenger_trip = [];
                });
        },

        pendingRatesAction() {
            return rateApi.pending(null).then((response) => {
                this.pending_rates = response.data;
            });
        },

        oldTripsAsDriver() {
            return tripsApi.myOldTrips(true).then((response) => {
                this.driver_old_trips = tripsListFromResponse(response);
            });
        },

        oldTripsAsPassenger() {
            return tripsApi.myOldTrips(false).then((response) => {
                this.passenger_old_trips = tripsListFromResponse(response);
            });
        },

        removeTrip(tripId) {
            this.deleteTrip(tripId);
        },

        // Cross-store mutation methods (called by trips.js and passenger.js)
        addTrip(trip) {
            if (this.driver_trip) {
                this.driver_trip.push(trip);
            }
        },

        updateTrip(trip) {
            if (this.driver_trip) {
                for (let i = 0; i < this.driver_trip.length; i++) {
                    if (this.driver_trip[i].id === trip.id) {
                        this.driver_trip[i] = trip;
                    }
                }
            }
        },

        deleteTrip(id) {
            if (this.driver_trip) {
                const index = this.driver_trip.findIndex((item) => item.id === id);
                if (index >= 0) {
                    this.driver_trip.splice(index, 1);
                }
            }
        },

        addPassenger({ id, user }) {
            if (this.driver_trip) {
                for (let i = 0; i < this.driver_trip.length; i++) {
                    if (this.driver_trip[i].id === id) {
                        if (!this.driver_trip[i].passenger) {
                            this.driver_trip[i].passenger = [];
                        }
                        this.driver_trip[i].passenger.push(user);
                        return;
                    }
                }
            }
        },

        removePassenger({ id, user, passenger = false }) {
            const tripTarget = passenger ? 'passenger_trip' : 'driver_trip';
            if (!this[tripTarget]) return;
            for (let i = 0; i < this[tripTarget].length; i++) {
                if (this[tripTarget][i].id === id) {
                    if (
                        !this[tripTarget][i].passenger ||
                        !this[tripTarget][i].passenger.length
                    ) {
                        return;
                    }
                    const index = this[tripTarget][i].passenger.findIndex(
                        (item) =>
                            item.id === user.id &&
                            (item.request_state === 1 || item.request_state === 4)
                    );
                    if (index >= 0) {
                        this[tripTarget][i].passenger[index].request_state = 3;
                        this[tripTarget][i].seats_available++;
                        this[tripTarget][i].passenger_count--;
                    }
                    return;
                }
            }
        },

        removePassengerTrip(id) {
            if (this.passenger_trip) {
                const index = this.passenger_trip.findIndex((item) => item.id === id);
                if (index >= 0) {
                    this.passenger_trip.splice(index, 1);
                }
            }
        }
    }
});
