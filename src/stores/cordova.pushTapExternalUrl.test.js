// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { stubCapacitorPlatform } from '../utils/capacitorPlatform.fixture.js';

const capacitorMock = vi.hoisted(() => ({
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web')
}));

vi.mock('@capacitor/core', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Capacitor: {
            ...actual.Capacitor,
            isNativePlatform: capacitorMock.isNativePlatform,
            getPlatform: capacitorMock.getPlatform
        }
    };
});

vi.mock('../cordova/facebook.js', () => ({ default: {} }));
vi.mock('../cordova/apple.js', () => ({ default: {} }));
vi.mock('../services/api', () => ({ AuthApi: class AuthApiMock {} }));
vi.mock('../services/bus-event.js', () => ({ default: { emit: vi.fn() } }));
vi.mock('../cordova/toast.js', () => ({ default: { toast: vi.fn() } }));
vi.mock('../utils/routerLazy.js', () => ({
    fireLazyRouterPush: vi.fn(),
    getLazyRouter: vi.fn()
}));
vi.mock('./notifications', () => ({
    useNotificationsStore: () => ({ add: vi.fn() })
}));

/** A notification opened by tapping it (not received in the foreground). */
function tappedNotification(url) {
    return { foreground: false, url, data: { type: 'announcement' } };
}

describe('cordova store: tapping a push notification', () => {
    let open;

    beforeEach(() => {
        setActivePinia(createPinia());
        open = vi.fn();
        vi.stubGlobal('open', open);
    });

    afterEach(() => {
        stubCapacitorPlatform(capacitorMock, 'web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
        vi.clearAllMocks();
    });

    it.each([
        ['web', 'https://carpoolear.com.ar/novedades'],
        ['android', 'https://www.carpoolear.com.ar/novedades'],
        ['ios', 'https://carpoolear.com.ar/novedades']
    ])(
        'on %s opens an announcement with an absolute url outside the app',
        async (platform, expectedUrl) => {
            stubCapacitorPlatform(capacitorMock, platform);
            const { fireLazyRouterPush } = await import('../utils/routerLazy.js');
            const { useCordovaStore } = await import('./cordova');

            await useCordovaStore().notificationArrive(
                tappedNotification('https://carpoolear.com.ar/novedades')
            );

            expect(open).toHaveBeenCalledWith(expectedUrl, '_blank');
            expect(fireLazyRouterPush).not.toHaveBeenCalled();
        }
    );

    it.each(['web', 'android', 'ios'])(
        'on %s still routes relative notification urls in-app',
        async (platform) => {
            stubCapacitorPlatform(capacitorMock, platform);
            const { fireLazyRouterPush } = await import('../utils/routerLazy.js');
            const { useCordovaStore } = await import('./cordova');

            await useCordovaStore().notificationArrive(
                tappedNotification('/trips/5')
            );

            expect(fireLazyRouterPush).toHaveBeenCalledWith({ path: '/trips/5' });
            expect(open).not.toHaveBeenCalled();
        }
    );
});
