export function getConversationContributionWarningData({ conversation, user }) {
    const trip = conversation && conversation.trip;
    if (!trip || !trip.user || !user) {
        return null;
    }

    const isDriver = user.id === trip.user.id;
    const tripId = trip.id;
    const maxContributionCents = trip.seat_price_cents || 0;

    return {
        role: isDriver ? 'driver' : 'passenger',
        maxContributionCents,
        reportPath: isDriver ? null : `/denunciar?tripId=${tripId}`
    };
}
