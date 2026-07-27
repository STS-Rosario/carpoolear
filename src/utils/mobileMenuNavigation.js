export function snapshotRoute(route) {
    if (!route || !route.name) {
        return null;
    }
    return {
        name: route.name,
        params: { ...(route.params || {}) },
        query: { ...(route.query || {}) }
    };
}

export function defaultMobileMenuReturnRoute() {
    return {
        name: 'trips',
        params: {},
        query: { clearSearch: 'true' }
    };
}

export function resolveMobileMenuCloseTarget(returnRoute) {
    if (returnRoute && returnRoute.name && returnRoute.name !== 'mobile-menu') {
        return returnRoute;
    }
    return defaultMobileMenuReturnRoute();
}
