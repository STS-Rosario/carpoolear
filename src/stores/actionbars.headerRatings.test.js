import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

describe('actionbars store headerRatings', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('stores and clears header ratings for the mobile chat header', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();

        store.setHeaderRatings({ positive: 4, negative: 1 });
        expect(store.headerRatings).toEqual({ positive: 4, negative: 1 });

        store.setHeaderRatings(null);
        expect(store.headerRatings).toBeNull();
    });
});
