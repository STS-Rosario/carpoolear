import { describe, expect, it } from 'vitest';
import dayjs from '../dayjs';
import { isUpcomingTrip } from './isUpcomingTrip';

describe('isUpcomingTrip', () => {
    const fixedNow = dayjs('2026-06-09T12:00:00');
    const dateProvider = (value) => (value ? dayjs(value) : fixedNow);

    it('returns false when trip is missing', () => {
        expect(isUpcomingTrip(null, dateProvider)).toBe(false);
    });

    it('returns true for weekly schedule trips regardless of trip_date', () => {
        expect(
            isUpcomingTrip(
                { weekly_schedule: 1, trip_date: '2020-01-01 08:00:00' },
                dateProvider
            )
        ).toBe(true);
    });

    it('returns true when trip_date is in the future', () => {
        expect(
            isUpcomingTrip({ trip_date: '2026-06-10T08:00:00' }, dateProvider)
        ).toBe(true);
    });

    it('returns true when trip_date is now', () => {
        expect(
            isUpcomingTrip({ trip_date: '2026-06-09T12:00:00' }, dateProvider)
        ).toBe(true);
    });

    it('returns false when trip_date is in the past', () => {
        expect(
            isUpcomingTrip({ trip_date: '2026-06-08T08:00:00' }, dateProvider)
        ).toBe(false);
    });
});
