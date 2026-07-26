import { describe, expect, it } from 'vitest';
import { hasTooManyForeignTripEndpoints } from './tripForeignEndpointsValidation.js';

const ARG = 'ARG';
const URY = 'URY';

function point(country) {
    return { json: { country } };
}

describe('tripForeignEndpointsValidation', () => {
    describe('hasTooManyForeignTripEndpoints', () => {
        it('returns false when origin is in home country and destination is foreign', () => {
            expect(
                hasTooManyForeignTripEndpoints(
                    [point(ARG), point(ARG), point(URY), point(URY)],
                    ARG
                )
            ).toBe(false);
        });

        it('returns false when both endpoints are in home country with foreign intermediate stops', () => {
            expect(
                hasTooManyForeignTripEndpoints(
                    [point(ARG), point(URY), point(ARG)],
                    ARG
                )
            ).toBe(false);
        });

        it('returns true when both origin and destination are outside home country', () => {
            expect(
                hasTooManyForeignTripEndpoints([point(URY), point(URY)], ARG)
            ).toBe(true);
        });

        it('returns false when both endpoints are in home country', () => {
            expect(
                hasTooManyForeignTripEndpoints([point(ARG), point(ARG)], ARG)
            ).toBe(false);
        });
    });
});
