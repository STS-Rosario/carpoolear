import { describe, expect, it } from 'vitest';
import {
    shouldShowTripSeatRequestsWarning,
    shouldShowDriverSeatRequestLimitWarning,
    shouldShowPassengerSeatRequestLimitMessage,
} from './tripSeatRequestsWarning.js';

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

    it('returns false when seat request limit is reached even if pending exist', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 3, true)).toBe(false);
    });
});

describe('shouldShowDriverSeatRequestLimitWarning', () => {
    it('returns true for owner when limit reached', () => {
        expect(
            shouldShowDriverSeatRequestLimitWarning(true, {
                seat_request_limit_reached: true,
            })
        ).toBe(true);
    });

    it('returns false for non-owner or when not reached', () => {
        expect(
            shouldShowDriverSeatRequestLimitWarning(false, {
                seat_request_limit_reached: true,
            })
        ).toBe(false);
        expect(
            shouldShowDriverSeatRequestLimitWarning(true, {
                seat_request_limit_reached: false,
            })
        ).toBe(false);
    });
});

describe('shouldShowPassengerSeatRequestLimitMessage', () => {
    it('returns true for non-owner when limit reached', () => {
        expect(
            shouldShowPassengerSeatRequestLimitMessage(false, {
                seat_request_limit_reached: true,
            })
        ).toBe(true);
    });

    it('returns false for owner or when not reached', () => {
        expect(
            shouldShowPassengerSeatRequestLimitMessage(true, {
                seat_request_limit_reached: true,
            })
        ).toBe(false);
        expect(
            shouldShowPassengerSeatRequestLimitMessage(false, {
                seat_request_limit_reached: false,
            })
        ).toBe(false);
    });
});
