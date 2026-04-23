export function getConversationContributionWarningData({ conversation, user }) {
    if (!conversation || !conversation.trip || !conversation.trip.user || !user) {
        return null;
    }

    const isDriver = user.id === conversation.trip.user.id;

    return {
        role: isDriver ? 'driver' : 'passenger',
        maxContributionCents: conversation.trip.seat_price_cents || 0,
        reportPath: isDriver ? null : `/denunciar?tripId=${conversation.trip.id}`
    };
}
