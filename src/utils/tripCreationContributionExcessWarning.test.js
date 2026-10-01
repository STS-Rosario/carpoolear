import { describe, expect, it } from 'vitest';
import { STEP } from './tripCreationSteps.js';
import { shouldShowContributionExcessWarning } from './tripCreationContributionExcessWarning.js';

// Maximum allowed contribution as computed by trip-info: $100000 per trip,
// $20000 per seat. The driver chose a lower contribution ($15000).
const excessive = {
    step: STEP.DESCRIPTION,
    description: 'La contribución es de $24000 por persona',
    price: '15000',
    maxPriceEnabled: true,
    maximumSeatPriceCents: 2000000,
    maximumTripPriceCents: 10000000,
    alreadyShown: false,
    isEdit: false
};

describe('shouldShowContributionExcessWarning', () => {
    it('warns when the description asks more than the maximum allowed contribution', () => {
        expect(shouldShowContributionExcessWarning(excessive)).toBe(true);
    });

    it('warns when leaving the contribution step with a description already filled', () => {
        expect(
            shouldShowContributionExcessWarning({ ...excessive, step: STEP.CONTRIBUTION })
        ).toBe(true);
    });

    it('accepts numeric price input', () => {
        expect(shouldShowContributionExcessWarning({ ...excessive, price: 15000 })).toBe(true);
    });

    it('does not warn when the description asks more than the chosen price but within the maximum', () => {
        expect(
            shouldShowContributionExcessWarning({ ...excessive, description: 'Contribución $18000' })
        ).toBe(false);
    });

    it('does not warn when the description amount equals the maximum', () => {
        expect(
            shouldShowContributionExcessWarning({ ...excessive, description: 'Contribución $20000' })
        ).toBe(false);
    });

    it('does not warn when the max price module is disabled (no maximum)', () => {
        expect(
            shouldShowContributionExcessWarning({ ...excessive, maxPriceEnabled: false })
        ).toBe(false);
    });

    it('does not warn when the maximum has not been computed yet', () => {
        expect(
            shouldShowContributionExcessWarning({
                ...excessive,
                maximumSeatPriceCents: 0,
                maximumTripPriceCents: 0
            })
        ).toBe(false);
        expect(
            shouldShowContributionExcessWarning({
                ...excessive,
                maximumSeatPriceCents: undefined,
                maximumTripPriceCents: undefined
            })
        ).toBe(false);
    });

    it('does not warn twice in the same trip creation', () => {
        expect(shouldShowContributionExcessWarning({ ...excessive, alreadyShown: true })).toBe(
            false
        );
    });

    it('does not warn when editing an existing trip', () => {
        expect(shouldShowContributionExcessWarning({ ...excessive, isEdit: true })).toBe(false);
    });

    it('does not warn on steps other than contribution or description', () => {
        expect(shouldShowContributionExcessWarning({ ...excessive, step: STEP.SEATS })).toBe(false);
        expect(
            shouldShowContributionExcessWarning({ ...excessive, step: STEP.LAST_DETAILS })
        ).toBe(false);
    });

    it('does not warn for voluntary, empty or invalid contributions (no maximum applies)', () => {
        expect(shouldShowContributionExcessWarning({ ...excessive, price: '0' })).toBe(false);
        expect(shouldShowContributionExcessWarning({ ...excessive, price: '' })).toBe(false);
        expect(shouldShowContributionExcessWarning({ ...excessive, price: '-5' })).toBe(false);
        expect(shouldShowContributionExcessWarning({ ...excessive, price: null })).toBe(false);
    });
});
