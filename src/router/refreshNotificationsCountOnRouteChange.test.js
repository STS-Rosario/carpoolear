import { describe, expect, it, vi } from 'vitest';
import { refreshNotificationsCountOnRouteChange } from './refreshNotificationsCountOnRouteChange.js';

describe('refreshNotificationsCountOnRouteChange', () => {
    it('refreshes notification count when user is logged in', () => {
        const countAction = vi.fn();
        const authStore = { checkLogin: true };
        const notificationsStore = { countAction };

        refreshNotificationsCountOnRouteChange(authStore, notificationsStore);

        expect(countAction).toHaveBeenCalledTimes(1);
    });

    it('does not refresh notification count when user is logged out', () => {
        const countAction = vi.fn();
        const authStore = { checkLogin: false };
        const notificationsStore = { countAction };

        refreshNotificationsCountOnRouteChange(authStore, notificationsStore);

        expect(countAction).not.toHaveBeenCalled();
    });
});
