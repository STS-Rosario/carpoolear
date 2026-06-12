function routeParamsChanged(to, from) {
    return JSON.stringify(to.params || {}) !== JSON.stringify(from.params || {});
}

export function shouldRefreshNotificationsCountOnRoute(to, from) {
    if (!from || !from.name) {
        return true;
    }
    if (to.name !== from.name) {
        return true;
    }
    return routeParamsChanged(to, from);
}
