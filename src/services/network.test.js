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
        getPlatform: vi.fn(() => 'web'),
        isNativePlatform: vi.fn(() => false)
    }
}));

vi.mock('../cordova/facebook.js', () => ({
    default: {}
}));

vi.mock('../cordova/apple.js', () => ({
    default: {}
}));

vi.mock('../services/api', () => ({
    AuthApi: class AuthApiMock {},
    UserApi: class UserApiMock {}
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
        store.setNetworkState(false);

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

    it('marks server unavailable when transport fails but the device is online', async () => {
        const network = await import('./network');
        const { useCordovaStore } = await import('../stores/cordova');
        const { useServerStatusStore } = await import('../stores/serverStatus');
        const cordovaStore = useCordovaStore();
        const serverStatusStore = useServerStatusStore();
        cordovaStore.setNetworkState(true);

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
            data: { message: 'server_unavailable' },
            status: 0,
            serverUnavailable: true
        });
        expect(cordovaStore.networkState).toBe(true);
        expect(serverStatusStore.serverUnavailable).toBe(true);
    });

    it('marks server unavailable for gateway HTTP errors while online', async () => {
        const network = await import('./network');
        const { useCordovaStore } = await import('../stores/cordova');
        const { useServerStatusStore } = await import('../stores/serverStatus');
        useCordovaStore().setNetworkState(true);

        const source = { cancel: vi.fn() };
        const request = network.default.processResponse(
            Promise.reject({
                response: {
                    status: 502,
                    data: { message: 'Bad Gateway' }
                }
            }),
            source
        );

        await expect(request).rejects.toEqual({
            data: { message: 'Bad Gateway' },
            status: 502
        });
        expect(useServerStatusStore().serverUnavailable).toBe(true);
    });

    it('does not mark server unavailable for maintenance 503 responses', async () => {
        const network = await import('./network');
        const { useAuthStore } = await import('../stores/auth');
        const { useCordovaStore } = await import('../stores/cordova');
        const { useServerStatusStore } = await import('../stores/serverStatus');
        useCordovaStore().setNetworkState(true);
        useAuthStore().setAppConfig({ maintenance: { enabled: false } });

        const source = { cancel: vi.fn() };
        const request = network.default.processResponse(
            Promise.reject({
                response: {
                    status: 503,
                    data: {
                        maintenance: true,
                        enabled: true,
                        mode: 'strict',
                        message: 'Planned work'
                    }
                }
            }),
            source
        );

        await expect(request).rejects.toMatchObject({ status: 503 });
        await vi.waitFor(() => {
            expect(useAuthStore().appConfig.maintenance.enabled).toBe(true);
        });
        expect(useServerStatusStore().serverUnavailable).toBe(false);
    });

    it('clears server unavailable after a successful response', async () => {
        const network = await import('./network');
        const { useServerStatusStore } = await import('../stores/serverStatus');
        const serverStatusStore = useServerStatusStore();
        serverStatusStore.serverUnavailable = true;
        serverStatusStore.stopRetryPolling();

        const source = { cancel: vi.fn() };
        const request = network.default.processResponse(
            Promise.resolve({ data: { ok: true } }),
            source
        );

        await expect(request).resolves.toEqual({ ok: true });
        expect(serverStatusStore.serverUnavailable).toBe(false);
    });
});
