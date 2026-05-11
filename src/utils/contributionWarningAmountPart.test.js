import { describe, expect, it, vi } from 'vitest';
import { getContributionWarningAmountPart } from './contributionWarningAmountPart.js';

describe('getContributionWarningAmountPart', () => {
    it('returns empty string when cents is zero so UI omits (CURRENCY 0)', () => {
        const n = vi.fn();
        expect(getContributionWarningAmountPart(n, 0)).toBe('');
        expect(n).not.toHaveBeenCalled();
    });

    it('returns empty string for non-positive sentinel amounts', () => {
        const n = vi.fn();
        expect(getContributionWarningAmountPart(n, -1)).toBe('');
        expect(getContributionWarningAmountPart(n, null)).toBe('');
        expect(n).not.toHaveBeenCalled();
    });

    it('returns leading space and parenthesized formatted currency when cents is positive', () => {
        const n = vi.fn().mockReturnValue('ARS 50');
        expect(getContributionWarningAmountPart(n, 5000)).toBe(' (ARS 50)');
        expect(n).toHaveBeenCalledWith(50, 'currency');
    });
});
