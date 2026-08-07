import { isUpcomingTrip } from './isUpcomingTrip.js';

export function shouldShowTripSeatRequestsWarning(
    owner,
    passengerPendingCount,
    seatRequestLimitReached = false
) {
    return (
        Boolean(owner) &&
        Number(passengerPendingCount) > 0 &&
        !seatRequestLimitReached
    );
}

export function shouldShowDriverSeatRequestLimitWarning(owner, trip) {
    return (
        Boolean(owner) &&
        Boolean(trip?.['seat_request_limit_reached']) &&
        isUpcomingTrip(trip)
    );
}

export function shouldShowPassengerSeatRequestLimitMessage(owner, trip) {
    return (
        !owner &&
        Boolean(trip?.['seat_request_limit_reached']) &&
        !trip?.request
    );
}
