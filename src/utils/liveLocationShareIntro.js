export function isTripDriver(trip, userId) {
    return Boolean(
        trip &&
            trip.user &&
            userId != null &&
            Number(trip.user.id) === Number(userId)
    );
}

export function getLiveLocationShareIntroKey(trip, userId) {
    if (!trip || userId == null) {
        return null;
    }

    return isTripDriver(trip, userId)
        ? 'liveLocationShareIntroDriver'
        : 'liveLocationShareIntroPassenger';
}
