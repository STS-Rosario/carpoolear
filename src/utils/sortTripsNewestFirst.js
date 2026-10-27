export function sortTripsNewestFirst(items) {
    return sortTripsByDate(items, true);
}

export function sortTripsOldestFirst(items) {
    return sortTripsByDate(items, false);
}

function sortTripsByDate(items, newestFirst) {
    if (!Array.isArray(items)) {
        return items;
    }

    return [...items].sort((a, b) => {
        const aDate = tripListDateValue(a, newestFirst);
        const bDate = tripListDateValue(b, newestFirst);
        if (aDate !== bDate) {
            return newestFirst ? bDate - aDate : aDate - bDate;
        }

        const aId = Number(a?.id || 0);
        const bId = Number(b?.id || 0);
        return newestFirst ? bId - aId : aId - bId;
    });
}

function tripListDateValue(item, newestFirst) {
    const missing = newestFirst
        ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY;
    const raw = item?.['trip_date'] ?? item?.trip?.['trip_date'];
    if (!raw) {
        return missing;
    }

    const value = new Date(raw).getTime();
    return Number.isNaN(value) ? missing : value;
}
