export function refreshNotificationsCountOnRouteChange(authStore, notificationsStore) {
    if (authStore.checkLogin) {
        notificationsStore.countAction();
    }
}
