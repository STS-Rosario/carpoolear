import { describe, expect, it } from 'vitest';
import {
    occupantsForPriceCalculation,
    seatPriceCentsFromTripPriceCents
} from './tripPriceOccupants.js';

describe('tripPriceOccupants', () => {
    describe('occupantsForPriceCalculation', () => {
        it('uses 4 occupants when rear max two passengers is enabled', () => {
            expect(occupantsForPriceCalculation(true)).toBe(4);
            expect(occupantsForPriceCalculation(1)).toBe(4);
            expect(occupantsForPriceCalculation('1')).toBe(4);
        });

        it('uses 5 occupants when rear max two passengers is disabled', () => {
            expect(occupantsForPriceCalculation(false)).toBe(5);
            expect(occupantsForPriceCalculation(0)).toBe(5);
            expect(occupantsForPriceCalculation(null)).toBe(5);
            expect(occupantsForPriceCalculation(undefined)).toBe(5);
        });
    });

    describe('seatPriceCentsFromTripPriceCents', () => {
        it('divides trip price by comfort-based occupants, not available seats', () => {
            const tripPriceCents = 6345351;

            expect(seatPriceCentsFromTripPriceCents(tripPriceCents, false)).toBe(
                Math.round(tripPriceCents / 5)
            );
            expect(seatPriceCentsFromTripPriceCents(tripPriceCents, true)).toBe(
                Math.round(tripPriceCents / 4)
            );
        });
    });
});
