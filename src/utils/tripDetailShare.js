import { shareContent as defaultShareContent } from './shareContent.js';
import { buildTripShareMessage } from './tripShareMessage.js';

export function buildAbsoluteTripDetailUrl(router, tripId, origin) {
    const route = router.resolve({
        name: 'detail_trip',
        params: { id: tripId }
    });
    return origin + route.href;
}

export async function shareTripDetail({
    trip,
    router,
    origin,
    locale,
    translate,
    shareContent = defaultShareContent
}) {
    const url = buildAbsoluteTripDetailUrl(router, trip.id, origin);
    const text = buildTripShareMessage({
        trip,
        locale,
        translate
    });

    return shareContent({
        title: translate('tripCreationShareTrip'),
        text,
        url
    });
}
