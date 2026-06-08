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
