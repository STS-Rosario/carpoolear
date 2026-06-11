export function shouldInviteFriendsAfterCreate(trip) {
    return !trip?.existing;
}

export function tripDetailRouteAfterCreate(trip) {
    return {
        name: 'detail_trip',
        params: { id: trip.id },
        query: shouldInviteFriendsAfterCreate(trip)
            ? { inviteFriends: '1' }
            : {}
    };
}
