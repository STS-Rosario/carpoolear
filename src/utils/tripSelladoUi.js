import dayjs from 'dayjs';
import { isSelladoPending } from './tripSelladoDisplay.js';

const MERCADO_PAGO_CHECKOUT_BASE =
    'https://www.mercadopago.com.ar/checkout/v1/redirect';

export function shouldShowUnLitroCard({ selladoEnabled } = {}) {
    return Boolean(selladoEnabled);
}

export function isTripCreationPaymentQrEnabled(config) {
    return Boolean(config && config.module_trip_creation_payment_qr_enabled);
}

export function unLitroCardKindFromTrip(
    trip,
    { selladoEnabled, hasComplimentarySellado } = {}
) {
    if (!selladoEnabled || !trip) {
        return null;
    }
    if (trip.needs_sellado) {
        return 'charged';
    }
    if (trip.sellado_complimentary) {
        return 'complimentary';
    }
    if (
        hasComplimentarySellado &&
        trip.pricing_breakdown &&
        trip.pricing_breakdown.includes_sellado
    ) {
        return 'complimentary';
    }
    return 'bonificado';
}

export function isOverSelladoFreeLimit({
    quotaLoaded,
    remainingFreeTrips,
    userOverFreeLimit
} = {}) {
    if (quotaLoaded) {
        return (Number(remainingFreeTrips) || 0) <= 0;
    }
    return Boolean(userOverFreeLimit);
}

export function shouldShowSelladoBonificadoCard({
    selladoEnabled,
    routeNeedsPayment
} = {}) {
    return Boolean(selladoEnabled && !routeNeedsPayment);
}

function wouldOtherwiseChargeSellado({
    selladoEnabled,
    routeNeedsPayment,
    userOverFreeLimit
} = {}) {
    return Boolean(selladoEnabled && routeNeedsPayment && userOverFreeLimit);
}

export function shouldChargeSellado({
    selladoEnabled,
    routeNeedsPayment,
    userOverFreeLimit,
    hasComplimentarySellado
} = {}) {
    return (
        wouldOtherwiseChargeSellado({
            selladoEnabled,
            routeNeedsPayment,
            userOverFreeLimit
        }) && !hasComplimentarySellado
    );
}

export function shouldShowSelladoComplimentaryCard({
    selladoEnabled,
    routeNeedsPayment,
    userOverFreeLimit,
    hasComplimentarySellado
} = {}) {
    return (
        wouldOtherwiseChargeSellado({
            selladoEnabled,
            routeNeedsPayment,
            userOverFreeLimit
        }) && Boolean(hasComplimentarySellado)
    );
}

export function shouldShowSelladoEmptyTripCreditCard(
    trip,
    { isOwner } = {}
) {
    if (!isOwner || !trip) {
        return false;
    }
    if (!trip.needs_sellado || isSelladoPending(trip)) {
        return false;
    }
    if (trip.sellado_empty_trip_credit_redeemed) {
        return false;
    }
    if (trip.state === 'canceled') {
        return false;
    }
    if (!trip.trip_date) {
        return false;
    }
    if (!dayjs(trip.trip_date).isBefore(dayjs())) {
        return false;
    }
    return (Number(trip.passenger_count) || 0) === 0;
}

export function remainingSelladoFreeTrips(freeTripsAmount, tripsCreatedByUser) {
    const remaining =
        (Number(freeTripsAmount) || 0) - (Number(tripsCreatedByUser) || 0);
    return remaining > 0 ? remaining : 0;
}

export function applySelladoChargeToBreakdown(breakdown, charged) {
    if (!breakdown) {
        return null;
    }

    if (charged || !breakdown.includes_sellado) {
        return breakdown;
    }

    const selladoCents = Number(breakdown.sellado_cents) || 0;
    const totalCents = (Number(breakdown.total_cents) || 0) - selladoCents;
    const next = {
        ...breakdown,
        sellado_cents: 0,
        total_cents: totalCents
    };

    if (next.occupants) {
        next.per_person_cents = Math.round(totalCents / next.occupants);
    }

    return next;
}

export function selladoCheckoutUrl(trip) {
    if (!trip) {
        return null;
    }
    if (trip.payment_url) {
        return trip.payment_url;
    }
    if (!trip.payment_id) {
        return null;
    }
    return `${MERCADO_PAGO_CHECKOUT_BASE}?pref_id=${encodeURIComponent(
        trip.payment_id
    )}`;
}

export function selladoDetailBannerKind(trip) {
    if (!trip) {
        return null;
    }
    if (trip.state === 'payment_failed') {
        return 'failed';
    }
    if (trip.state === 'pending_payment') {
        return 'rapipago';
    }
    if (trip.state === 'awaiting_payment') {
        return 'pending';
    }
    return null;
}

export function withSelladoPaidQuery(route = {}) {
    return {
        name: route.name,
        params: { ...(route.params || {}) },
        query: { ...(route.query || {}), sellado_paid: '1' }
    };
}

export function selladoPaidQueryRoute(route = {}) {
    if (route.name !== 'detail_trip') {
        return null;
    }
    return withSelladoPaidQuery(route);
}

export function isSelladoPaymentReturnQuery(query = {}) {
    if (query.sellado_paid === '1' || query.sellado_paid === true) {
        return true;
    }
    const status = String(
        query.collection_status || query.status || query.payment_result || ''
    ).toLowerCase();
    return status === 'approved' || status === 'success';
}

export function shouldShowSelladoPublishedBanner(trip, query = {}) {
    if (!trip || !trip.needs_sellado || isSelladoPending(trip)) {
        return false;
    }
    return isSelladoPaymentReturnQuery(query);
}

export function shouldShowSelladoProcessingBanner(trip, query = {}) {
    return isSelladoPending(trip) && isSelladoPaymentReturnQuery(query);
}
