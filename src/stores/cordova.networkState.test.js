import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

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

describe('cordova store network state', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('marks network state as ready when the first status is received', async () => {
        const { useCordovaStore } = await import('./cordova');
        const store = useCordovaStore();

        expect(store.networkReady).toBe(false);

        store.setNetworkState(true);

        expect(store.networkReady).toBe(true);
        expect(store.networkState).toBe(true);
    });

    it('keeps legacy deviceOnline and deviceOffline actions in sync with the initialized state', async () => {
        const { useCordovaStore } = await import('./cordova');
        const store = useCordovaStore();

        store.deviceOnline();
        expect(store.networkReady).toBe(true);
        expect(store.networkState).toBe(true);

        store.deviceOffline();
        expect(store.networkReady).toBe(true);
        expect(store.networkState).toBe(false);
    });
});
