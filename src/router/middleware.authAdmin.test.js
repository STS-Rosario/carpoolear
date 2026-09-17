import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ADMIN_PERMISSIONS } from '../utils/adminPermissions.js';

const replace = vi.fn();

vi.mock('../router', () => ({
    default: {
        rememberRoute: null,
        replace
    }
}));

vi.mock('../stores/auth', () => ({
    useAuthStore: vi.fn()
}));

describe('authAdmin middleware', () => {
    beforeEach(async () => {
        replace.mockClear();
        const router = (await import('../router')).default;
        router.rememberRoute = null;
    });

    it('sends non-admins to login', async () => {
        const { useAuthStore } = await import('../stores/auth');
        useAuthStore.mockReturnValue({
            checkLogin: true,
            user: { is_admin: false }
        });

        const { authAdmin } = await import('./middleware.js');
        const next = vi.fn();

        authAdmin({ name: 'admin-dashboard', meta: {} }, {}, next);

        expect(next).toHaveBeenCalledWith(false);
        expect(replace).toHaveBeenCalledWith({ name: 'login' });
    });

    it('allows admins without a route permission onto dashboard', async () => {
        const { useAuthStore } = await import('../stores/auth');
        useAuthStore.mockReturnValue({
            checkLogin: true,
            user: { is_admin: true, admin_permissions: [] }
        });

        const { authAdmin } = await import('./middleware.js');
        const next = vi.fn();

        authAdmin({ name: 'admin-dashboard', meta: {} }, {}, next);

        expect(next).toHaveBeenCalledWith();
        expect(replace).not.toHaveBeenCalled();
    });

    it('redirects helpdesk away from routes they cannot access', async () => {
        const { useAuthStore } = await import('../stores/auth');
        useAuthStore.mockReturnValue({
            checkLogin: true,
            user: {
                is_admin: true,
                admin_permissions: [ADMIN_PERMISSIONS.DashboardView]
            }
        });

        const router = (await import('../router')).default;
        const { authAdmin } = await import('./middleware.js');
        const next = vi.fn();

        authAdmin(
            {
                name: 'admin-maintenance',
                meta: { adminPermission: ADMIN_PERMISSIONS.MaintenanceManage }
            },
            {},
            next
        );

        expect(next).toHaveBeenCalledWith(false);
        expect(replace).toHaveBeenCalledWith({ name: 'admin-dashboard' });
        expect(router.rememberRoute).toBeNull();
    });
});
