import { describe, expect, it } from 'vitest';
import { STEP } from './tripCreationSteps.js';
import {
    buildTripReviewPreferenceTags,
    formatTripReviewPrice,
    getTripReviewEditStep,
    getTripReviewRoutePoints
} from './tripReviewDisplay.js';

describe('tripReviewDisplay', () => {
    it('maps review sections to wizard edit steps', () => {
        expect(getTripReviewEditStep('route')).toBe(STEP.ORIGIN);
        expect(getTripReviewEditStep('vehicle')).toBe(STEP.CAR);
        expect(getTripReviewEditStep('seats')).toBe(STEP.SEATS);
        expect(getTripReviewEditStep('contribution')).toBe(STEP.CONTRIBUTION);
        expect(getTripReviewEditStep('preferences')).toBe(STEP.DESCRIPTION);
    });

    it('returns origin, intermediates, and destination for the route list', () => {
        expect(
            getTripReviewRoutePoints([
                { name: 'Rosario', json: {} },
                { name: 'Venado', json: {} },
                { name: 'CABA', json: {} }
            ])
        ).toEqual([
            { name: 'Rosario', kind: 'origin' },
            { name: 'Venado', kind: 'stop' },
            { name: 'CABA', kind: 'destination' }
        ]);
    });

    it('formats contribution amount for review', () => {
        expect(formatTripReviewPrice(14500)).toBe('14.500');
        expect(formatTripReviewPrice('1200.5')).toBe('1.200,5');
        expect(formatTripReviewPrice('')).toBe('');
    });

    it('builds preference SI/NO tag states', () => {
        expect(
            buildTripReviewPreferenceTags({
                allow_kids: false,
                allow_smoking: false,
                allow_animals: true
            })
        ).toEqual([
            { key: 'kids', allowed: false },
            { key: 'smoking', allowed: false },
            { key: 'pets', allowed: true }
        ]);
    });
});
