import { shareContent as defaultShareContent } from './shareContent.js';
import { buildTripShareMessage } from './tripShareMessage.js';
import { buildWebAppTripDetailUrl } from './supportTicketTripReport.js';

export function buildAbsoluteTripDetailUrl(tripId, env = import.meta.env) {
    return buildWebAppTripDetailUrl(tripId, env);
}

export async function shareTripDetail({
    trip,
    locale,
    translate,
    shareContent = defaultShareContent,
    env = import.meta.env
}) {
    const url = buildAbsoluteTripDetailUrl(trip.id, env);
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
