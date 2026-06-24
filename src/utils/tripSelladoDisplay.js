export const TRIP_STATE_READY = 'ready';

export function isSelladoPending(trip) {
    if (!trip) {
        return false;
    }

    if (trip.sellado_pending != null) {
        return Boolean(trip.sellado_pending);
    }

    return Boolean(trip.needs_sellado) && trip.state !== TRIP_STATE_READY;
}

export function shouldShowSelladoPending(trip, currentUser) {
    if (!isSelladoPending(trip)) {
        return false;
    }

    if (!currentUser?.id || !trip.user?.id) {
        return false;
    }

    return currentUser.id === trip.user.id;
}
