export function isWebPushActive(config) {
    return (
        config &&
        config.web_push_notification &&
        typeof window !== 'undefined' &&
        window.Notification &&
        window.Notification.permission === 'granted'
    );
}

export function shouldPollNotificationCount(config) {
    return !isWebPushActive(config);
}
