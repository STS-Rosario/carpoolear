import { describe, expect, it } from 'vitest';
import {
    formatBreakdownLines,
    litersPer100KmFromKmPerLiter,
    resolveContributionFuelDisplay,
    shouldShowContributionBreakdown,
    withOccupants
} from './tripContributionBreakdown.js';

const baseBreakdown = {
    fuel_price_per_liter: 1000,
    kilometers_per_liter: 10,
    distance_km: 1,
    liters: 0.1,
    fuel_cents: 10000,
    tolls_percent: 10,
    tolls_cents: 1000,
    sellado_cents: 50,
    includes_sellado: true,
    total_cents: 11050,
    occupants: null,
    per_person_cents: null
};

describe('tripContributionBreakdown', () => {
    it('formats pesos with comma decimals', () => {
        const lines = formatBreakdownLines(baseBreakdown);

        expect(lines.fuelPricePerLiter).toBe('1000,00');
        expect(lines.fuelCost).toBe('100,00');
        expect(lines.tollsCost).toBe('10,00');
        expect(lines.selladoCost).toBe('0,50');
        expect(lines.total).toBe('110,50');
        expect(lines.liters).toBe('0,1');
        expect(lines.distanceKm).toBe('1');
        expect(lines.tollsPercent).toBe(10);
    });

    it('hides sellado when includes_sellado is false', () => {
        const lines = formatBreakdownLines({
            ...baseBreakdown,
            includes_sellado: false,
            sellado_cents: 0,
            total_cents: 11000
        });

        expect(lines.showSellado).toBe(false);
        expect(lines.selladoBonificado).toBe(false);
    });

    it('shows Bonificado when includes_sellado and sellado_cents is 0', () => {
        const lines = formatBreakdownLines({
            ...baseBreakdown,
            includes_sellado: true,
            sellado_cents: 0,
            total_cents: 11000
        });

        expect(lines.showSellado).toBe(true);
        expect(lines.selladoBonificado).toBe(true);
    });

    it('shows sellado amount when charged', () => {
        const lines = formatBreakdownLines(baseBreakdown);

        expect(lines.showSellado).toBe(true);
        expect(lines.selladoBonificado).toBe(false);
        expect(lines.selladoCost).toBe('0,50');
    });

    it('formats table amounts as integer pesos', () => {
        const lines = formatBreakdownLines({
            ...baseBreakdown,
            fuel_cents: 3840000,
            tolls_cents: 960000,
            sellado_cents: 160000,
            total_cents: 4960000,
            occupants: 4,
            per_person_cents: 1240000
        });

        expect(lines.fuelCostInteger).toBe('38.400');
        expect(lines.tollsCostInteger).toBe('9.600');
        expect(lines.selladoCostInteger).toBe('1.600');
        expect(lines.totalInteger).toBe('49.600');
        expect(lines.perPersonInteger).toBe('12.400');
    });

    it('fills occupants and per person from comfort preference when API left them null', () => {
        const five = withOccupants(baseBreakdown, false);
        expect(five.occupants).toBe(5);
        expect(five.per_person_cents).toBe(2210);

        const four = withOccupants(baseBreakdown, true);
        expect(four.occupants).toBe(4);
        expect(four.per_person_cents).toBe(2763);
    });

    it('keeps API occupants when already present', () => {
        const existing = {
            ...baseBreakdown,
            occupants: 5,
            per_person_cents: 2210
        };

        expect(withOccupants(existing, true).occupants).toBe(5);
        expect(withOccupants(existing, true).per_person_cents).toBe(2210);
    });

    it('derives liters per 100km from kilometers per liter', () => {
        expect(litersPer100KmFromKmPerLiter(10)).toBe(10);
        expect(litersPer100KmFromKmPerLiter(12.5)).toBe(8);
    });

    it('shows breakdown by default when the config flag is unset', () => {
        expect(shouldShowContributionBreakdown()).toBe(true);
        expect(shouldShowContributionBreakdown(null)).toBe(true);
        expect(shouldShowContributionBreakdown({})).toBe(true);
        expect(
            shouldShowContributionBreakdown({
                module_max_price_show_breakdown: undefined
            })
        ).toBe(true);
        expect(
            shouldShowContributionBreakdown({
                module_max_price_show_breakdown: true
            })
        ).toBe(true);
    });

    it('hides breakdown when the config flag is false', () => {
        expect(
            shouldShowContributionBreakdown({
                module_max_price_show_breakdown: false
            })
        ).toBe(false);
        expect(
            shouldShowContributionBreakdown({
                module_max_price_show_breakdown: 'false'
            })
        ).toBe(false);
    });

    it('builds typed fuel display for nafta with litros and rate', () => {
        const display = resolveContributionFuelDisplay({
            breakdown: {
                ...baseBreakdown,
                liters: 34.94,
                fuel_type: 'nafta_super',
                fuel_unit: 'liter',
                fuel_consumption_per_100: 12
            },
            fuelProfile: {
                fuel_type: 'nafta_super',
                fuel_consumption: 'high'
            }
        });

        expect(display).toEqual({
            mode: 'typed',
            quantity: '34,94',
            unitWordKey: 'tripContributionBreakdownFuelUnitLiters',
            fuelTypeKey: 'fuelTypeNaftaSuper',
            rateLabel: '12 L/100km'
        });
    });

    it('builds typed fuel display for GNC with real cubic meters', () => {
        const display = resolveContributionFuelDisplay({
            breakdown: {
                ...baseBreakdown,
                liters: 29.5,
                fuel_quantity: 29.5,
                fuel_type: 'gnc',
                fuel_unit: 'm3',
                fuel_consumption_per_100: 9
            },
            fuelProfile: {
                fuel_type: 'gnc',
                fuel_consumption: 'medium'
            }
        });

        expect(display.mode).toBe('typed');
        expect(display.quantity).toBe('29,5');
        expect(display.unitWordKey).toBe(
            'tripContributionBreakdownFuelUnitM3'
        );
        expect(display.fuelTypeKey).toBe('fuelTypeGnc');
        expect(display.rateLabel).toBe('9 m³/100km');
        expect(display.rateLabel).toContain('m³');
        expect(display.rateLabel).not.toContain('m3');
    });

    it('falls back to legacy premium fuel label when no fuel profile exists', () => {
        const display = resolveContributionFuelDisplay({
            breakdown: baseBreakdown,
            fuelProfile: null
        });

        expect(display).toEqual({
            mode: 'legacy',
            quantity: '0,1',
            kmPerLiter: 10,
            litersPer100Km: 10
        });
    });
});
