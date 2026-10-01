import { describe, expect, it } from 'vitest';
import {
    extractContributionAmountsCents,
    hasPotentialExcessContribution,
    maxContributionAmountCents,
    potentialExcessContributionCents
} from './tripDescriptionContribution.js';

// Mirrors carpoolear_backend tests/Unit/Helpers/TripDescriptionContributionHelperTest.php
describe('tripDescriptionContribution', () => {
    const seatPriceCents = 1500000; // $15.000

    describe('potentialExcessContributionCents', () => {
        it('detects dollar amount above seat price', () => {
            expect(
                potentialExcessContributionCents(
                    'La contribución es de $24000 por persona',
                    seatPriceCents
                )
            ).toBe(2400000);
        });

        it('detects k suffix amounts', () => {
            expect(
                potentialExcessContributionCents('Pago $24K cada uno', seatPriceCents)
            ).toBe(2400000);
            expect(
                potentialExcessContributionCents('Pago $24k cada uno', seatPriceCents)
            ).toBe(2400000);
        });

        it('detects lucas amounts', () => {
            expect(
                potentialExcessContributionCents('Son 24 lucas por persona', seatPriceCents)
            ).toBe(2400000);
            expect(
                potentialExcessContributionCents('Son 24 LUCA por persona', seatPriceCents)
            ).toBe(2400000);
        });

        it('returns null when description amount is not higher', () => {
            expect(
                potentialExcessContributionCents('Contribución $15000', seatPriceCents)
            ).toBeNull();
            expect(
                potentialExcessContributionCents('Solo 10 lucas', seatPriceCents)
            ).toBeNull();
        });

        it('returns null for voluntary or non-positive seat price', () => {
            expect(potentialExcessContributionCents('$24000', -1)).toBeNull();
            expect(potentialExcessContributionCents('$24000', 0)).toBeNull();
            expect(potentialExcessContributionCents('$24000', null)).toBeNull();
        });

        it('returns null when the description has no amounts', () => {
            expect(
                potentialExcessContributionCents('Salgo puntual, sin mascotas', seatPriceCents)
            ).toBeNull();
            expect(potentialExcessContributionCents('', seatPriceCents)).toBeNull();
            expect(potentialExcessContributionCents(null, seatPriceCents)).toBeNull();
        });

        it('uses the highest amount found in the description', () => {
            expect(
                potentialExcessContributionCents(
                    'Peajes $5000, contribución $20.000',
                    seatPriceCents
                )
            ).toBe(2000000);
        });
    });

    describe('hasPotentialExcessContribution', () => {
        it('reflects potential amount', () => {
            expect(hasPotentialExcessContribution('$24000', 1500000)).toBe(true);
            expect(hasPotentialExcessContribution('$15000', 1500000)).toBe(false);
        });
    });

    describe('extractContributionAmountsCents', () => {
        it('normalizes thousands and decimal separators like the backend', () => {
            expect(extractContributionAmountsCents('$24.000')).toEqual([2400000]);
            expect(extractContributionAmountsCents('$24,000')).toEqual([2400000]);
            expect(extractContributionAmountsCents('$1.234,50')).toEqual([123450]);
            expect(extractContributionAmountsCents('$1,234.50')).toEqual([123450]);
            expect(extractContributionAmountsCents('$15,5')).toEqual([1550]);
            expect(extractContributionAmountsCents('$ 15.5')).toEqual([1550]);
            expect(extractContributionAmountsCents('2,5 lucas')).toEqual([250000]);
        });

        it('deduplicates repeated amounts', () => {
            expect(extractContributionAmountsCents('$24000 o 24 lucas')).toEqual([2400000]);
        });
    });

    describe('maxContributionAmountCents', () => {
        it('returns null without amounts and the max otherwise', () => {
            expect(maxContributionAmountCents('sin montos')).toBeNull();
            expect(maxContributionAmountCents('$10000 y $30000')).toBe(3000000);
        });
    });
});
