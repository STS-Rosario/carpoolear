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
