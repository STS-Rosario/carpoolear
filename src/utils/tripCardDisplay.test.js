import { describe, expect, it } from 'vitest';
import {
    getSeatsPillTone,
    getSeatsPillLabel,
    formatTripCardDate,
    formatTripCardTime
} from './tripCardDisplay.js';
import dayjs from '../dayjs';

describe('getSeatsPillTone', () => {
    it('maps seat counts to tones', () => {
        expect(getSeatsPillTone(0)).toBe('full');
        expect(getSeatsPillTone(1)).toBe('low');
        expect(getSeatsPillTone(2)).toBe('medium');
        expect(getSeatsPillTone(3)).toBe('high');
        expect(getSeatsPillTone(4)).toBe('high');
    });
});

describe('getSeatsPillLabel', () => {
    const t = (key) =>
        ({ Carpooleado: 'Carpooleado', Lugar: 'Lugar', Lugares: 'Lugares' })[key];

    it('uses Carpooleado when full', () => {
        expect(getSeatsPillLabel(0, t)).toBe('Carpooleado');
    });

    it('uses singular and plural lugar labels', () => {
        expect(getSeatsPillLabel(1, t)).toBe('1 lugar');
        expect(getSeatsPillLabel(3, t)).toBe('3 lugares');
    });
});

describe('formatTripCardDate / formatTripCardTime', () => {
    it('formats date and time chips', () => {
        const d = '2025-12-14T16:30:00';
        expect(formatTripCardDate(d, dayjs)).toMatch(/14/);
        expect(formatTripCardTime(d, dayjs)).toBe('16:30 hs');
    });

    it('returns empty string for missing dates', () => {
        expect(formatTripCardDate(null, dayjs)).toBe('');
        expect(formatTripCardTime(null, dayjs)).toBe('');
    });
});
