import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('axios', () => ({
    default: {
        CancelToken: {
            source: vi.fn(() => ({ token: 'token', cancel: vi.fn() }))
        },
        isCancel: vi.fn(() => false)
    }
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        getPlatform: vi.fn(() => 'web')
    }
}));

vi.mock('../cordova/facebook.js', () => ({
    default: {}
}));

vi.mock('../cordova/apple.js', () => ({
    default: {}
}));

vi.mock('../services/api', () => ({
    AuthApi: class AuthApiMock {}
}));

vi.mock('../services/bus-event.js', () => ({
    default: { emit: vi.fn() }
}));

vi.mock('../cordova/toast.js', () => ({
    default: { toast: vi.fn() }
}));

vi.mock('../utils/routerLazy.js', () => ({
    fireLazyRouterPush: vi.fn(),
    getLazyRouter: vi.fn()
}));

describe('network transport errors', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('normalizes axios transport failures and marks the app offline', async () => {
        const network = await import('./network');
        const { useCordovaStore } = await import('../stores/cordova');
        const store = useCordovaStore();
        store.setNetworkState(true);

        const source = { cancel: vi.fn() };
        const request = network.default.processResponse(
            Promise.reject(
                Object.assign(new Error('Network Error'), {
                    code: 'ERR_NETWORK'
                })
            ),
            source
        );

        await expect(request).rejects.toEqual({
            data: { message: 'network_offline' },
            status: 0,
            offline: true
        });
        expect(store.networkReady).toBe(true);
        expect(store.networkState).toBe(false);
    });
});
