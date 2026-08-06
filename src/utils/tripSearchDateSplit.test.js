import { describe, expect, it } from 'vitest';
import { splitTripsBySearchDate } from './tripSearchDateSplit.js';

describe('splitTripsBySearchDate', () => {
    const trips = [
        { id: 1, trip_date: '2026-06-02 10:00:00' },
        { id: 2, trip_date: '2026-06-01 10:00:00' },
        { id: 3, trip_date: '2026-06-02 18:00:00' },
        { id: 4, trip_date: '2026-06-05 10:00:00' }
    ];

    it('keeps all trips as exact when there is no search date', () => {
        expect(splitTripsBySearchDate(trips, null)).toEqual({
            exactTrips: trips,
            nearbyTrips: []
        });
    });

    it('splits exact calendar day from complementary nearby days', () => {
        expect(splitTripsBySearchDate(trips, '2026-06-02')).toEqual({
            exactTrips: [trips[0], trips[2]],
            nearbyTrips: [trips[1], trips[3]]
        });
    });
});
