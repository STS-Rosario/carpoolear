export function isNativePlatform() {
    return Boolean(
        typeof window !== 'undefined' &&
            window.Capacitor &&
            typeof window.Capacitor.isNativePlatform === 'function' &&
            window.Capacitor.isNativePlatform()
    );
}

export function isWebPlatform() {
    return !isNativePlatform();
}

export function isPWA() {
    if (isNativePlatform()) {
        return false;
    }
    if (typeof window === 'undefined') {
        return false;
    }
    const matchMedia =
        window.matchMedia && window.matchMedia.bind(window);
    const standalone = matchMedia && matchMedia('(display-mode: standalone)').matches;
    const fullscreen = matchMedia && matchMedia('(display-mode: fullscreen)').matches;
    const iosStandalone =
        window.navigator && window.navigator.standalone === true;
    return Boolean(standalone || fullscreen || iosStandalone);
}

export function isPlainWeb() {
    return !isNativePlatform() && !isPWA();
}

// Returns the dynamic module (a non-thenable ES module namespace), NOT the
// plugin object. The @capacitor/push-notifications export is a Capacitor Proxy
// that returns a wrapper for every property — including `then` — so awaiting
// that proxy makes the engine call `.then()` and throws
// "PushNotifications.then() is not implemented on android/ios". Awaiting the
// module namespace is safe; access `.PushNotifications` synchronously.
async function loadPushNotificationsModule() {
    return import('@capacitor/push-notifications');
}

export async function getNotificationPermissionStatus() {
    if (isNativePlatform()) {
        try {
            const { PushNotifications } = await loadPushNotificationsModule();
            const result = await PushNotifications.checkPermissions();
            return result.receive;
        } catch (error) {
            console.error(
                'Error checking native notification permission:',
                error
            );
            return 'unsupported';
        }
    }

    if (
        typeof window !== 'undefined' &&
        window.Notification &&
        window.Notification.permission
    ) {
        return window.Notification.permission;
    }

    return 'unsupported';
}

export async function requestNotificationPermission() {
    if (isNativePlatform()) {
        try {
            const { PushNotifications } = await loadPushNotificationsModule();
            const result = await PushNotifications.requestPermissions();
            return result.receive;
        } catch (error) {
            console.error(
                'Error requesting native notification permission:',
                error
            );
            return 'denied';
        }
    }

    if (
        typeof window !== 'undefined' &&
        window.Notification &&
        typeof window.Notification.requestPermission === 'function'
    ) {
        return await window.Notification.requestPermission();
    }

    return 'unsupported';
}
