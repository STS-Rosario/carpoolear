import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../services/dialogs.js', () => ({
    default: {
        message: vi.fn()
    }
}));

vi.mock('../i18n', () => ({
    default: {
        global: {
            t: (key) => key
        }
    }
}));

const seatRequestsMock = vi.fn().mockResolvedValue({
    data: [
        {
            id: 1,
            trip_id: 10,
            request_state: 0,
            trip: { id: 10, from_town: 'Rosario', to_town: 'Buenos Aires' }
        }
    ]
});

vi.mock('../services/api', () => ({
    PassengerApi: class PassengerApiMock {
        seatRequests() {
            return seatRequestsMock();
        }
    }
}));

describe('passenger store seat requests', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('loads seat requests from the API into store state', async () => {
        const { usePassengerStore } = await import('./passenger.js');
        const store = usePassengerStore();

        await store.getSeatRequests();

        expect(store.seatRequests).toHaveLength(1);
        expect(store.seatRequests[0].request_state).toBe(0);
        expect(store.seatRequests[0].trip.id).toBe(10);
    });
});
