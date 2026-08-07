import { describe, expect, it } from 'vitest';
import {
    SEAT_LAYOUT_FOUR,
    SEAT_LAYOUT_FIVE,
    maxOfferedSeatsForLayout,
    rearMaxTwoFromLayout,
    createPassengerSeatAvailability,
    countAvailableSeats,
    togglePassengerSeat,
    seatLabelsForLayout
} from './tripSeatLayout.js';

describe('tripSeatLayout', () => {
    it('maps 4/5 layouts to offered capacity and rear_max_two', () => {
        expect(maxOfferedSeatsForLayout(SEAT_LAYOUT_FOUR)).toBe(3);
        expect(maxOfferedSeatsForLayout(SEAT_LAYOUT_FIVE)).toBe(4);
        expect(rearMaxTwoFromLayout(SEAT_LAYOUT_FOUR)).toBe(true);
        expect(rearMaxTwoFromLayout(SEAT_LAYOUT_FIVE)).toBe(false);
    });

    it('creates all-on passenger seat availability for a layout', () => {
        expect(createPassengerSeatAvailability(SEAT_LAYOUT_FOUR)).toEqual([
            true,
            true,
            true
        ]);
        expect(createPassengerSeatAvailability(SEAT_LAYOUT_FIVE)).toEqual([
            true,
            true,
            true,
            true
        ]);
    });

    it('counts and toggles available passenger seats', () => {
        const seats = [true, true, true];
        expect(countAvailableSeats(seats)).toBe(3);
        expect(togglePassengerSeat(seats, 0)).toEqual([false, true, true]);
        expect(countAvailableSeats(togglePassengerSeat(seats, 0))).toBe(2);
    });

    it('exposes front + rear seat label keys for a layout', () => {
        expect(seatLabelsForLayout(SEAT_LAYOUT_FOUR)).toEqual([
            'tripSeatMapFront',
            'tripSeatMapRear1',
            'tripSeatMapRear2'
        ]);
        expect(seatLabelsForLayout(SEAT_LAYOUT_FIVE)).toEqual([
            'tripSeatMapFront',
            'tripSeatMapRear1',
            'tripSeatMapRear2',
            'tripSeatMapRear3'
        ]);
    });
});
