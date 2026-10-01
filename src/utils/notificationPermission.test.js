import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false),
        getPlatform: vi.fn(() => 'web')
    }
}));

vi.mock('@capacitor/push-notifications', () => ({
    PushNotifications: {
        checkPermissions: vi.fn(),
        requestPermissions: vi.fn(),
        register: vi.fn()
    }
}));

describe('isNativePlatform', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('returns false on web (no window.Capacitor.isNativePlatform true)', async () => {
        globalThis.window = {};
        const { isNativePlatform } = await import('./notificationPermission.js');
        expect(isNativePlatform()).toBe(false);
    });

    it('returns true when Capacitor reports a native platform', async () => {
        globalThis.window = {
            Capacitor: {
                isNativePlatform: () => true
            }
        };
        const { isNativePlatform } = await import('./notificationPermission.js');
        expect(isNativePlatform()).toBe(true);
    });
});

describe('isPWA', () => {
    afterEach(() => {
        vi.resetModules();
    });

    it('returns false on plain web (browser display-mode)', async () => {
        globalThis.window = {
            matchMedia: vi.fn((query) => ({
                matches: false,
                media: query
            }))
        };
        const { isPWA } = await import('./notificationPermission.js');
        expect(isPWA()).toBe(false);
    });

    it('returns true when display-mode is standalone', async () => {
        globalThis.window = {
            matchMedia: vi.fn((query) => ({
                matches: query === '(display-mode: standalone)',
                media: query
            }))
        };
        const { isPWA } = await import('./notificationPermission.js');
        expect(isPWA()).toBe(true);
    });

    it('returns true on iOS Safari standalone (navigator.standalone)', async () => {
        globalThis.window = {
            matchMedia: vi.fn((query) => ({ matches: false, media: query })),
            navigator: { standalone: true }
        };
        const { isPWA } = await import('./notificationPermission.js');
        expect(isPWA()).toBe(true);
    });

    it('returns false on native Capacitor even if display-mode matches', async () => {
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true },
            matchMedia: vi.fn((query) => ({
                matches: query === '(display-mode: standalone)',
                media: query
            }))
        };
        const { isPWA } = await import('./notificationPermission.js');
        expect(isPWA()).toBe(false);
    });
});

describe('isWebNotificationPermissionGranted', () => {
    afterEach(() => {
        vi.resetModules();
    });

    it('returns false when the Notification API is missing', async () => {
        globalThis.window = {};
        const { isWebNotificationPermissionGranted } = await import(
            './notificationPermission.js'
        );
        expect(isWebNotificationPermissionGranted()).toBe(false);
    });

    it('returns false when window is undefined', async () => {
        const previousWindow = globalThis.window;
        // eslint-disable-next-line no-global-assign
        globalThis.window = undefined;
        const { isWebNotificationPermissionGranted } = await import(
            './notificationPermission.js'
        );
        expect(isWebNotificationPermissionGranted()).toBe(false);
        globalThis.window = previousWindow;
    });

    it('returns false when permission is denied', async () => {
        globalThis.window = {
            Notification: { permission: 'denied' }
        };
        const { isWebNotificationPermissionGranted } = await import(
            './notificationPermission.js'
        );
        expect(isWebNotificationPermissionGranted()).toBe(false);
    });

    it('returns true when web notification permission is granted', async () => {
        globalThis.window = {
            Notification: { permission: 'granted' }
        };
        const { isWebNotificationPermissionGranted } = await import(
            './notificationPermission.js'
        );
        expect(isWebNotificationPermissionGranted()).toBe(true);
    });
});

describe('getNotificationPermissionStatus', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('reads window.Notification.permission on web', async () => {
        globalThis.window = {
            Notification: { permission: 'granted' }
        };
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const { getNotificationPermissionStatus } = await import(
            './notificationPermission.js'
        );
        expect(await getNotificationPermissionStatus()).toBe('granted');
    });

    it('returns unsupported on web when Notification API is missing', async () => {
        globalThis.window = {};
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const { getNotificationPermissionStatus } = await import(
            './notificationPermission.js'
        );
        expect(await getNotificationPermissionStatus()).toBe('unsupported');
    });

    it('uses PushNotifications.checkPermissions on native', async () => {
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true }
        };
        const { PushNotifications } = await import('@capacitor/push-notifications');
        PushNotifications.checkPermissions.mockResolvedValue({ receive: 'denied' });
        const { getNotificationPermissionStatus } = await import(
            './notificationPermission.js'
        );
        expect(await getNotificationPermissionStatus()).toBe('denied');
        expect(PushNotifications.checkPermissions).toHaveBeenCalled();
    });

    it('returns unsupported on native when checkPermissions throws', async () => {
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true }
        };
        const { PushNotifications } = await import('@capacitor/push-notifications');
        PushNotifications.checkPermissions.mockRejectedValue(new Error('boom'));
        const { getNotificationPermissionStatus } = await import(
            './notificationPermission.js'
        );
        expect(await getNotificationPermissionStatus()).toBe('unsupported');
    });
});

describe('requestNotificationPermission', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('calls window.Notification.requestPermission on web', async () => {
        globalThis.window = {
            Notification: {
                permission: 'default',
                requestPermission: vi.fn().mockResolvedValue('granted')
            }
        };
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const { requestNotificationPermission } = await import(
            './notificationPermission.js'
        );
        expect(await requestNotificationPermission()).toBe('granted');
    });

    it('returns unsupported on web when Notification API is missing', async () => {
        globalThis.window = {};
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const { requestNotificationPermission } = await import(
            './notificationPermission.js'
        );
        expect(await requestNotificationPermission()).toBe('unsupported');
    });

    it('calls PushNotifications.requestPermissions on native and returns status', async () => {
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true }
        };
        const { PushNotifications } = await import('@capacitor/push-notifications');
        PushNotifications.requestPermissions.mockResolvedValue({
            receive: 'granted'
        });
        const { requestNotificationPermission } = await import(
            './notificationPermission.js'
        );
        expect(await requestNotificationPermission()).toBe('granted');
        expect(PushNotifications.requestPermissions).toHaveBeenCalled();
    });

    it('returns denied on native when requestPermissions throws', async () => {
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true }
        };
        const { PushNotifications } = await import('@capacitor/push-notifications');
        PushNotifications.requestPermissions.mockRejectedValue(new Error('boom'));
        const { requestNotificationPermission } = await import(
            './notificationPermission.js'
        );
        expect(await requestNotificationPermission()).toBe('denied');
    });
});
