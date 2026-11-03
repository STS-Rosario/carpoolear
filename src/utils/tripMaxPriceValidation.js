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

export function resolveLiveContributionPriceError({
    isNegative,
    exceedsMax,
    negativeMessage,
    maxExceededMessage
}) {
    if (isNegative) {
        return { state: true, message: negativeMessage };
    }
    if (exceedsMax) {
        return { state: true, message: maxExceededMessage };
    }
    return { state: false, message: '' };
}
