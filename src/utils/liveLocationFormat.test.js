import { describe, expect, it } from 'vitest';
import { formatLiveLocationUpdatedAt } from './liveLocationFormat.js';

describe('liveLocationFormat', () => {
    it('formats ISO recorded_at as date and time', () => {
        expect(formatLiveLocationUpdatedAt('2026-06-08T13:45:00-03:00')).toBe(
            '08/06/2026 13:45'
        );
    });

    it('returns empty string when recorded_at is missing', () => {
        expect(formatLiveLocationUpdatedAt(null)).toBe('');
        expect(formatLiveLocationUpdatedAt(undefined)).toBe('');
    });
});
