import {
    FUEL_CONSUMPTION_LEVELS,
    FUEL_TYPES,
    fuelConsumptionI18nKey,
    fuelConsumptionRateLabel,
    fuelTypeI18nKey,
    hasCarFuelProfile
} from './carFields.js';
import {
    formatContributionDisplayAmount,
    formatPesoIntegerFromCents
} from './tripContributionDisplay.js';
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

function rateLabelFromBreakdown(breakdown, fuelType, level) {
    const fromProfile = fuelConsumptionRateLabel(fuelType, level);
    if (fromProfile) {
        return fromProfile;
    }

    const per100 = Number(breakdown && breakdown.fuel_consumption_per_100);
    if (!Number.isFinite(per100) || per100 <= 0) {
        return '';
    }

    const unit = breakdown.fuel_unit === 'm3' ? 'm³' : 'L';
    return `${per100} ${unit}/100km`;
}

export function resolveContributionFuelDisplay({
    breakdown,
    fuelProfile = null
} = {}) {
    const quantitySource =
        breakdown && breakdown.fuel_quantity != null
            ? breakdown.fuel_quantity
            : breakdown && breakdown.liters;
    const quantity = formatQuantity(quantitySource);

    const typeFromProfile =
        fuelProfile && hasCarFuelProfile(fuelProfile)
            ? fuelProfile.fuel_type
            : null;
    const levelFromProfile =
        fuelProfile && hasCarFuelProfile(fuelProfile)
            ? fuelProfile.fuel_consumption
            : null;
    const type =
        typeFromProfile ||
        (breakdown && FUEL_TYPES.includes(breakdown.fuel_type)
            ? breakdown.fuel_type
            : null);
    const level =
        levelFromProfile ||
        (breakdown && breakdown.fuel_consumption) ||
        null;

    if (!type) {
        const kilometersPerLiter =
            breakdown && breakdown.kilometers_per_liter;
        return {
            mode: 'legacy',
            quantity,
            kmPerLiter: kilometersPerLiter,
            litersPer100Km: litersPer100KmFromKmPerLiter(kilometersPerLiter)
        };
    }

    const unit =
        (breakdown && breakdown.fuel_unit) ||
        (type === 'gnc' ? 'm3' : 'liter');

    return {
        mode: 'typed',
        quantity,
        unitWordKey:
            unit === 'm3'
                ? 'tripContributionBreakdownFuelUnitM3'
                : 'tripContributionBreakdownFuelUnitLiters',
        fuelTypeKey: fuelTypeI18nKey(type),
        consumptionKey: FUEL_CONSUMPTION_LEVELS.includes(level)
            ? fuelConsumptionI18nKey(level)
            : null,
        rateLabel: rateLabelFromBreakdown(breakdown, type, level)
    };
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
        fuelCostInteger: formatPesoIntegerFromCents(breakdown.fuel_cents),
        tollsCostInteger: formatPesoIntegerFromCents(breakdown.tolls_cents),
        selladoCostInteger: formatPesoIntegerFromCents(selladoCents),
        totalInteger: formatPesoIntegerFromCents(breakdown.total_cents),
        perPersonInteger: formatPesoIntegerFromCents(breakdown.per_person_cents),
        kmPerLiter: breakdown.kilometers_per_liter,
        litersPer100Km: litersPer100KmFromKmPerLiter(
            breakdown.kilometers_per_liter
        )
    };
}
