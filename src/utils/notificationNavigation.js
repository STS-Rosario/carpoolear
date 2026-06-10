export const TRIP_DETAIL_NOTIFICATION_TYPES = [
    'trip',
    'friend_trip',
    'friend_trip_invite'
];

export function resolveTripDetailRoute(notification) {
    const extras = notification?.extras;
    if (!extras || !TRIP_DETAIL_NOTIFICATION_TYPES.includes(extras.type)) {
        return null;
    }
    if (extras.trip_id == null) {
        return null;
    }

    return {
        name: 'detail_trip',
        params: { id: extras.trip_id }
    };
}
