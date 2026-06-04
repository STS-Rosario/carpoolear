import { describe, expect, it } from 'vitest';
import {
    adminUserSupportTicketsRoute,
    shouldShowAdminUserSupportTicketsWarning
} from './adminUserSupportTicketsLink';

describe('adminUserSupportTicketsLink', () => {
    it('adminUserSupportTicketsRoute builds admin list route filtered by user', () => {
        expect(adminUserSupportTicketsRoute(42)).toEqual({
            name: 'admin-support-tickets',
            query: { user_id: '42' }
        });
    });

    it('adminUserSupportTicketsRoute returns list route without query when userId is missing', () => {
        expect(adminUserSupportTicketsRoute(null)).toEqual({
            name: 'admin-support-tickets',
            query: {}
        });
    });

    it('shouldShowAdminUserSupportTicketsWarning is true when count is positive', () => {
        expect(shouldShowAdminUserSupportTicketsWarning(1)).toBe(true);
        expect(shouldShowAdminUserSupportTicketsWarning(3)).toBe(true);
    });

    it('shouldShowAdminUserSupportTicketsWarning is false when count is zero or invalid', () => {
        expect(shouldShowAdminUserSupportTicketsWarning(0)).toBe(false);
        expect(shouldShowAdminUserSupportTicketsWarning(null)).toBe(false);
        expect(shouldShowAdminUserSupportTicketsWarning(undefined)).toBe(false);
    });
});
