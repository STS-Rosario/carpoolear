import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const openAppStore = vi.fn();

vi.mock('@capawesome/capacitor-app-update', () => ({
    AppUpdate: {
        openAppStore
    }
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        getPlatform: vi.fn()
    }
}));

describe('appUpdateStore', () => {
    beforeEach(() => {
        openAppStore.mockReset();
        vi.stubEnv('VITE_IOS_APP_STORE_APP_ID', '1045211385');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('passes the configured App Store appId on iOS', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.getPlatform.mockReturnValue('ios');

        const { getOpenAppStoreOptions, openNativeAppStore, resolveIosAppStoreAppId } =
            await import('./appUpdateStore.js');

        expect(resolveIosAppStoreAppId()).toBe('1045211385');
        expect(getOpenAppStoreOptions()).toEqual({ appId: '1045211385' });

        await openNativeAppStore();

        expect(openAppStore).toHaveBeenCalledWith({ appId: '1045211385' });
    });

    it('does not pass appId on Android', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.getPlatform.mockReturnValue('android');

        const { getOpenAppStoreOptions, openNativeAppStore } = await import(
            './appUpdateStore.js'
        );

        expect(getOpenAppStoreOptions()).toEqual({});

        await openNativeAppStore();

        expect(openAppStore).toHaveBeenCalledWith({});
    });
});
