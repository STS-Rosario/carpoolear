import { maxContributionCapFromSeatPriceCents } from './tripSeatPrice.js';

export function getConversationContributionWarningData({ conversation, user }) {
    const trip = conversation && conversation.trip;
    if (!trip || !trip.user || !user) {
        return null;
    }

    const isDriver = user.id === trip.user.id;
    const maxContributionCents = maxContributionCapFromSeatPriceCents(
        trip.seat_price_cents
    );

    return {
        role: isDriver ? 'driver' : 'passenger',
        maxContributionCents
    };
}
