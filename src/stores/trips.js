import { defineStore } from 'pinia';
import { TripApi } from '../services/api';
import dayjs from '../dayjs';
import { makePaginationState, makePaginationGetters, makePaginationActions } from './pagination';

const tripsApi = new TripApi();

export const useTripsStore = defineStore('trips', {
    state: () => ({
        ...makePaginationState('trips'),
        current_trip: null,
        refresh_list: false,
        scroll_offset: 0
    }),

    getters: {
        ...makePaginationGetters('trips'),
        currentTrip: (state) => state.current_trip,
        refreshList: (state) => state.refresh_list,
        scrollOffset: (state) => state.scroll_offset
    },

    actions: {
        ...makePaginationActions('trips', ({ store, data }) => {
            return tripsApi.tag(['trips']).search(data);
        }),

        searchAgain() {
            this.tripsSearch(this.tripsSearchParam.data);
        },

        async create(data) {
            const { useMyTripsStore } = await import('./myTrips');
            const myTripsStore = useMyTripsStore();
            return tripsApi.create(data).then((response) => {
                myTripsStore.addTrip(response.data);
                this.tripsSearch(this.tripsSearchParam.data);
                return Promise.resolve(response.data);
            });
        },

        async update(data) {
            const { useMyTripsStore } = await import('./myTrips');
            const myTripsStore = useMyTripsStore();
            return tripsApi.update(data).then((response) => {
                myTripsStore.updateTrip(response.data);
                this.tripsSearch(this.tripsSearchParam.data);
                return Promise.resolve(response.data);
            });
        },

        async changeSeats(data) {
            const { useMyTripsStore } = await import('./myTrips');
            const myTripsStore = useMyTripsStore();
            return tripsApi.changeSeats(data).then((response) => {
                myTripsStore.updateTrip(response.data);
                return Promise.resolve(response.data);
            });
        },

        async remove(id) {
            const { useMyTripsStore } = await import('./myTrips');
            const myTripsStore = useMyTripsStore();
            return tripsApi.remove(id).then((response) => {
                myTripsStore.deleteTrip(id);
                this.tripsSearch(this.tripsSearchParam.data);
                return Promise.resolve({ status: 'ok' });
            });
        },

        show(id) {
            return tripsApi.show(id);
        },

        tripsAsDriver(id) {
            return tripsApi.getTrips(id, true).then((response) => {
                return response.data;
            });
        },

        tripsAsPassenger(id) {
            return tripsApi.getTrips(id, false).then((response) => {
                return response.data;
            });
        },

        oldTripsAsDriver(id) {
            return tripsApi.getOldTrips(id, true).then((response) => {
                return response.data;
            });
        },

        oldTripsAsPassenger(id) {
            return tripsApi.getOldTrips(id, false).then((response) => {
                return response.data;
            });
        },

        price(data) {
            return tripsApi.price(data);
        },

        changeVisibility(data) {
            return tripsApi.changeVisibility(data);
        },

        // State mutation methods
        setCurrentTrip(trip) {
            this.current_trip = trip;
        },

        setRefreshList(status) {
            this.refresh_list = status;
        },

        setScrollOffset(pos) {
            console.log(pos);
            this.scroll_offset = pos;
        },

        refreshListAction(status) {
            this.refresh_list = status;
        },

        updateTripInList(trip) {
            if (this.trips) {
                for (let i = 0; i < this.trips.length; i++) {
                    if (this.trips[i].id === trip.id) {
                        this.trips[i] = trip;
                        return;
                    }
                }
            }
        },

        currentRemovePassengerById(userId) {
            const index = this.current_trip.passenger.findIndex(
                (item) => item.id === userId
            );
            this.current_trip.passenger.splice(index, 1);
            if (this.current_trip.allPassengerRequest) {
                const index2 = this.current_trip.allPassengerRequest.findIndex(
                    (item) =>
                        item.id === userId &&
                        (item.request_state === 1 || item.request_state === 4)
                );
                this.current_trip.allPassengerRequest.splice(index2, 1);
            }

            this.current_trip.seats_available++;
            this.current_trip.passenger_count--;
        },

        setRequest({ id, value }) {
            if (this.trips) {
                for (let i = 0; i < this.trips.length; i++) {
                    if (this.trips[i].id === id) {
                        this.trips[i].request = value;
                        return;
                    }
                }
            }
        },

        addPassenger({ id, user }) {
            if (this.trips) {
                for (let i = 0; i < this.trips.length; i++) {
                    if (this.trips[i].id === id) {
                        if (!this.trips[i].passenger) {
                            this.trips[i].passenger = [];
                        }
                        this.trips[i].passenger.push(user);
                        return;
                    }
                }
            }
        },

        removePassenger({ id, user }) {
            if (this.trips) {
                for (let i = 0; i < this.trips.length; i++) {
                    if (this.trips[i].id === id) {
                        if (
                            !this.trips[i].passenger ||
                            !this.trips[i].passenger.length
                        ) {
                            return;
                        }
                        const index = this.trips[i].passenger.findIndex(
                            (item) =>
                                item.id === user.id &&
                                (item.request_state === 1 || item.request_state === 4)
                        );
                        if (index >= 0) {
                            this.trips[i].passenger[index].request_state = 3;
                            this.trips[i].seats_available++;
                            this.trips[i].passenger_count--;
                        }
                        return;
                    }
                }
            }
        },

        searchMatchers({ trip }) {
            const firstPoint = trip.points[0];
            const lastPoint = trip.points[trip.points.length - 1];
            const data = {
                is_passenger: !trip.is_passenger,
                date: dayjs(trip.trip_date).format('YYYY-MM-DD'),
                origin_lat: firstPoint.lat,
                origin_lng: firstPoint.lng,
                origin_radio: 25000, // Por ahora hardcoreado
                origin_name: firstPoint.address,

                destination_lat: lastPoint.lat,
                destination_lng: lastPoint.lng,
                destination_radio: 25000, // Por ahora hardcoreado
                destination_name: lastPoint.address
            };
            return tripsApi
                .tag(['trips'])
                .search(data)
                .then((trips) => {
                    const users = [];
                    for (let i = 0; i < trips.data.length; i++) {
                        const t = trips.data[i];
                        if (t.id === trip.id) {
                            continue;
                        }
                        if (
                            dayjs(trip.trip_date).format('YYYY-MM-DD') ===
                            dayjs(t.trip_date).format('YYYY-MM-DD')
                        ) {
                            const i = users.findIndex(
                                (item) => t.user && item.id === t.user.id
                            );
                            if (i < 0) {
                                const user = t.user;
                                delete t.user;
                                user.tripMatch = t;
                                users.push(user);
                            }
                        }
                    }
                    return Promise.resolve(users);
                });
        }
    }
});
