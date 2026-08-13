import { describe, expect, it } from 'vitest';
import { buildTripDateForApi } from './tripDateForApi.js';

describe('buildTripDateForApi', () => {
    it('builds trip_date with seconds from date and HH:mm time', () => {
        expect(buildTripDateForApi('2026-08-16', '21:00')).toBe(
            '2026-08-16 21:00:00'
        );
    });

    it('does not add extra seconds when time already includes them', () => {
        expect(buildTripDateForApi('2026-08-16', '21:00:00')).toBe(
            '2026-08-16 21:00:00'
        );
    });
});
