import dayjs from '../dayjs';

export function isUpcomingTrip(trip, dateProvider = dayjs) {
    if (!trip) {
        return false;
    }
    if (trip.weekly_schedule > 0) {
        return true;
    }
    if (!trip.trip_date) {
        return true;
    }

    const current = dateProvider();
    return !dateProvider(trip.trip_date).isBefore(current);
}
