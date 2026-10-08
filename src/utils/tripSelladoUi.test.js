import { describe, expect, it } from 'vitest';
import {
    applySelladoChargeToBreakdown,
    remainingSelladoFreeTrips,
    selladoCheckoutUrl,
    selladoDetailBannerKind,
    shouldChargeSellado,
    shouldShowSelladoComplimentaryCard,
    shouldShowSelladoEmptyTripCreditCard,
    shouldShowSelladoPublishedBanner,
    shouldShowUnLitroCard
} from './tripSelladoUi.js';

describe('shouldShowUnLitroCard', () => {
    it('is true only when sellado is enabled', () => {
        expect(shouldShowUnLitroCard({ selladoEnabled: true })).toBe(true);
        expect(shouldShowUnLitroCard({ selladoEnabled: false })).toBe(false);
        expect(shouldShowUnLitroCard({})).toBe(false);
    });
});

describe('shouldChargeSellado', () => {
    it('charges only when enabled, the route needs payment, and the user is over the free limit', () => {
        expect(
            shouldChargeSellado({
                selladoEnabled: true,
                routeNeedsPayment: true,
                userOverFreeLimit: true
            })
        ).toBe(true);
    });

    it('does not charge when the origin/destination pair does not pay', () => {
        expect(
            shouldChargeSellado({
                selladoEnabled: true,
                routeNeedsPayment: false,
                userOverFreeLimit: true
            })
        ).toBe(false);
    });

    it('does not charge while the user still has bonified trips', () => {
        expect(
            shouldChargeSellado({
                selladoEnabled: true,
                routeNeedsPayment: true,
                userOverFreeLimit: false
            })
        ).toBe(false);
    });

    it('does not charge when the user has complimentary empty-trip credit', () => {
        expect(
            shouldChargeSellado({
                selladoEnabled: true,
                routeNeedsPayment: true,
                userOverFreeLimit: true,
                hasComplimentarySellado: true
            })
        ).toBe(false);
    });
});

describe('shouldShowSelladoComplimentaryCard', () => {
    it('is true when this trip would be charged but empty-trip credit waives it', () => {
        expect(
            shouldShowSelladoComplimentaryCard({
                selladoEnabled: true,
                routeNeedsPayment: true,
                userOverFreeLimit: true,
                hasComplimentarySellado: true
            })
        ).toBe(true);
    });

    it('is false when the route does not require sellado', () => {
        expect(
            shouldShowSelladoComplimentaryCard({
                selladoEnabled: true,
                routeNeedsPayment: false,
                userOverFreeLimit: true,
                hasComplimentarySellado: true
            })
        ).toBe(false);
    });

    it('is false while the user still has free trips', () => {
        expect(
            shouldShowSelladoComplimentaryCard({
                selladoEnabled: true,
                routeNeedsPayment: true,
                userOverFreeLimit: false,
                hasComplimentarySellado: true
            })
        ).toBe(false);
    });
});

describe('shouldShowSelladoEmptyTripCreditCard', () => {
    const finishedPaidEmptyTrip = {
        needs_sellado: true,
        sellado_pending: false,
        state: 'ready',
        trip_date: '2020-01-01 12:00:00',
        passenger_count: 0
    };

    it('shows the next-trip credit card to the driver of a finished paid empty trip', () => {
        expect(
            shouldShowSelladoEmptyTripCreditCard(finishedPaidEmptyTrip, {
                isOwner: true
            })
        ).toBe(true);
    });

    it('hides the card from passengers', () => {
        expect(
            shouldShowSelladoEmptyTripCreditCard(finishedPaidEmptyTrip, {
                isOwner: false
            })
        ).toBe(false);
    });

    it('hides the card when the trip still has passengers', () => {
        expect(
            shouldShowSelladoEmptyTripCreditCard(
                { ...finishedPaidEmptyTrip, passenger_count: 1 },
                { isOwner: true }
            )
        ).toBe(false);
    });

    it('hides the card when the trip has not finished yet', () => {
        expect(
            shouldShowSelladoEmptyTripCreditCard(
                { ...finishedPaidEmptyTrip, trip_date: '2099-01-01 12:00:00' },
                { isOwner: true }
            )
        ).toBe(false);
    });

    it('hides the card when sellado was never paid', () => {
        expect(
            shouldShowSelladoEmptyTripCreditCard(
                {
                    ...finishedPaidEmptyTrip,
                    sellado_pending: true,
                    state: 'awaiting_payment'
                },
                { isOwner: true }
            )
        ).toBe(false);
    });
});

describe('remainingSelladoFreeTrips', () => {
    it('returns remaining bonified trips without going below zero', () => {
        expect(remainingSelladoFreeTrips(2, 0)).toBe(2);
        expect(remainingSelladoFreeTrips(2, 1)).toBe(1);
        expect(remainingSelladoFreeTrips(2, 5)).toBe(0);
    });
});

describe('applySelladoChargeToBreakdown', () => {
    const breakdown = {
        includes_sellado: true,
        sellado_cents: 160000,
        total_cents: 4960000,
        occupants: 4,
        per_person_cents: 1240000
    };

    it('keeps the Un litro amount when the trip is charged', () => {
        expect(applySelladoChargeToBreakdown(breakdown, true)).toEqual(breakdown);
    });

    it('zeros Un litro and total when the trip is bonified', () => {
        expect(applySelladoChargeToBreakdown(breakdown, false)).toEqual({
            includes_sellado: true,
            sellado_cents: 0,
            total_cents: 4800000,
            occupants: 4,
            per_person_cents: 1200000
        });
    });

    it('leaves breakdowns without sellado unchanged', () => {
        const withoutSellado = {
            includes_sellado: false,
            sellado_cents: 0,
            total_cents: 4800000
        };
        expect(applySelladoChargeToBreakdown(withoutSellado, false)).toEqual(
            withoutSellado
        );
    });
});

describe('selladoCheckoutUrl', () => {
    it('prefers payment_url and falls back to a Mercado Pago preference redirect', () => {
        expect(
            selladoCheckoutUrl({
                payment_url: 'https://pay.test/pref',
                payment_id: 'pref-1'
            })
        ).toBe('https://pay.test/pref');
        expect(selladoCheckoutUrl({ payment_id: 'pref-1' })).toBe(
            'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref-1'
        );
        expect(selladoCheckoutUrl({})).toBeNull();
    });
});

describe('selladoDetailBannerKind', () => {
    it('maps trip payment state to the matching banner', () => {
        expect(selladoDetailBannerKind({ state: 'awaiting_payment' })).toBe(
            'pending'
        );
        expect(selladoDetailBannerKind({ state: 'pending_payment' })).toBe(
            'rapipago'
        );
        expect(selladoDetailBannerKind({ state: 'payment_failed' })).toBe(
            'failed'
        );
        expect(selladoDetailBannerKind({ state: 'ready' })).toBeNull();
    });
});

describe('shouldShowSelladoPublishedBanner', () => {
    it('shows the published banner after a successful return from payment', () => {
        const trip = {
            needs_sellado: true,
            sellado_pending: false,
            state: 'ready'
        };
        expect(
            shouldShowSelladoPublishedBanner(trip, { collection_status: 'approved' })
        ).toBe(true);
        expect(shouldShowSelladoPublishedBanner(trip, {})).toBe(false);
        expect(
            shouldShowSelladoPublishedBanner(
                { ...trip, sellado_pending: true, state: 'awaiting_payment' },
                { collection_status: 'approved' }
            )
        ).toBe(false);
    });
});
