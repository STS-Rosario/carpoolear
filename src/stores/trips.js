import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { TripApi } from '../services/api';
import { usePagination } from '../composables/usePagination';
import { useMyTripsStore } from './myTrips';
import moment from 'moment';

const tripsApi = new TripApi();

export const useTripsStore = defineStore('trips', () => {
    const pagination = usePagination('trips', ({ data }) => {
        return tripsApi.tag(['trips']).search(data);
    });

    const currentTrip = ref(null);
    const refreshListFlag = ref(false);
    const scrollOffset = ref(0);

    function searchAgain() {
        pagination.search(pagination.searchParam.value.data);
    }

    function tripsSearch(data = {}) {
        return pagination.search(data);
    }

    function refreshMyTrips() {
        try {
            const myTripsStore = useMyTripsStore();
            myTripsStore.tripAsDriver();
            myTripsStore.tripAsPassenger();
        } catch (e) {
            // myTripsStore may not be initialized yet
        }
    }

    function create(data) {
        return tripsApi.create(data).then((response) => {
            pagination.search(pagination.searchParam.value.data);
            refreshMyTrips();
            return Promise.resolve(response.data);
        });
    }

    function update(data) {
        return tripsApi.update(data).then((response) => {
            pagination.search(pagination.searchParam.value.data);
            refreshMyTrips();
            return Promise.resolve(response.data);
        });
    }

    function changeSeats(data) {
        return tripsApi.changeSeats(data).then((response) => {
            return Promise.resolve(response.data);
        });
    }

    function remove(id) {
        return tripsApi.remove(id).then(() => {
            pagination.search(pagination.searchParam.value.data);
            refreshMyTrips();
            return Promise.resolve({ status: 'ok' });
        });
    }

    function show(id) {
        return tripsApi.show(id);
    }

    function tripsAsDriver(id) {
        return tripsApi.getTrips(id, true).then((response) => response.data);
    }

    function tripsAsPassenger(id) {
        return tripsApi.getTrips(id, false).then((response) => response.data);
    }

    function oldTripsAsDriver(id) {
        return tripsApi.getOldTrips(id, true).then((response) => response.data);
    }

    function oldTripsAsPassenger(id) {
        return tripsApi.getOldTrips(id, false).then((response) => response.data);
    }

    function price(data) {
        return tripsApi.price(data);
    }

    function changeVisibility(data) {
        return tripsApi.changeVisibility(data);
    }

    function refreshList(status) {
        refreshListFlag.value = status;
    }

    function setScrollOffset(pos) {
        scrollOffset.value = pos;
    }

    function setCurrentTrip(trip) {
        currentTrip.value = trip;
    }

    function setRequest({ id, value }) {
        if (!pagination.items.value) return;
        for (let i = 0; i < pagination.items.value.length; i++) {
            if (pagination.items.value[i].id === id) {
                pagination.items.value[i].request = value;
                return;
            }
        }
    }

    function addPassenger({ id, user }) {
        if (!pagination.items.value) return;
        for (let i = 0; i < pagination.items.value.length; i++) {
            if (pagination.items.value[i].id === id) {
                if (!pagination.items.value[i].passenger) {
                    pagination.items.value[i].passenger = [];
                }
                pagination.items.value[i].passenger.push(user);
                return;
            }
        }
    }

    function removePassenger({ id, user }) {
        if (!pagination.items.value) return;
        for (let i = 0; i < pagination.items.value.length; i++) {
            if (pagination.items.value[i].id === id) {
                if (
                    !pagination.items.value[i].passenger ||
                    !pagination.items.value[i].passenger.length
                ) {
                    return;
                }
                const index = pagination.items.value[i].passenger.findIndex(
                    (item) =>
                        item.id === user.id &&
                        (item.request_state === 1 || item.request_state === 4)
                );
                if (index >= 0) {
                    pagination.items.value[i].passenger[index].request_state = 3;
                    pagination.items.value[i].seats_available++;
                    pagination.items.value[i].passenger_count--;
                }
                return;
            }
        }
    }

    function removeCurrentTripPassengerById(userId) {
        if (!currentTrip.value) return;
        const index = currentTrip.value.passenger.findIndex(
            (item) => item.id === userId
        );
        currentTrip.value.passenger.splice(index, 1);
        if (currentTrip.value.allPassengerRequest) {
            const index2 = currentTrip.value.allPassengerRequest.findIndex(
                (item) =>
                    item.id === userId &&
                    (item.request_state === 1 || item.request_state === 4)
            );
            currentTrip.value.allPassengerRequest.splice(index2, 1);
        }
        currentTrip.value.seats_available++;
        currentTrip.value.passenger_count--;
    }

    function searchMatchers({ trip }) {
        const firstPoint = trip.points[0];
        const lastPoint = trip.points[trip.points.length - 1];
        const data = {
            is_passenger: !trip.is_passenger,
            date: moment(trip.trip_date).format('YYYY-MM-DD'),
            origin_lat: firstPoint.lat,
            origin_lng: firstPoint.lng,
            origin_radio: 25000,
            origin_name: firstPoint.address,
            destination_lat: lastPoint.lat,
            destination_lng: lastPoint.lng,
            destination_radio: 25000,
            destination_name: lastPoint.address
        };
        return tripsApi
            .tag(['trips'])
            .search(data)
            .then((trips) => {
                const users = [];
                for (let i = 0; i < trips.data.length; i++) {
                    const t = trips.data[i];
                    if (t.id === trip.id) continue;
                    if (
                        moment(trip.trip_date).format('YYYY-MM-DD') ===
                        moment(t.trip_date).format('YYYY-MM-DD')
                    ) {
                        const idx = users.findIndex(
                            (item) => t.user && item.id === t.user.id
                        );
                        if (idx < 0) {
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

    return {
        trips: pagination.items,
        tripsMorePage: pagination.morePage,
        tripsSearchParam: pagination.searchParam,
        currentTrip,
        refreshListFlag,
        scrollOffset,
        tripsSearch,
        searchAgain,
        create,
        update,
        changeSeats,
        remove,
        show,
        tripsAsDriver,
        tripsAsPassenger,
        oldTripsAsDriver,
        oldTripsAsPassenger,
        price,
        changeVisibility,
        refreshList,
        setScrollOffset,
        setCurrentTrip,
        setRequest,
        addPassenger,
        removePassenger,
        removeCurrentTripPassengerById,
        searchMatchers
    };
});
