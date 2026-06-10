export function splitFriendTrips(trips) {
    const friendTrips = [];
    const otherTrips = [];

    if (!Array.isArray(trips)) {
        return { friendTrips, otherTrips };
    }

    trips.forEach((trip) => {
        if (trip && trip.driver_is_friend) {
            friendTrips.push(trip);
        } else {
            otherTrips.push(trip);
        }
    });

    return { friendTrips, otherTrips };
}
