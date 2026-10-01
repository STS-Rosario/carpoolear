/**
 * Frontend port of the backend TripDescriptionContributionHelper heuristic
 * (carpoolear_backend app/Helpers/TripDescriptionContributionHelper.php):
 * finds money amounts written in a trip description ("$24000", "$24K",
 * "24 lucas") and flags when the highest one is above the trip seat price.
 */

const DOLLAR_AMOUNT_REGEX = /\$\s*(\d+(?:[.,]\d+)*)\s*([kK])?/gu;
const LUCAS_AMOUNT_REGEX = /(\d+(?:[.,]\d+)*)\s*lucas?/giu;

function normalizeAmountString(raw) {
    const hasComma = raw.includes(',');
    const hasDot = raw.includes('.');

    if (hasComma && hasDot) {
        if (raw.lastIndexOf(',') > raw.lastIndexOf('.')) {
            return raw.replace(/\./g, '').replace(/,/g, '.');
        }
        return raw.replace(/,/g, '');
    }

    if (hasComma) {
        if (/,\d{3}$/.test(raw)) {
            return raw.replace(/,/g, '');
        }
        return raw.replace(/,/g, '.');
    }

    if (hasDot && /\.\d{3}$/.test(raw)) {
        return raw.replace(/\./g, '');
    }

    return raw;
}

function parseNumericAmountToCents(raw, multiplyByThousands) {
    let pesos = parseFloat(normalizeAmountString(raw)) || 0;

    if (multiplyByThousands) {
        pesos *= 1000;
    }

    return Math.round(pesos * 100);
}

export function extractContributionAmountsCents(description) {
    const text = typeof description === 'string' ? description : '';
    const dollarAmounts = Array.from(text.matchAll(DOLLAR_AMOUNT_REGEX), (match) =>
        parseNumericAmountToCents(match[1], Boolean(match[2]))
    );
    const lucasAmounts = Array.from(text.matchAll(LUCAS_AMOUNT_REGEX), (match) =>
        parseNumericAmountToCents(match[1], true)
    );

    return [...new Set([...dollarAmounts, ...lucasAmounts])];
}

export function maxContributionAmountCents(description) {
    const amounts = extractContributionAmountsCents(description);

    if (amounts.length === 0) {
        return null;
    }

    return Math.max(...amounts);
}

export function potentialExcessContributionCents(description, seatPriceCents) {
    if (typeof seatPriceCents !== 'number' || !(seatPriceCents > 0)) {
        return null;
    }

    const maxAmountCents = maxContributionAmountCents(description);

    if (maxAmountCents === null || maxAmountCents <= seatPriceCents) {
        return null;
    }

    return maxAmountCents;
}

export function hasPotentialExcessContribution(description, seatPriceCents) {
    return potentialExcessContributionCents(description, seatPriceCents) !== null;
}
