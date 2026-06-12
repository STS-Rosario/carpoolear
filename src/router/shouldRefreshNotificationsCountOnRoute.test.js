import { describe, expect, it } from 'vitest';
import { shouldRefreshNotificationsCountOnRoute } from './shouldRefreshNotificationsCountOnRoute.js';

describe('shouldRefreshNotificationsCountOnRoute', () => {
    it('refreshes on initial navigation when from route has no name', () => {
        expect(
            shouldRefreshNotificationsCountOnRoute(
                { name: 'trips', params: {}, query: {} },
                { name: undefined, params: {}, query: {} }
            )
        ).toBe(true);
    });

    it('refreshes when route name changes', () => {
        expect(
            shouldRefreshNotificationsCountOnRoute(
                { name: 'notifications', params: {}, query: {} },
                { name: 'trips', params: {}, query: {} }
            )
        ).toBe(true);
    });

    it('skips when only query params change on the same route', () => {
        expect(
            shouldRefreshNotificationsCountOnRoute(
                { name: 'trips', params: {}, query: { scroll: '120' } },
                { name: 'trips', params: {}, query: { scroll: '0' } }
            )
        ).toBe(false);
    });

    it('refreshes when route params change on the same route name', () => {
        expect(
            shouldRefreshNotificationsCountOnRoute(
                { name: 'trip', params: { id: '2' }, query: {} },
                { name: 'trip', params: { id: '1' }, query: {} }
            )
        ).toBe(true);
    });
});
