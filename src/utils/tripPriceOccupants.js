export function occupantsForPriceCalculation(rearMaxTwoPassengers) {
    return Number(rearMaxTwoPassengers) > 0 ? 4 : 5;
}

export function seatPriceCentsFromTripPriceCents(
    tripPriceCents,
    rearMaxTwoPassengers
) {
    return Math.round(
        tripPriceCents / occupantsForPriceCalculation(rearMaxTwoPassengers)
    );
}
