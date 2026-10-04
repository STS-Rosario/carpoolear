import { describe, expect, it } from 'vitest';
import {
    formatContributionDisplayAmount,
    formatPesoIntegerFromCents
} from './tripContributionDisplay.js';

describe('formatContributionDisplayAmount', () => {
    it('formats cents as comma-decimal pesos string', () => {
        expect(formatContributionDisplayAmount(96000)).toBe('960,00');
        expect(formatContributionDisplayAmount(96050)).toBe('960,50');
        expect(formatContributionDisplayAmount(0)).toBe('0,00');
    });
});

describe('formatPesoIntegerFromCents', () => {
    it('formats whole pesos with thousands separators and no decimals', () => {
        expect(formatPesoIntegerFromCents(160000)).toBe('1.600');
        expect(formatPesoIntegerFromCents(1240000)).toBe('12.400');
        expect(formatPesoIntegerFromCents(960000)).toBe('9.600');
        expect(formatPesoIntegerFromCents(0)).toBe('0');
    });
});
