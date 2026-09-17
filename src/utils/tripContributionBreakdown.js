import { formatContributionDisplayAmount } from './tripContributionDisplay.js';
import {
    occupantsForPriceCalculation,
    seatPriceCentsFromTripPriceCents
} from './tripPriceOccupants.js';

export function litersPer100KmFromKmPerLiter(kilometersPerLiter) {
    const kmPerLiter = Number(kilometersPerLiter);
    if (!Number.isFinite(kmPerLiter) || kmPerLiter <= 0) {
        return 0;
    }
    return 100 / kmPerLiter;
}

export function shouldShowContributionBreakdown(config) {
    const value = config && config.module_max_price_show_breakdown;
    if (value === undefined || value === null) {
        return true;
    }
    if (value === false || value === 0 || value === '0' || value === 'false') {
        return false;
    }
    return true;
}

export function withOccupants(breakdown, rearMaxTwoPassengers) {
    if (!breakdown) {
        return null;
    }
    if (breakdown.occupants != null && breakdown.per_person_cents != null) {
        return breakdown;
    }

    return {
        ...breakdown,
        occupants: occupantsForPriceCalculation(rearMaxTwoPassengers),
        per_person_cents: seatPriceCentsFromTripPriceCents(
            breakdown.total_cents,
            rearMaxTwoPassengers
        )
    };
}

function formatQuantity(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
        return '0';
    }
    return String(Number(amount.toFixed(2))).replace('.', ',');
}

export function formatBreakdownLines(breakdown) {
    const includesSellado = Boolean(breakdown.includes_sellado);
    const selladoCents = Number(breakdown.sellado_cents) || 0;

    return {
        fuelPricePerLiter: formatContributionDisplayAmount(
            Number(breakdown.fuel_price_per_liter) * 100
        ),
        liters: formatQuantity(breakdown.liters),
        distanceKm: formatQuantity(breakdown.distance_km),
        fuelCost: formatContributionDisplayAmount(breakdown.fuel_cents),
        tollsCost: formatContributionDisplayAmount(breakdown.tolls_cents),
        tollsPercent: breakdown.tolls_percent,
        showSellado: includesSellado,
        selladoBonificado: includesSellado && selladoCents <= 0,
        selladoCost: formatContributionDisplayAmount(selladoCents),
        total: formatContributionDisplayAmount(breakdown.total_cents),
        occupants: breakdown.occupants,
        perPerson: formatContributionDisplayAmount(breakdown.per_person_cents),
        kmPerLiter: breakdown.kilometers_per_liter,
        litersPer100Km: litersPer100KmFromKmPerLiter(
            breakdown.kilometers_per_liter
        )
    };
}
