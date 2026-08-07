export const TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR = {
    EMIT: 'emit',
    TRIP_DETAIL: 'trip-detail'
};

export function resolveTripInviteFriendsClose({
    closeBehavior,
    tripId,
    router,
    emit
}) {
    if (
        closeBehavior === TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR.TRIP_DETAIL &&
        tripId != null &&
        router
    ) {
        router.push({
            name: 'detail_trip',
            params: { id: tripId }
        });
        return { navigated: true, emitted: false };
    }

    emit('close');
    return { navigated: false, emitted: true };
}
