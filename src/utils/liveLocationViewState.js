export function isLiveShareStopped(view) {
    return Boolean(view && view.is_active === false);
}

export function isWaitingForLiveLocation(view) {
    return Boolean(
        view &&
            view.is_active !== false &&
            (view.lat == null || view.lng == null)
    );
}

export function getTripLiveLocationViewMode(tripView, loaded) {
    if (!loaded) {
        return 'loading';
    }
    if (isLiveShareStopped(tripView)) {
        return 'stopped';
    }
    if (tripView) {
        return 'active';
    }
    return 'waiting';
}

export function getPublicLiveLocationViewMode(publicView, loaded) {
    if (!loaded) {
        return 'loading';
    }
    if (!publicView) {
        return 'notFound';
    }
    if (isLiveShareStopped(publicView)) {
        return 'stopped';
    }
    return 'active';
}
