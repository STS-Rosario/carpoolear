import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

describe('redirectToMyTripsIfPendingRatingsRequired', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.resetModules();
    });

    it('returns false when there are no pending rates', async () => {
        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [];

        const { redirectToMyTripsIfPendingRatingsRequired } = await import(
            '../../utils/helpers.js'
        );
        const router = { push: vi.fn() };

        expect(redirectToMyTripsIfPendingRatingsRequired(router)).toBe(false);
        expect(router.push).not.toHaveBeenCalled();
    });

    it('redirects to my-trips and returns true when pending rates exist', async () => {
        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [{ id: 7 }];

        const { redirectToMyTripsIfPendingRatingsRequired } = await import(
            '../../utils/helpers.js'
        );
        const router = { push: vi.fn() };

        expect(redirectToMyTripsIfPendingRatingsRequired(router)).toBe(true);
        expect(router.push).toHaveBeenCalledWith({ name: 'my-trips' });
    });
});
