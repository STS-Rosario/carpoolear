import { describe, expect, it } from 'vitest';
import {
    getSeatRequestStatusClass,
    getSeatRequestStatusLabelKey
} from './seatRequestStatus.js';

describe('seatRequestStatus', () => {
    it('maps pending requests to orange styling and pending label', () => {
        expect(getSeatRequestStatusClass(0)).toBe('seat-request-status--pending');
        expect(getSeatRequestStatusLabelKey(0)).toBe('solicitudPendiente');
    });

    it('maps rejected requests to red styling and rejected label', () => {
        expect(getSeatRequestStatusClass(2)).toBe('seat-request-status--rejected');
        expect(getSeatRequestStatusLabelKey(2)).toBe('solicitudRechazada');
    });

    it('maps accepted requests to green styling and accepted label', () => {
        expect(getSeatRequestStatusClass(1)).toBe('seat-request-status--accepted');
        expect(getSeatRequestStatusLabelKey(1)).toBe('solicitudAceptada');
    });

    it('returns null for unsupported request states', () => {
        expect(getSeatRequestStatusClass(3)).toBeNull();
        expect(getSeatRequestStatusLabelKey(4)).toBeNull();
    });
});
