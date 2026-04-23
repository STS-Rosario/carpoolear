import { describe, expect, it, vi } from 'vitest';
import { getMaxContributionExceededMessage } from './maxContributionExceededMessage.js';

describe('getMaxContributionExceededMessage', () => {
    it('builds max contribution exceeded message using i18n interpolation', () => {
        const t = vi.fn().mockReturnValue('message');
        const n = vi.fn().mockReturnValue('$ 1500');

        const message = getMaxContributionExceededMessage({
            t,
            n,
            maxContributionCents: 150000
        });

        expect(n).toHaveBeenCalledWith(1500, 'currency');
        expect(t).toHaveBeenCalledWith('precioMaximoExcedido', {
            maxContribution: '$ 1500'
        });
        expect(message).toBe('message');
    });
});
