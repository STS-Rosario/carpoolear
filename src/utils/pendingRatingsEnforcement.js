export const PENDING_RATINGS_REDIRECT_ROUTE = { name: 'my-trips' };

export function hasPendingRatings(pendingRates) {
    return Array.isArray(pendingRates) && pendingRates.length > 0;
}

export function shouldRedirectForPendingRatings(pendingRates, routeName) {
    if (!hasPendingRatings(pendingRates)) {
        return false;
    }
    if (routeName === 'my-trips') {
        return false;
    }
    return true;
}

export function performPendingRatingsRedirectIfRequired(pendingRates, router) {
    if (!hasPendingRatings(pendingRates)) {
        return false;
    }
    router.push(PENDING_RATINGS_REDIRECT_ROUTE);
    return true;
}
