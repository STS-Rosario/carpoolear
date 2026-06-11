import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const tripsApiMock = {
    create: vi.fn(),
    tag: vi.fn(() => ({
        search: vi.fn()
    }))
};

const myTripsStoreMock = {
    addTrip: vi.fn()
};

vi.mock('../services/api', () => ({
    TripApi: class TripApiMock {
        constructor() {
            return tripsApiMock;
        }
    }
}));

vi.mock('./myTrips', () => ({
    useMyTripsStore: () => myTripsStoreMock
}));

describe('trips store create', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        tripsApiMock.create.mockReset();
        tripsApiMock.tag.mockReset();
        myTripsStoreMock.addTrip.mockReset();
        tripsApiMock.tag.mockReturnValue({ search: vi.fn() });
    });

    it('does not add duplicate trips to myTrips when backend returns existing', async () => {
        const { useTripsStore } = await import('./trips');
        tripsApiMock.create.mockResolvedValue({
            data: { id: 99, from_town: 'A', to_town: 'B', existing: true }
        });

        const store = useTripsStore();
        store.tripsSearchParam = { data: {} };
        store.tripsSearch = vi.fn().mockResolvedValue(undefined);
        const trip = await store.create({ from_town: 'A', to_town: 'B' });

        expect(trip.existing).toBe(true);
        expect(myTripsStoreMock.addTrip).not.toHaveBeenCalled();
        expect(store.tripsSearch).not.toHaveBeenCalled();
    });

    it('adds newly created trips to myTrips', async () => {
        const { useTripsStore } = await import('./trips');
        tripsApiMock.create.mockResolvedValue({
            data: { id: 100, from_town: 'A', to_town: 'B', existing: false }
        });

        const store = useTripsStore();
        store.tripsSearchParam = { data: {} };
        store.tripsSearch = vi.fn().mockResolvedValue(undefined);
        const trip = await store.create({ from_town: 'A', to_town: 'B' });

        expect(trip.existing).toBe(false);
        expect(myTripsStoreMock.addTrip).toHaveBeenCalledWith(trip);
    });
});
