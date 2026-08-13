import { describe, expect, it } from 'vitest';
import { formatTripContributionPesosLabel } from './adminTripExcessContributionList.js';

describe('adminTripExcessContributionList', () => {
    describe('formatTripContributionPesosLabel', () => {
        it('formats positive seat price cents as peso label', () => {
            expect(formatTripContributionPesosLabel(1500000)).toBe('$15000');
            expect(formatTripContributionPesosLabel(2400000)).toBe('$24000');
        });

        it('returns dash for missing or non-positive values', () => {
            expect(formatTripContributionPesosLabel(null)).toBe('-');
            expect(formatTripContributionPesosLabel(0)).toBe('-');
            expect(formatTripContributionPesosLabel(-1)).toBe('-');
        });
    });
});
