import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const myTripsMock = vi.fn();
const myOldTripsMock = vi.fn();
const pendingMock = vi.fn();

vi.mock('../services/api', () => ({
    TripApi: class TripApiMock {
        myTrips = myTripsMock;
        myOldTrips = myOldTripsMock;
        ongoingTrip() {
            return Promise.resolve({ data: null });
        }
    },
    RateApi: class RateApiMock {
        pending = pendingMock;
    }
}));

describe('myTrips store loading state', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        myTripsMock.mockReset();
        myOldTripsMock.mockReset();
        pendingMock.mockReset();
    });

    it('resets driver trips to null before fetching so Loading shows', async () => {
        const { useMyTripsStore } = await import('./myTrips');
        const store = useMyTripsStore();
        store.driver_trip = [];

        let resolveFetch;
        myTripsMock.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveFetch = resolve;
                })
        );

        const pending = store.tripAsDriver();
        expect(store.myTrips).toBeNull();

        resolveFetch({ data: [{ id: 1 }] });
        await pending;
        expect(store.myTrips).toEqual([{ id: 1 }]);
    });

    it('resets old driver trips to null before fetching', async () => {
        const { useMyTripsStore } = await import('./myTrips');
        const store = useMyTripsStore();
        store.driver_old_trips = [];

        let resolveFetch;
        myOldTripsMock.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveFetch = resolve;
                })
        );

        const pending = store.oldTripsAsDriver();
        expect(store.myOldTrips).toBeNull();

        resolveFetch({ data: [] });
        await pending;
        expect(store.myOldTrips).toEqual([]);
    });
});
