import { describe, expect, it } from 'vitest';
import {
    isInviteFriendsBlockedByUnpaidSellado,
    isSelladoPending,
    shouldShowSelladoPending
} from './tripSelladoDisplay';

describe('isSelladoPending', () => {
    it('prefers sellado_pending from the API when present', () => {
        expect(
            isSelladoPending({
                needs_sellado: true,
                sellado_pending: false,
                state: 'awaiting_payment'
            })
        ).toBe(false);
    });

    it('derives pending state from needs_sellado when sellado_pending is missing', () => {
        expect(
            isSelladoPending({
                needs_sellado: true,
                state: 'awaiting_payment'
            })
        ).toBe(true);
        expect(
            isSelladoPending({
                needs_sellado: true,
                state: 'ready'
            })
        ).toBe(false);
    });
});

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

describe('isInviteFriendsBlockedByUnpaidSellado', () => {
    it('blocks invite friends while sellado is unpaid', () => {
        expect(
            isInviteFriendsBlockedByUnpaidSellado({
                needs_sellado: true,
                sellado_pending: true,
                state: 'awaiting_payment'
            })
        ).toBe(true);
    });

    it('allows invite friends once sellado is paid', () => {
        expect(
            isInviteFriendsBlockedByUnpaidSellado({
                needs_sellado: true,
                sellado_pending: false,
                state: 'ready'
            })
        ).toBe(false);
    });
});
