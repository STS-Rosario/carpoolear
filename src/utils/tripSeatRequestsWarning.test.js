import { describe, expect, it } from 'vitest';
import { shouldShowTripSeatRequestsWarning } from './tripSeatRequestsWarning.js';

describe('shouldShowTripSeatRequestsWarning', () => {
    it('returns true when the driver owns the trip and there are pending seat requests', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 1)).toBe(true);
        expect(shouldShowTripSeatRequestsWarning(true, 3)).toBe(true);
    });

    it('returns false when the viewer is not the trip owner', () => {
        expect(shouldShowTripSeatRequestsWarning(false, 2)).toBe(false);
    });

    it('returns false when there are no pending seat requests', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 0)).toBe(false);
        expect(shouldShowTripSeatRequestsWarning(true, undefined)).toBe(false);
        expect(shouldShowTripSeatRequestsWarning(true, null)).toBe(false);
    });
});
