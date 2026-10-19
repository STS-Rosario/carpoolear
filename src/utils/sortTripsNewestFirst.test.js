import { describe, expect, it } from 'vitest';
import {
    sortTripsNewestFirst,
    sortTripsOldestFirst
} from './sortTripsNewestFirst.js';

describe('sortTripsNewestFirst', () => {
    it('orders trips by trip_date descending, then id descending', () => {
        const sorted = sortTripsNewestFirst([
            { id: 1, trip_date: '2026-08-12 10:00:00' },
            { id: 3, trip_date: '2026-08-20 08:00:00' },
            { id: 2, trip_date: '2026-08-20 08:00:00' },
            { id: 4, trip_date: '2026-08-15 18:00:00' }
        ]);

        expect(sorted.map((item) => item.id)).toEqual([3, 2, 4, 1]);
    });

    it('uses nested trip.trip_date for seat requests and similar items', () => {
        const sorted = sortTripsNewestFirst([
            { id: 10, trip: { trip_date: '2026-07-01 12:00:00' } },
            { id: 11, trip: { trip_date: '2026-09-01 12:00:00' } },
            { id: 12, trip: { trip_date: '2026-08-01 12:00:00' } }
        ]);

        expect(sorted.map((item) => item.id)).toEqual([11, 12, 10]);
    });

    it('keeps missing dates after dated items and preserves null loading state', () => {
        const input = [
            { id: 1, trip_date: null },
            { id: 2, trip_date: '2026-08-12 10:00:00' }
        ];

        expect(sortTripsNewestFirst(input).map((item) => item.id)).toEqual([
            2, 1
        ]);
        expect(sortTripsNewestFirst(input)).not.toBe(input);
        expect(sortTripsNewestFirst(null)).toBeNull();
        expect(sortTripsNewestFirst(undefined)).toBeUndefined();
    });
});

describe('sortTripsOldestFirst', () => {
    it('orders trips by trip_date ascending, then id ascending', () => {
        const sorted = sortTripsOldestFirst([
            { id: 1, trip_date: '2026-08-12 10:00:00' },
            { id: 3, trip_date: '2026-08-20 08:00:00' },
            { id: 2, trip_date: '2026-08-20 08:00:00' },
            { id: 4, trip_date: '2026-08-15 18:00:00' }
        ]);

        expect(sorted.map((item) => item.id)).toEqual([1, 4, 2, 3]);
    });

    it('keeps missing dates after dated upcoming items', () => {
        const sorted = sortTripsOldestFirst([
            { id: 1, trip_date: null },
            { id: 2, trip_date: '2026-08-20 08:00:00' },
            { id: 3, trip_date: '2026-08-12 10:00:00' }
        ]);

        expect(sorted.map((item) => item.id)).toEqual([3, 2, 1]);
        expect(sortTripsOldestFirst(null)).toBeNull();
    });
});
