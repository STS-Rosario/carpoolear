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

async function loadPushNotifications() {
    const module = await import('@capacitor/push-notifications');
    return module.PushNotifications;
}

export async function getNotificationPermissionStatus() {
    if (isNativePlatform()) {
        try {
            const PushNotifications = await loadPushNotifications();
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
            const PushNotifications = await loadPushNotifications();
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
