export const MAX_AVAILABLE_SEATS_WITH_REAR_MAX_TWO = 3;

export function isRearMaxTwoCompatibleWithSeats(
    totalSeats,
    rearMaxTwoPassengers
) {
    if (!Number(rearMaxTwoPassengers)) {
        return true;
    }
    return Number(totalSeats) <= MAX_AVAILABLE_SEATS_WITH_REAR_MAX_TWO;
}

export function rearMaxTwoRequiresThreeOrFewerSeats(
    totalSeats,
    rearMaxTwoPassengers
) {
    return !isRearMaxTwoCompatibleWithSeats(totalSeats, rearMaxTwoPassengers);
}

export function shouldBlockSeatSelection(totalSeats, rearMaxTwoPassengers) {
    return rearMaxTwoRequiresThreeOrFewerSeats(totalSeats, rearMaxTwoPassengers);
}

export function shouldShowRearComfortNote(trip) {
    if (!trip) {
        return false;
    }

    const { rear_max_two_passengers: rearMaxTwoPassengers } = trip;

    return Number(rearMaxTwoPassengers) > 0;
}
