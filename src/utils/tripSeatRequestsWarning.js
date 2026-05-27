export function shouldShowTripSeatRequestsWarning(owner, passengerPendingCount) {
    return Boolean(owner) && Number(passengerPendingCount) > 0;
}
