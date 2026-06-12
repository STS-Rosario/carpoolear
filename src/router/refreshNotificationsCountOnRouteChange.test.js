import { describe, expect, it, vi } from 'vitest';
import { refreshNotificationsCountOnRouteChange } from './refreshNotificationsCountOnRouteChange.js';

describe('refreshNotificationsCountOnRouteChange', () => {
    it('refreshes notification count when user is logged in and route name changes', () => {
        const countAction = vi.fn();
        const authStore = { checkLogin: true };
        const notificationsStore = { countAction };

        refreshNotificationsCountOnRouteChange(
            authStore,
            notificationsStore,
            { name: 'notifications', params: {}, query: {} },
            { name: 'trips', params: {}, query: {} }
        );

        expect(countAction).toHaveBeenCalledTimes(1);
    });

    it('does not refresh notification count when user is logged out', () => {
        const countAction = vi.fn();
        const authStore = { checkLogin: false };
        const notificationsStore = { countAction };

        refreshNotificationsCountOnRouteChange(
            authStore,
            notificationsStore,
            { name: 'notifications', params: {}, query: {} },
            { name: 'trips', params: {}, query: {} }
        );

        expect(countAction).not.toHaveBeenCalled();
    });

    it('skips refresh when only query params change on the same route', () => {
        const countAction = vi.fn();
        const authStore = { checkLogin: true };
        const notificationsStore = { countAction };

        refreshNotificationsCountOnRouteChange(
            authStore,
            notificationsStore,
            { name: 'trips', params: {}, query: { scroll: '120' } },
            { name: 'trips', params: {}, query: { scroll: '0' } }
        );

        expect(countAction).not.toHaveBeenCalled();
    });
});

describe('router beforeEach integration', () => {
    it('refreshes notifications count on every route change', () => {
        const fs = require('node:fs');
        const path = require('node:path');
        const routerSource = fs.readFileSync(
            path.resolve(__dirname, 'index.js'),
            'utf8'
        );

        expect(routerSource).toContain(
            'refreshNotificationsCountOnRouteChange(authStore, notificationsStore, to, from)'
        );
    });
});
