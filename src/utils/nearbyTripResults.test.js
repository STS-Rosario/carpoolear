import { describe, expect, it } from 'vitest';
import { shouldShowNearbyResultsHeader } from './nearbyTripResults.js';

describe('shouldShowNearbyResultsHeader', () => {
    const searchDate = '2026-08-01';

    it('returns false when there is no search date', () => {
        expect(
            shouldShowNearbyResultsHeader(
                { trip_date: '2026-08-02 12:00:00' },
                null,
                []
            )
        ).toBe(false);
    });

    it('returns false for a trip on the searched calendar day', () => {
        expect(
            shouldShowNearbyResultsHeader(
                { trip_date: '2026-08-01 09:30:00' },
                searchDate,
                []
            )
        ).toBe(false);
    });

    it('returns true for the first nearby trip in the section', () => {
        expect(
            shouldShowNearbyResultsHeader(
                { trip_date: '2026-07-30 09:30:00' },
                searchDate,
                [{ trip_date: '2026-08-01 08:00:00' }]
            )
        ).toBe(true);
    });

    it('returns false for later nearby trips so only one header is shown', () => {
        expect(
            shouldShowNearbyResultsHeader(
                { trip_date: '2026-08-02 10:00:00' },
                searchDate,
                [
                    { trip_date: '2026-08-01 08:00:00' },
                    { trip_date: '2026-07-30 09:30:00' }
                ]
            )
        ).toBe(false);
    });
});
