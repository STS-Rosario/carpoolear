import { describe, it, expect } from 'vitest';
import {
    formatTripDate,
    formatTripTime,
    formatOccupiedSeats,
    formatTripStatus
} from './adminTripTable';

describe('adminTripTable helpers', () => {
    it('formats trip date and time from trip_date', () => {
        expect(formatTripDate('2028-05-15 10:30:00')).toBe('2028-05-15');
        expect(formatTripTime('2028-05-15 10:30:00')).toBe('10:30');
    });

    it('formats occupied seats and status labels', () => {
        const translate = (key) => key;
        expect(formatOccupiedSeats({ passengerAccepted_count: 2 })).toBe(2);
        expect(formatOccupiedSeats({})).toBe('—');
        expect(formatTripStatus({ hidden: true }, translate)).toBe('oculto');
        expect(formatTripStatus({ deleted: true }, translate)).toBe('borrado');
        expect(formatTripStatus({}, translate)).toBe('activo');
    });
});
