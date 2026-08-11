import { describe, expect, it } from 'vitest';
import {
    defaultMobileMenuReturnRoute,
    resolveMobileMenuCloseTarget,
    snapshotRoute
} from './mobileMenuNavigation.js';

describe('mobileMenuNavigation', () => {
    it('snapshots route name, params, and query for restoring after menu closes', () => {
        expect(
            snapshotRoute({
                name: 'profile',
                params: { id: 'me' },
                query: { tab: 'cars' }
            })
        ).toEqual({
            name: 'profile',
            params: { id: 'me' },
            query: { tab: 'cars' }
        });
    });

    it('falls back to trips when there is no valid return route', () => {
        expect(resolveMobileMenuCloseTarget(null)).toEqual(
            defaultMobileMenuReturnRoute()
        );
        expect(
            resolveMobileMenuCloseTarget({ name: 'mobile-menu', params: {}, query: {} })
        ).toEqual(defaultMobileMenuReturnRoute());
    });
});
