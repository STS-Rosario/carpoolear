import { describe, expect, it } from 'vitest';
import { shouldShowSelladoPending } from './tripSelladoDisplay';

describe('shouldShowSelladoPending', () => {
    const owner = { id: 10 };
    const otherUser = { id: 20 };

    it('returns false for paid sellado trips even when needs_sellado is true', () => {
        const trip = {
            needs_sellado: true,
            sellado_pending: false,
            state: 'ready',
            user: { id: owner.id }
        };

        expect(shouldShowSelladoPending(trip, owner)).toBe(false);
        expect(shouldShowSelladoPending(trip, otherUser)).toBe(false);
        expect(shouldShowSelladoPending(trip, null)).toBe(false);
    });

    it('returns true only for the trip owner when sellado is still pending', () => {
        const trip = {
            needs_sellado: true,
            sellado_pending: true,
            state: 'awaiting_payment',
            user: { id: owner.id }
        };

        expect(shouldShowSelladoPending(trip, owner)).toBe(true);
        expect(shouldShowSelladoPending(trip, otherUser)).toBe(false);
        expect(shouldShowSelladoPending(trip, null)).toBe(false);
    });

    it('falls back to needs_sellado and non-ready state when sellado_pending is missing', () => {
        const trip = {
            needs_sellado: true,
            state: 'awaiting_payment',
            user: { id: owner.id }
        };

        expect(shouldShowSelladoPending(trip, owner)).toBe(true);
        expect(shouldShowSelladoPending(trip, otherUser)).toBe(false);
    });

    it('returns false when the ready-state fallback would hide pending styling', () => {
        const trip = {
            needs_sellado: true,
            state: 'ready',
            user: { id: owner.id }
        };

        expect(shouldShowSelladoPending(trip, owner)).toBe(false);
    });
});
