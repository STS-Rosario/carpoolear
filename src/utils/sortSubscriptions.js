/**
 * Sort trip alert subscriptions: passengers first, then conductores,
 * then by date ascending, then by place name ascending.
 */
export function sortSubscriptions(subscriptions) {
    if (!Array.isArray(subscriptions)) {
        return [];
    }

    return [...subscriptions].sort((a, b) => {
        const aRole = a && Number(a.is_passenger) === 1 ? 0 : 1;
        const bRole = b && Number(b.is_passenger) === 1 ? 0 : 1;
        if (aRole !== bRole) {
            return aRole - bRole;
        }

        const aDate = subscriptionDateValue(a);
        const bDate = subscriptionDateValue(b);
        if (aDate !== bDate) {
            return aDate - bDate;
        }

        const aName = subscriptionSortName(a);
        const bName = subscriptionSortName(b);
        return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
    });
}

function subscriptionDateValue(subscription) {
    if (!subscription || !subscription.trip_date) {
        return Number.POSITIVE_INFINITY;
    }
    const value = new Date(subscription.trip_date).getTime();
    return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function subscriptionSortName(subscription) {
    if (!subscription) {
        return '';
    }
    return String(
        subscription.to_address || subscription.from_address || ''
    ).trim();
}
