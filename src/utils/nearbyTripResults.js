import dayjs from '../dayjs';

function isNearbyTrip(trip, searchDate) {
    if (!searchDate || !trip?.trip_date) {
        return false;
    }

    return (
        dayjs(trip.trip_date).format('YYYY-MM-DD') !==
        dayjs(searchDate).format('YYYY-MM-DD')
    );
}

export function shouldShowNearbyResultsHeader(trip, searchDate, previousTrips = []) {
    if (!isNearbyTrip(trip, searchDate)) {
        return false;
    }

    return !previousTrips.some((previousTrip) =>
        isNearbyTrip(previousTrip, searchDate)
    );
}
