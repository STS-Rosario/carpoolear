import { describe, expect, it } from 'vitest';
import {
    getSeatsPillTone,
    getSeatsPillLabel,
    formatTripCardDate,
    formatTripCardTime,
    shouldShowTripCardPointDetail
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

describe('shouldShowTripCardPointDetail', () => {
    it('hides point details when the user is not logged in', () => {
        expect(shouldShowTripCardPointDetail(null, 'Terminal')).toBe(false);
        expect(shouldShowTripCardPointDetail(undefined, 'Terminal')).toBe(false);
    });

    it('shows point details only when logged in and a value is present', () => {
        expect(shouldShowTripCardPointDetail({ id: 1 }, 'Terminal')).toBe(true);
        expect(shouldShowTripCardPointDetail({ id: 1 }, '')).toBe(false);
        expect(shouldShowTripCardPointDetail({ id: 1 }, null)).toBe(false);
    });
});
