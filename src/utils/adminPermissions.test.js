import { describe, expect, it } from 'vitest';
import {
    ADMIN_PERMISSIONS,
    can,
    visibleAdminNavItems,
    ADMIN_NAV_ITEMS
} from './adminPermissions.js';

describe('can', () => {
    it('denies when there is no user', () => {
        expect(can(null, ADMIN_PERMISSIONS.UsersEdit)).toBe(false);
    });

    it('denies non-admin users even if permissions are present', () => {
        expect(
            can(
                {
                    is_admin: false,
                    admin_permissions: [ADMIN_PERMISSIONS.UsersEdit]
                },
                ADMIN_PERMISSIONS.UsersEdit
            )
        ).toBe(false);
    });

    it('allows when the permission is in the user list', () => {
        expect(
            can(
                {
                    is_admin: true,
                    admin_permissions: [ADMIN_PERMISSIONS.UsersEdit]
                },
                ADMIN_PERMISSIONS.UsersEdit
            )
        ).toBe(true);
    });

    it('denies when the permission is missing from the list', () => {
        expect(
            can(
                {
                    is_admin: true,
                    admin_permissions: [ADMIN_PERMISSIONS.UsersEdit]
                },
                ADMIN_PERMISSIONS.UsersSuspend
            )
        ).toBe(false);
    });
});

describe('visibleAdminNavItems', () => {
    it('keeps mesa de ayuda items and drops restricted modules', () => {
        const helpdesk = {
            is_admin: true,
            admin_permissions: [
                ADMIN_PERMISSIONS.DashboardView,
                ADMIN_PERMISSIONS.GraphsView,
                ADMIN_PERMISSIONS.UsersSearch,
                ADMIN_PERMISSIONS.UsersMigrate,
                ADMIN_PERMISSIONS.UsersDeleteRequests,
                ADMIN_PERMISSIONS.TripsView,
                ADMIN_PERMISSIONS.IdentityManualReview,
                ADMIN_PERMISSIONS.IdentityMpReview,
                ADMIN_PERMISSIONS.SupportTickets,
                ADMIN_PERMISSIONS.AuditView
            ]
        };

        const names = visibleAdminNavItems(helpdesk).map((item) => item.name);

        expect(names).toContain('admin-dashboard');
        expect(names).toContain('admin-page');
        expect(names).toContain('admin-users');
        expect(names).toContain('admin-user-migrations');
        expect(names).toContain('admin-users-delete-list');
        expect(names).toContain('admin-trips');
        expect(names).toContain('admin-manual-identity-validations');
        expect(names).toContain('admin-mp-rejected-validations');
        expect(names).toContain('admin-support-tickets');
        expect(names).not.toContain('admin-maintenance');
        expect(names).not.toContain('admin-exceso-contribucion');
        expect(names).not.toContain('admin-banned-users');
        expect(names).not.toContain('admin-changelogs');
        expect(names).not.toContain('admin-car-brands');
        expect(names).not.toContain('admin-car-colors');
    });

    it('includes every nav item for a superadmin permission list', () => {
        const superadmin = {
            is_admin: true,
            admin_permissions: Object.values(ADMIN_PERMISSIONS)
        };

        expect(visibleAdminNavItems(superadmin).map((item) => item.name)).toEqual(
            ADMIN_NAV_ITEMS.map((item) => item.name)
        );
    });
});
