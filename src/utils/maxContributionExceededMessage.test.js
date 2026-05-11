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
            maxContributionPart: ' ($ 1500)'
        });
        expect(message).toBe('message');
    });

    it('omits formatted currency when max contribution is zero', () => {
        const t = vi.fn().mockReturnValue('message');
        const n = vi.fn();

        const message = getMaxContributionExceededMessage({
            t,
            n,
            maxContributionCents: 0
        });

        expect(n).not.toHaveBeenCalled();
        expect(t).toHaveBeenCalledWith('precioMaximoExcedido', {
            maxContributionPart: ''
        });
        expect(message).toBe('message');
    });

    it('omits formatted currency for non-positive cap amounts', () => {
        const t = vi.fn().mockReturnValue('message');
        const n = vi.fn();

        getMaxContributionExceededMessage({
            t,
            n,
            maxContributionCents: -1
        });

        expect(n).not.toHaveBeenCalled();
        expect(t).toHaveBeenCalledWith('precioMaximoExcedido', {
            maxContributionPart: ''
        });
    });
});
