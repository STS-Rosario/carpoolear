import { describe, expect, it } from 'vitest';
import { exceedsMaximumSeatPrice } from './tripMaxPriceValidation.js';

describe('exceedsMaximumSeatPrice', () => {
    it('does not flag exceeded max contribution before trip-info loads', () => {
        expect(
            exceedsMaximumSeatPrice({
                seatPriceUnits: 50,
                maximumSeatPriceCents: 0,
                maximumTripPriceCents: 0
            })
        ).toBe(false);
    });

    it('flags exceeded max contribution once trip-info cap is available', () => {
        expect(
            exceedsMaximumSeatPrice({
                seatPriceUnits: 50,
                maximumSeatPriceCents: 4000,
                maximumTripPriceCents: 20000
            })
        ).toBe(true);
    });

    it('does not flag when seat price is within the cap', () => {
        expect(
            exceedsMaximumSeatPrice({
                seatPriceUnits: 30,
                maximumSeatPriceCents: 4000,
                maximumTripPriceCents: 20000
            })
        ).toBe(false);
    });

    it('does not flag when seat price input is empty', () => {
        expect(
            exceedsMaximumSeatPrice({
                seatPriceUnits: null,
                maximumSeatPriceCents: 4000,
                maximumTripPriceCents: 20000
            })
        ).toBe(false);
    });
});
