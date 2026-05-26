import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const apiMock = {
    login: vi.fn()
};

vi.mock('../services/api', () => ({
    AuthApi: class AuthApiMock {
        constructor() {
            return apiMock;
        }
    },
    UserApi: class UserApiMock {}
}));

vi.mock('../services/cache', () => ({
    default: {
        setItem: vi.fn(),
        clear: vi.fn()
    },
    keys: {
        TOKEN_KEY: 'token',
        USER_KEY: 'user'
    }
}));

vi.mock('../../config/conf', () => ({
    default: {}
}));

vi.mock('../utils/registrationAutoLogin', () => ({
    completeSessionIfRegistrationReturnsToken: vi.fn()
}));

vi.mock('../utils/routerLazy.js', () => ({
    getLazyRouter: vi.fn()
}));

describe('auth store offline errors', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        apiMock.login.mockReset();
    });

    it('preserves normalized offline errors from login', async () => {
        const offlineError = {
            data: { message: 'network_offline' },
            status: 0,
            offline: true
        };
        apiMock.login.mockRejectedValue(offlineError);

        const { useAuthStore } = await import('./auth');
        const store = useAuthStore();

        await expect(
            store.login({ email: 'user@example.com', password: 'secret' })
        ).rejects.toEqual(offlineError);
    });
});
