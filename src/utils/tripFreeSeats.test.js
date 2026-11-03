import { describe, expect, it } from 'vitest';
import { canDecreaseFreeSeats } from './tripFreeSeats.js';

describe('canDecreaseFreeSeats', () => {
    it('allows decreasing when one free seat remains so drivers can set zero', () => {
        expect(canDecreaseFreeSeats(1)).toBe(true);
        expect(canDecreaseFreeSeats('1')).toBe(true);
    });

    it('blocks decreasing only when there are already zero free seats', () => {
        expect(canDecreaseFreeSeats(0)).toBe(false);
        expect(canDecreaseFreeSeats('0')).toBe(false);
    });

    it('allows decreasing when several free seats remain', () => {
        expect(canDecreaseFreeSeats(2)).toBe(true);
        expect(canDecreaseFreeSeats(4)).toBe(true);
    });
});
