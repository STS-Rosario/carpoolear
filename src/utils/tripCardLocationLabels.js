import { getTripLocationLabels } from './ongoingTrip.js';
import { shouldShowTripCardPointDetail } from './tripCardDisplay.js';

export function getTripCardLocationLabels(trip, viewerUser) {
    const labels = getTripLocationLabels(trip);

    return {
        ...labels,
        fromPoint: shouldShowTripCardPointDetail(viewerUser, labels.fromPoint)
            ? labels.fromPoint
            : '',
        toPoint: shouldShowTripCardPointDetail(viewerUser, labels.toPoint)
            ? labels.toPoint
            : ''
    };
}
