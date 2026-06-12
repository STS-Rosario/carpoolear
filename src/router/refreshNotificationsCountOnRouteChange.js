import { shouldRefreshNotificationsCountOnRoute } from './shouldRefreshNotificationsCountOnRoute.js';

export function refreshNotificationsCountOnRouteChange(
    authStore,
    notificationsStore,
    to,
    from
) {
    if (
        authStore.checkLogin &&
        shouldRefreshNotificationsCountOnRoute(to, from)
    ) {
        notificationsStore.countAction();
    }
}
