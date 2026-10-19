export function sortTripsNewestFirst(items) {
    if (!Array.isArray(items)) {
        return items;
    }

    return [...items].sort((a, b) => {
        const aDate = tripListDateValue(a);
        const bDate = tripListDateValue(b);
        if (aDate !== bDate) {
            return bDate - aDate;
        }

        return Number(b?.id || 0) - Number(a?.id || 0);
    });
}

function tripListDateValue(item) {
    const raw = item?.['trip_date'] ?? item?.trip?.['trip_date'];
    if (!raw) {
        return Number.NEGATIVE_INFINITY;
    }

    const value = new Date(raw).getTime();
    return Number.isNaN(value) ? Number.NEGATIVE_INFINITY : value;
}
