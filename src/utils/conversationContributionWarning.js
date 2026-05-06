export function getConversationContributionWarningData({ conversation, user }) {
    const trip = conversation && conversation.trip;
    if (!trip || !trip.user || !user) {
        return null;
    }

    const isDriver = user.id === trip.user.id;
    const cents = trip.seat_price_cents;
    const maxContributionCents =
        typeof cents === 'number' && cents > 0 ? cents : 0;

    return {
        role: isDriver ? 'driver' : 'passenger',
        maxContributionCents
    };
}
