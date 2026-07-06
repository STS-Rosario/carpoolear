import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const cacheSetItem = vi.fn(() => Promise.resolve());
const cacheGetItem = vi.fn(() => Promise.resolve(null));
const cacheRemoveItem = vi.fn(() => Promise.resolve());
const consumeImpersonationMock = vi.fn();
const stopImpersonationMock = vi.fn();
const retokenMock = vi.fn(() => Promise.resolve());
const fetchUserMock = vi.fn(() => Promise.resolve());
const routerPush = vi.fn();

vi.mock('../services/cache', () => ({
    default: {
        setItem: (...args) => cacheSetItem(...args),
        getItem: (...args) => cacheGetItem(...args),
        removeItem: (...args) => cacheRemoveItem(...args),
        clear: vi.fn(() => Promise.resolve())
    },
    keys: {
        TOKEN_KEY: 'TOKEN',
        USER_KEY: 'USER',
        IMPERSONATION_SESSION_KEY: 'IMPERSONATION_SESSION',
        ADMIN_TOKEN_BACKUP_KEY: 'ADMIN_TOKEN_BACKUP'
    }
}));

vi.mock('../services/api', () => ({
    AuthApi: class AuthApiMock {
        consumeImpersonation = consumeImpersonationMock;
        stopImpersonation = stopImpersonationMock;
        retoken = retokenMock;
    },
    UserApi: class UserApiMock {
        show = fetchUserMock;
    }
}));

vi.mock('../../config/conf', () => ({
    default: { __isLocal: true }
}));

vi.mock('../utils/routerLazy.js', () => ({
    getLazyRouter: vi.fn(() =>
        Promise.resolve({
            push: routerPush
        })
    )
}));

describe('auth store impersonation', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        cacheSetItem.mockClear();
        cacheGetItem.mockClear();
        cacheRemoveItem.mockClear();
        consumeImpersonationMock.mockReset();
        stopImpersonationMock.mockReset();
        retokenMock.mockReset();
        fetchUserMock.mockReset();
        routerPush.mockClear();
    });

    it('startImpersonation backs up token, consumes handoff, and stores session metadata', async () => {
        consumeImpersonationMock.mockResolvedValue({
            token: 'impersonation-token',
            config: { locale: 'es' },
            impersonation: {
                session_id: 9,
                actor_id: 1,
                target_user_id: 42,
                expires_at: '2026-07-05T23:00:00+00:00'
            }
        });

        const { useAuthStore } = await import('./auth');
        const store = useAuthStore();
        store.token = 'admin-token';

        await store.startImpersonation('handoff-token-value');

        expect(cacheSetItem).toHaveBeenCalledWith('ADMIN_TOKEN_BACKUP', 'admin-token');
        expect(consumeImpersonationMock).toHaveBeenCalledWith({
            token: 'handoff-token-value'
        });
        expect(store.token).toBe('impersonation-token');
        expect(store.isImpersonating).toBe(true);
        expect(store.impersonation.target_user_id).toBe(42);
        expect(fetchUserMock).toHaveBeenCalled();
    });

    it('stopImpersonation stops session, restores admin token, and clears impersonation cache', async () => {
        cacheGetItem.mockImplementation((key) => {
            if (key === 'ADMIN_TOKEN_BACKUP') {
                return Promise.resolve('admin-token');
            }
            return Promise.resolve(null);
        });
        stopImpersonationMock.mockResolvedValue({ message: 'impersonation_stopped' });
        retokenMock.mockResolvedValue({
            token: 'refreshed-admin-token',
            config: { locale: 'es' }
        });

        const { useAuthStore } = await import('./auth');
        const store = useAuthStore();
        store.token = 'impersonation-token';
        store.impersonation = {
            session_id: 9,
            actor_id: 1,
            target_user_id: 42,
            expires_at: '2026-07-05T23:00:00+00:00'
        };

        await store.stopImpersonation();

        expect(stopImpersonationMock).toHaveBeenCalled();
        expect(cacheRemoveItem).toHaveBeenCalledWith('IMPERSONATION_SESSION');
        expect(cacheRemoveItem).toHaveBeenCalledWith('ADMIN_TOKEN_BACKUP');
        expect(store.isImpersonating).toBe(false);
        expect(routerPush).toHaveBeenCalledWith({
            name: 'admin-users-user',
            params: { userId: '42' }
        });
    });
});
