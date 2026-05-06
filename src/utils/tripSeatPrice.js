/** Sentinel stored in seat_price_cents when the driver chose “lo que se pueda aportar” (explicit zero in the form). */
export const VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS = -1;

export function parseSeatPriceInput(value) {
    if (value === '' || value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function seatPriceCentsForApi(raw) {
    const p = parseSeatPriceInput(raw);
    if (p === null) {
        return null;
    }
    if (p === 0) {
        return VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS;
    }
    return Math.round(p * 100);
}

export function priceInputNumberFromStoredSeatPriceCents(seatPriceCents) {
    if (seatPriceCents == null) {
        return null;
    }
    if (seatPriceCents === VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS) {
        return 0;
    }
    return seatPriceCents / 100;
}

export function isVoluntaryContributionSeatPrice(seatPriceCents) {
    return seatPriceCents === VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS;
}

export function shouldShowTripSeatPriceSection(seatPriceCents) {
    return (
        isVoluntaryContributionSeatPrice(seatPriceCents) ||
        (typeof seatPriceCents === 'number' && seatPriceCents > 0)
    );
}
