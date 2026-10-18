import { describe, expect, it } from 'vitest';
import {
    isInviteFriendsBlockedByUnpaidSellado,
    isSelladoPending,
    shouldShowSelladoPending,
    shouldShowUnLitroAdminNeedsPaymentCard,
    shouldShowUnLitroOwnerPaymentBanner
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
        expect(
            shouldShowSelladoPending(trip, { id: 99, is_admin: true })
        ).toBe(true);
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

describe('shouldShowUnLitroOwnerPaymentBanner', () => {
    const owner = { id: 10 };
    const admin = { id: 99, is_admin: true };
    const pendingTrip = {
        needs_sellado: true,
        sellado_pending: true,
        state: 'awaiting_payment',
        user: { id: owner.id }
    };

    it('is true only for the trip owner while Un litro is unpaid', () => {
        expect(shouldShowUnLitroOwnerPaymentBanner(pendingTrip, owner)).toBe(
            true
        );
        expect(shouldShowUnLitroOwnerPaymentBanner(pendingTrip, admin)).toBe(
            false
        );
        expect(
            shouldShowUnLitroOwnerPaymentBanner(pendingTrip, { id: 20 })
        ).toBe(false);
    });
});

describe('shouldShowUnLitroAdminNeedsPaymentCard', () => {
    const owner = { id: 10 };
    const admin = { id: 99, is_admin: true };
    const pendingTrip = {
        needs_sellado: true,
        sellado_pending: true,
        state: 'awaiting_payment',
        user: { id: owner.id }
    };

    it('shows an informational card to admins who are not the owner', () => {
        expect(
            shouldShowUnLitroAdminNeedsPaymentCard(pendingTrip, admin)
        ).toBe(true);
        expect(
            shouldShowUnLitroAdminNeedsPaymentCard(pendingTrip, owner)
        ).toBe(false);
        expect(
            shouldShowUnLitroAdminNeedsPaymentCard(pendingTrip, {
                id: 20,
                is_admin: false
            })
        ).toBe(false);
        expect(
            shouldShowUnLitroAdminNeedsPaymentCard(
                { ...pendingTrip, sellado_pending: false, state: 'ready' },
                admin
            )
        ).toBe(false);
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
