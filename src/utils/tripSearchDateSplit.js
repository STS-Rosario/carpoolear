import dayjs from '../dayjs';

function tripDayKey(tripDate) {
    return dayjs(tripDate).format('YYYY-MM-DD');
}

export function splitTripsBySearchDate(trips = [], searchDate) {
    if (!searchDate) {
        return {
            exactTrips: Array.isArray(trips) ? [...trips] : [],
            nearbyTrips: []
        };
    }

    const searchKey = dayjs(searchDate).format('YYYY-MM-DD');
    const exactTrips = [];
    const nearbyTrips = [];

    (Array.isArray(trips) ? trips : []).forEach((trip) => {
        if (!trip || !trip.trip_date) {
            exactTrips.push(trip);
            return;
        }
        if (tripDayKey(trip.trip_date) === searchKey) {
            exactTrips.push(trip);
        } else {
            nearbyTrips.push(trip);
        }
    });

    return { exactTrips, nearbyTrips };
}
