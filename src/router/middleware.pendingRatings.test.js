import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const routerReplace = vi.fn();

vi.mock('../router', () => ({
    default: {
        replace: (...args) => routerReplace(...args)
    }
}));

describe('requirePendingRatingsSubmission middleware', () => {
    beforeEach(async () => {
        setActivePinia(createPinia());
        routerReplace.mockReset();
        vi.resetModules();
    });

    it('allows navigation when there are no pending rates', async () => {
        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [];

        const { requirePendingRatingsSubmission } = await import('./middleware.js');
        const next = vi.fn();

        requirePendingRatingsSubmission(
            { name: 'detail_trip' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith();
        expect(routerReplace).not.toHaveBeenCalled();
    });

    it('redirects to my-trips when pending rates exist on restricted routes', async () => {
        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [{ id: 42 }];

        const { requirePendingRatingsSubmission } = await import('./middleware.js');
        const next = vi.fn();

        requirePendingRatingsSubmission(
            { name: 'detail_trip' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith(false);
        expect(routerReplace).toHaveBeenCalledWith({ name: 'my-trips' });
    });

    it('allows my-trips when pending rates exist', async () => {
        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [{ id: 42 }];

        const { requirePendingRatingsSubmission } = await import('./middleware.js');
        const next = vi.fn();

        requirePendingRatingsSubmission(
            { name: 'my-trips' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith();
        expect(routerReplace).not.toHaveBeenCalled();
    });
});
