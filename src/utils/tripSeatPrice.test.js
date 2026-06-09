import { describe, expect, it } from 'vitest';
import {
    VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS,
    isNegativeSeatPriceInput,
    isVoluntaryContributionSeatPrice,
    maxContributionCapFromSeatPriceCents,
    parseSeatPriceInput,
    priceInputNumberFromStoredSeatPriceCents,
    seatPriceCentsForApi,
    shouldShowTripSeatPriceSection
} from './tripSeatPrice.js';

describe('tripSeatPrice', () => {
    describe('VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS', () => {
        it('is -1 cents sentinel for “lo que se pueda aportar”', () => {
            expect(VOLUNTARY_CONTRIBUTION_SEAT_PRICE_CENTS).toBe(-1);
        });
    });

    describe('parseSeatPriceInput', () => {
        it('returns null for empty / unset', () => {
            expect(parseSeatPriceInput('')).toBeNull();
            expect(parseSeatPriceInput('   ')).toBeNull();
            expect(parseSeatPriceInput(null)).toBeNull();
            expect(parseSeatPriceInput(undefined)).toBeNull();
        });

        it('parses finite numbers including zero', () => {
            expect(parseSeatPriceInput(0)).toBe(0);
            expect(parseSeatPriceInput('0')).toBe(0);
            expect(parseSeatPriceInput('12.5')).toBe(12.5);
        });
    });

    describe('isNegativeSeatPriceInput', () => {
        it('is true for negative form values', () => {
            expect(isNegativeSeatPriceInput(-1)).toBe(true);
            expect(isNegativeSeatPriceInput('-5')).toBe(true);
        });

        it('is false for zero, positive, and empty values', () => {
            expect(isNegativeSeatPriceInput(0)).toBe(false);
            expect(isNegativeSeatPriceInput('0')).toBe(false);
            expect(isNegativeSeatPriceInput(10)).toBe(false);
            expect(isNegativeSeatPriceInput('')).toBe(false);
            expect(isNegativeSeatPriceInput(null)).toBe(false);
        });
    });

    describe('seatPriceCentsForApi', () => {
        it('maps explicit zero to voluntary sentinel -1', () => {
            expect(seatPriceCentsForApi(0)).toBe(-1);
            expect(seatPriceCentsForApi('0')).toBe(-1);
        });

        it('maps positive amounts to cents', () => {
            expect(seatPriceCentsForApi(10)).toBe(1000);
            expect(seatPriceCentsForApi(12.345)).toBe(1235);
        });

        it('returns null when unset (empty input)', () => {
            expect(seatPriceCentsForApi('')).toBeNull();
            expect(seatPriceCentsForApi(null)).toBeNull();
        });

        it('returns null for negative form values', () => {
            expect(seatPriceCentsForApi(-5)).toBeNull();
            expect(seatPriceCentsForApi('-1')).toBeNull();
        });
    });

    describe('priceInputNumberFromStoredSeatPriceCents', () => {
        it('maps voluntary sentinel to 0 for the form field', () => {
            expect(priceInputNumberFromStoredSeatPriceCents(-1)).toBe(0);
        });

        it('maps stored cents to currency units for the form field', () => {
            expect(priceInputNumberFromStoredSeatPriceCents(1500)).toBe(15);
        });

        it('returns null when no stored price', () => {
            expect(priceInputNumberFromStoredSeatPriceCents(null)).toBeNull();
            expect(priceInputNumberFromStoredSeatPriceCents(undefined)).toBeNull();
        });
    });

    describe('shouldShowTripSeatPriceSection', () => {
        it('is false when price is unset or legacy default zero', () => {
            expect(shouldShowTripSeatPriceSection(null)).toBe(false);
            expect(shouldShowTripSeatPriceSection(undefined)).toBe(false);
            expect(shouldShowTripSeatPriceSection(0)).toBe(false);
        });

        it('is true for voluntary sentinel -1 or positive cents', () => {
            expect(shouldShowTripSeatPriceSection(-1)).toBe(true);
            expect(shouldShowTripSeatPriceSection(500)).toBe(true);
        });
    });

    describe('isVoluntaryContributionSeatPrice', () => {
        it('is true only for voluntary sentinel', () => {
            expect(isVoluntaryContributionSeatPrice(-1)).toBe(true);
            expect(isVoluntaryContributionSeatPrice(0)).toBe(false);
            expect(isVoluntaryContributionSeatPrice(null)).toBe(false);
            expect(isVoluntaryContributionSeatPrice(100)).toBe(false);
        });
    });

    describe('maxContributionCapFromSeatPriceCents', () => {
        it('returns positive cents only', () => {
            expect(maxContributionCapFromSeatPriceCents(500)).toBe(500);
            expect(maxContributionCapFromSeatPriceCents(-1)).toBe(0);
            expect(maxContributionCapFromSeatPriceCents(0)).toBe(0);
            expect(maxContributionCapFromSeatPriceCents(null)).toBe(0);
        });
    });
});
