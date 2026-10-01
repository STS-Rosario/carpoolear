import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip contribution breakdown labels', () => {
    it.each(['arg', 'chl'])(
        '%s locale describes the average contribution line items',
        (locale) => {
            expect(messages[locale].tripContributionBreakdownFuelLiter).toBe(
                'Costo de 1L de nafta: $ {amount}'
            );
            expect(messages[locale].tripContributionBreakdownLiters).toBe(
                'Litros de nafta de trayecto: {liters}L ({km}km)'
            );
            expect(
                messages[locale].tripContributionBreakdownConsumptionTooltip
            ).toBe(
                'Usamos un consumo promedio de {kmPerLiter} km/L ({litersPer100km} L/100km) para el cálculo.'
            );
            expect(messages[locale].tripContributionBreakdownFuelCost).toBe(
                'Costo de nafta para trayecto: $ {pricePerLiter} x {liters}L = $ {amount}'
            );
            expect(messages[locale].tripContributionBreakdownTolls).toBe(
                'Estimación de peajes: $ {amount} ({percent}%)'
            );
            expect(messages[locale].tripContributionBreakdownSellado).toBe(
                'Sellado de viaje: $ {amount}'
            );
            expect(
                messages[locale].tripContributionBreakdownSelladoBonificado
            ).toBe('Bonificado');
            expect(messages[locale].tripContributionBreakdownTotal).toBe(
                'Total: $ {fuel} + $ {tolls}'
            );
            expect(
                messages[locale].tripContributionBreakdownTotalWithSellado
            ).toBe('Total: $ {fuel} + $ {tolls} + $ {sellado}');
            expect(
                messages[locale].tripContributionBreakdownTotalWithSelladoBonificado
            ).toBe('Total: $ {fuel} + $ {tolls} + {sellado}');
            expect(messages[locale].tripContributionBreakdownOccupants).toBe(
                'Asientos considerados: {count} asientos'
            );
            expect(messages[locale].tripContributionBreakdownPerPerson).toBe(
                'Costo por persona: $ {total} / {count} = $ {amount}'
            );
        }
    );

    it('en locale describes the average contribution line items', () => {
        expect(messages.en.tripContributionBreakdownFuelLiter).toBe(
            'Cost of 1L of fuel: $ {amount}'
        );
        expect(messages.en.tripContributionBreakdownLiters).toBe(
            'Fuel for the route: {liters}L ({km}km)'
        );
        expect(messages.en.tripContributionBreakdownConsumptionTooltip).toBe(
            'We use an average consumption of {kmPerLiter} km/L ({litersPer100km} L/100km) for the calculation.'
        );
        expect(messages.en.tripContributionBreakdownFuelCost).toBe(
            'Fuel cost for the route: $ {pricePerLiter} x {liters}L = $ {amount}'
        );
        expect(messages.en.tripContributionBreakdownTolls).toBe(
            'Estimated tolls: $ {amount} ({percent}%)'
        );
        expect(messages.en.tripContributionBreakdownSellado).toBe(
            'Trip seal: $ {amount}'
        );
        expect(messages.en.tripContributionBreakdownSelladoBonificado).toBe(
            'Waived'
        );
        expect(messages.en.tripContributionBreakdownTotal).toBe(
            'Total: $ {fuel} + $ {tolls}'
        );
        expect(messages.en.tripContributionBreakdownTotalWithSellado).toBe(
            'Total: $ {fuel} + $ {tolls} + $ {sellado}'
        );
        expect(
            messages.en.tripContributionBreakdownTotalWithSelladoBonificado
        ).toBe('Total: $ {fuel} + $ {tolls} + {sellado}');
        expect(messages.en.tripContributionBreakdownOccupants).toBe(
            'Seats considered: {count} seats'
        );
        expect(messages.en.tripContributionBreakdownPerPerson).toBe(
            'Cost per person: $ {total} / {count} = $ {amount}'
        );
    });
});
