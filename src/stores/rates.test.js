import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useRatesStore } from './rates.js';
import { RateApi } from '../services/api';

vi.mock('../services/api', () => ({
    RateApi: vi.fn()
}));

const rateApi = () => RateApi.mock.instances[0];

describe('useRatesStore', () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useRatesStore();
        rateApi().pending = vi.fn();
        rateApi().rate = vi.fn();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('loads pending rates into the store', async () => {
        rateApi().pending.mockResolvedValue({ data: [{ id: 1 }] });

        await store.pendingRatesAction();

        expect(rateApi().pending).toHaveBeenCalledWith(null);
        expect(store.pending_rates).toEqual([{ id: 1 }]);
        expect(store.pendingRates).toEqual([{ id: 1 }]);
    });

    it('removes the rated trip from the pending list after voting', async () => {
        store.pending_rates = [{ id: 10, trip_id: 1, user_id: 2 }, { id: 11, trip_id: 3, user_id: 4 }];
        rateApi().rate.mockResolvedValue({});

        await store.vote({ id: 10, trip_id: 1, user_id: 2, rating: 5, comment: 'ok' });

        expect(rateApi().rate).toHaveBeenCalledWith(1, 2, { rating: 5, comment: 'ok' });
        expect(store.pending_rates).toEqual([{ id: 11, trip_id: 3, user_id: 4 }]);
    });

    it('rejects voting errors and keeps the pending list intact', async () => {
        store.pending_rates = [{ id: 10, trip_id: 1, user_id: 2 }];
        rateApi().rate.mockRejectedValue(new Error('voto fallido'));

        await expect(store.vote({ id: 10, trip_id: 1, user_id: 2, rating: 1 })).rejects.toThrow(
            'voto fallido'
        );
        expect(store.pending_rates).toEqual([{ id: 10, trip_id: 1, user_id: 2 }]);
    });
});
