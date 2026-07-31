import { describe, expect, it } from 'vitest';
import {
    formatMemberSinceMonthYear,
    getMembershipDuration,
    normalizeTripsCount
} from './profileMemberStats.js';

describe('profileMemberStats', () => {
    it('formats created_at as localized month and year', () => {
        expect(formatMemberSinceMonthYear('2024-03-15 12:34:56')).toBe(
            'marzo 2024'
        );
    });

    it('returns empty string when created_at is missing or invalid', () => {
        expect(formatMemberSinceMonthYear(null)).toBe('');
        expect(formatMemberSinceMonthYear('')).toBe('');
        expect(formatMemberSinceMonthYear('not-a-date')).toBe('');
    });

    it('normalizes trips_count to a non-negative integer', () => {
        expect(normalizeTripsCount(5)).toBe(5);
        expect(normalizeTripsCount('3')).toBe(3);
        expect(normalizeTripsCount(undefined)).toBe(0);
        expect(normalizeTripsCount(-2)).toBe(0);
    });

    it('computes relative membership duration for profile header', () => {
        const now = '2026-07-31';
        expect(getMembershipDuration('2024-07-31', now)).toEqual({
            unit: 'years',
            count: 2
        });
        expect(getMembershipDuration('2026-01-15', now)).toEqual({
            unit: 'months',
            count: 6
        });
        expect(getMembershipDuration('2026-07-20', now)).toEqual({
            unit: 'days',
            count: 11
        });
        expect(getMembershipDuration(null, now)).toBeNull();
        expect(getMembershipDuration('bad', now)).toBeNull();
    });
});
