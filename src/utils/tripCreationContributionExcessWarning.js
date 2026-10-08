import { STEP } from './tripCreationSteps.js';
import { parseSeatPriceInput, seatPriceCentsForApi } from './tripSeatPrice.js';
import { hasPotentialExcessContribution } from './tripDescriptionContribution.js';

/** Drivers typing $16 when they mean $16000: warn if the input is over $0 and below $2000. */
export const IMPLAUSIBLY_LOW_CONTRIBUTION_INPUT_MAX_EXCLUSIVE = 2000;

export function isImplausiblyLowContributionInput(price) {
    const units = parseSeatPriceInput(price);
    return units !== null && units > 0 && units < IMPLAUSIBLY_LOW_CONTRIBUTION_INPUT_MAX_EXCLUSIVE;
}

/**
 * Steps whose "Siguiente" commits one side of the comparison: the
 * contribution (seat price) or the description that may ask for more.
 */
const CONTRIBUTION_EXCESS_CHECK_STEPS = [STEP.CONTRIBUTION, STEP.DESCRIPTION];

/**
 * Maximum allowed contribution per seat, the same cap the contribution step
 * validates the price against (trip-info `maximum_trip_price_cents` split by
 * occupants). Null when there is no maximum: max price module disabled, not
 * computed yet, or a voluntary / missing contribution.
 */
function maximumAllowedSeatPriceCents({
    price,
    maxPriceEnabled,
    maximumSeatPriceCents,
    maximumTripPriceCents
}) {
    const seatPriceCents = seatPriceCentsForApi(price);
    if (seatPriceCents === null || seatPriceCents <= 0) {
        return null;
    }

    if (!maxPriceEnabled || !(maximumTripPriceCents > 0) || !(maximumSeatPriceCents > 0)) {
        return null;
    }

    return maximumSeatPriceCents;
}

export function shouldShowContributionExcessWarning({
    step,
    description,
    price,
    maxPriceEnabled = false,
    maximumSeatPriceCents = 0,
    maximumTripPriceCents = 0,
    alreadyShown = false,
    isEdit = false
} = {}) {
    if (alreadyShown || isEdit) {
        return false;
    }

    if (!CONTRIBUTION_EXCESS_CHECK_STEPS.includes(step)) {
        return false;
    }

    if (isImplausiblyLowContributionInput(price)) {
        return true;
    }

    const maximumCents = maximumAllowedSeatPriceCents({
        price,
        maxPriceEnabled,
        maximumSeatPriceCents,
        maximumTripPriceCents
    });
    if (maximumCents === null) {
        return false;
    }

    return hasPotentialExcessContribution(description, maximumCents);
}
