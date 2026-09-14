import { describe, expect, it, vi, beforeEach } from 'vitest';

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

describe('auth middleware guest trip detail access', () => {
    beforeEach(() => {
        replace.mockClear();
    });

    it('redirects guests to login and remembers the trip detail route', async () => {
        const { useAuthStore } = await import('../stores/auth');
        useAuthStore.mockReturnValue({ checkLogin: false });

        const router = (await import('../router')).default;
        const { auth } = await import('./middleware.js');
        const next = vi.fn();
        const to = { name: 'detail_trip', params: { id: '42' } };

        auth(to, {}, next);

        expect(next).toHaveBeenCalledWith(false);
        expect(router.rememberRoute).toEqual({
            name: 'detail_trip',
            params: { id: '42' }
        });
        expect(replace).toHaveBeenCalledWith({ name: 'login' });
    });

    it('allows logged-in users through to trip detail', async () => {
        const { useAuthStore } = await import('../stores/auth');
        useAuthStore.mockReturnValue({ checkLogin: true });

        const { auth } = await import('./middleware.js');
        const next = vi.fn();
        const to = { name: 'detail_trip', params: { id: '42' } };

        auth(to, {}, next);

        expect(next).toHaveBeenCalledWith();
        expect(replace).not.toHaveBeenCalled();
    });
});
