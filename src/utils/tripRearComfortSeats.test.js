import { describe, expect, it } from 'vitest';
import {
    MAX_AVAILABLE_SEATS_WITH_REAR_MAX_TWO,
    isRearMaxTwoCompatibleWithSeats,
    rearMaxTwoRequiresThreeOrFewerSeats
} from './tripRearComfortSeats.js';

describe('tripRearComfortSeats', () => {
    it('allows up to 3 available seats when rear max two is enabled', () => {
        expect(MAX_AVAILABLE_SEATS_WITH_REAR_MAX_TWO).toBe(3);
        expect(isRearMaxTwoCompatibleWithSeats(3, true)).toBe(true);
        expect(isRearMaxTwoCompatibleWithSeats(2, 1)).toBe(true);
        expect(isRearMaxTwoCompatibleWithSeats(1, '1')).toBe(true);
    });

    it('rejects 4 available seats when rear max two is enabled', () => {
        expect(isRearMaxTwoCompatibleWithSeats(4, true)).toBe(false);
        expect(isRearMaxTwoCompatibleWithSeats(4, 1)).toBe(false);
    });

    it('ignores seat count when rear max two is disabled', () => {
        expect(isRearMaxTwoCompatibleWithSeats(4, false)).toBe(true);
        expect(isRearMaxTwoCompatibleWithSeats(4, 0)).toBe(true);
        expect(isRearMaxTwoCompatibleWithSeats(4, null)).toBe(true);
    });

    describe('rearMaxTwoRequiresThreeOrFewerSeats', () => {
        it('is true when enabling rear max two with more than 3 seats', () => {
            expect(rearMaxTwoRequiresThreeOrFewerSeats(4, true)).toBe(true);
        });

        it('is true when setting 4 seats while rear max two is enabled', () => {
            expect(rearMaxTwoRequiresThreeOrFewerSeats(4, true)).toBe(true);
        });

        it('is false for compatible combinations', () => {
            expect(rearMaxTwoRequiresThreeOrFewerSeats(3, true)).toBe(false);
            expect(rearMaxTwoRequiresThreeOrFewerSeats(4, false)).toBe(false);
        });
    });
});
