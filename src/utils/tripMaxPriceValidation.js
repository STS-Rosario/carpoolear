export function exceedsMaximumSeatPrice({
    seatPriceUnits,
    maximumSeatPriceCents,
    maximumTripPriceCents
}) {
    if (maximumTripPriceCents <= 0) {
        return false;
    }
    if (seatPriceUnits === null) {
        return false;
    }
    return seatPriceUnits > maximumSeatPriceCents / 100;
}
