import { describe, expect, it, vi, afterEach } from 'vitest';

// Faithful replica of the Capacitor plugin Proxy produced by `registerPlugin`.
// The real proxy (node_modules/@capacitor/core/dist/index.js) returns a method
// wrapper for *every* property access, including `then`. There is no special
// case for `then`, so awaiting the plugin object itself makes the JS engine
// call `.then(resolve, reject)`, which hits Capacitor's `notImplemented` path
// and throws `"PushNotifications.then()" is not implemented on <platform>`.
//
// On Android/iOS this surfaces as:
//   Uncaught (in promise) s: "PushNotifications.then()" is not implemented on android
// triggered by `await loadPushNotifications()` in notificationPermission.js.
function createCapacitorProxy(pluginName, platform, methodImpls) {
    return new Proxy(
        {},
        {
            get(_target, prop) {
                if (typeof prop !== 'string') {
                    return undefined;
                }
                if (prop === '$$typeof') {
                    return undefined;
                }
                if (prop === 'toJSON') {
                    return () => ({});
                }
                if (prop === 'then') {
                    // Mimic Capacitor: no special-case for `then`, so the
                    // wrapper throws the unimplemented error when invoked.
                    return () => {
                        throw new Error(
                            `"${pluginName}.${prop}()" is not implemented on ${platform}`
                        );
                    };
                }
                const impl = methodImpls[prop];
                if (impl) {
                    return impl;
                }
                return () => {
                    throw new Error(
                        `"${pluginName}.${prop}()" is not implemented on ${platform}`
                    );
                };
            }
        }
    );
}

describe('notificationPermission — Capacitor proxy thenable trap regression', () => {
    afterEach(() => {
        vi.resetModules();
        vi.doUnmock('@capacitor/push-notifications');
    });

    async function importWithCapacitorProxy({
        platform,
        checkPermissions,
        requestPermissions
    }) {
        vi.resetModules();
        globalThis.window = {
            Capacitor: { isNativePlatform: () => true }
        };
        const proxy = createCapacitorProxy('PushNotifications', platform, {
            checkPermissions: () => Promise.resolve(checkPermissions),
            requestPermissions: () => Promise.resolve(requestPermissions)
        });
        vi.doMock('@capacitor/push-notifications', () => ({
            PushNotifications: proxy
        }));
        return import('./notificationPermission.js');
    }

    it('requestNotificationPermission resolves to granted on android (no .then() trap)', async () => {
        const { requestNotificationPermission } = await importWithCapacitorProxy({
            platform: 'android',
            checkPermissions: { receive: 'denied' },
            requestPermissions: { receive: 'granted' }
        });
        await expect(requestNotificationPermission()).resolves.toBe('granted');
    });

    it('requestNotificationPermission resolves to denied on android when denied', async () => {
        const { requestNotificationPermission } = await importWithCapacitorProxy({
            platform: 'android',
            checkPermissions: { receive: 'denied' },
            requestPermissions: { receive: 'denied' }
        });
        await expect(requestNotificationPermission()).resolves.toBe('denied');
    });

    it('getNotificationPermissionStatus reads checkPermissions on android (no .then() trap)', async () => {
        const { getNotificationPermissionStatus } = await importWithCapacitorProxy({
            platform: 'android',
            checkPermissions: { receive: 'prompt' },
            requestPermissions: { receive: 'granted' }
        });
        await expect(getNotificationPermissionStatus()).resolves.toBe('prompt');
    });

    it('requestNotificationPermission resolves to granted on ios', async () => {
        const { requestNotificationPermission } = await importWithCapacitorProxy({
            platform: 'ios',
            checkPermissions: { receive: 'denied' },
            requestPermissions: { receive: 'granted' }
        });
        await expect(requestNotificationPermission()).resolves.toBe('granted');
    });
});
