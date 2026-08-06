import { describe, expect, it } from 'vitest';
import { formatContributionDisplayAmount } from './tripContributionDisplay.js';

describe('formatContributionDisplayAmount', () => {
    it('formats cents as comma-decimal pesos string', () => {
        expect(formatContributionDisplayAmount(96000)).toBe('960,00');
        expect(formatContributionDisplayAmount(96050)).toBe('960,50');
        expect(formatContributionDisplayAmount(0)).toBe('0,00');
    });
});
