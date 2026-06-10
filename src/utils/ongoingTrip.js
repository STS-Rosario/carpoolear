import dayjs from '../dayjs';

export const ONGOING_TRIP_LEAD_MINUTES = 60;
export const ONGOING_TRIP_GRACE_MINUTES = 30;
export const RATING_AVAILABLE_DURATION_FACTOR = 0.8;

export function estimatedTimeToMinutes(estimatedTime) {
    if (estimatedTime == null || estimatedTime === '') {
        return 0;
    }
    const parts = String(estimatedTime).split(':');
    const hours = Number.parseInt(parts[0], 10) || 0;
    const minutes = Number.parseInt(parts[1], 10) || 0;
    return hours * 60 + minutes;
}

export function getRatingAvailableAt(tripStart, estimatedTime) {
    const durationMinutes = estimatedTimeToMinutes(estimatedTime);
    const availableAfterMinutes = Math.round(durationMinutes * RATING_AVAILABLE_DURATION_FACTOR);

    return tripStart.add(availableAfterMinutes, 'minute');
}

export function isRatingAvailable(now, tripStart, estimatedTime) {
    return !now.isBefore(getRatingAvailableAt(tripStart, estimatedTime));
}

export function isWithinOngoingTripWindow(now, tripStart, estimatedTime) {
    const durationMinutes = estimatedTimeToMinutes(estimatedTime);
    const windowStart = tripStart.subtract(ONGOING_TRIP_LEAD_MINUTES, 'minute');
    const windowEnd = tripStart
        .add(durationMinutes, 'minute')
        .add(ONGOING_TRIP_GRACE_MINUTES, 'minute');

    return (
        !now.isBefore(windowStart) &&
        !now.isAfter(windowEnd)
    );
}

export function getSharingWindowEnd(tripStart, estimatedTime) {
    const durationMinutes = estimatedTimeToMinutes(estimatedTime);
    return tripStart.add(durationMinutes * 2, 'minute');
}

export function canStartSharing(now, tripStart, estimatedTime) {
    const windowStart = tripStart.subtract(ONGOING_TRIP_LEAD_MINUTES, 'minute');
    const windowEnd = getSharingWindowEnd(tripStart, estimatedTime);

    return !now.isBefore(windowStart) && !now.isAfter(windowEnd);
}

export function isLiveLocationParticipant(trip, userId) {
    if (!trip || userId == null) {
        return false;
    }
    const uid = Number(userId);
    if (trip.user && Number(trip.user.id) === uid) {
        return true;
    }
    if (Array.isArray(trip.passenger)) {
        return trip.passenger.some((passenger) => Number(passenger.id) === uid);
    }
    if (Array.isArray(trip.allPassengerRequest)) {
        return trip.allPassengerRequest.some(
            (request) =>
                Number(request.user_id) === uid &&
                (request.request_state === 1 || request.request_state === 4)
        );
    }
    return false;
}

export function shouldShowLiveLocationShare(trip, userId, now) {
    if (!trip || !trip.trip_date || !isLiveLocationParticipant(trip, userId)) {
        return false;
    }
    const current = now || dayjs();
    return canStartSharing(current, dayjs(trip.trip_date), trip.estimated_time);
}

function getLocationName(point) {
    if (!point) {
        return '';
    }
    if (point.json_address) {
        if (point.json_address.ciudad) {
            return point.json_address.ciudad;
        }
        if (point.json_address.name) {
            return point.json_address.name;
        }
    }
    return point.address || '';
}

function getStateName(point) {
    if (!point || !point.json_address) {
        return '';
    }
    if (point.json_address.provincia) {
        return point.json_address.provincia;
    }
    if (point.json_address.state) {
        return point.json_address.state;
    }
    return '';
}

function parseTownLabel(town) {
    if (!town) {
        return { city: '', region: '' };
    }
    const parts = String(town)
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    return {
        city: parts[0] || '',
        region: parts[1] || ''
    };
}

export function getTripLocationLabels(trip) {
    if (trip && trip.points && trip.points.length >= 2) {
        const fromPoint = trip.points[0];
        const toPoint = trip.points[trip.points.length - 1];
        return {
            fromCity: getLocationName(fromPoint),
            fromRegion: getStateName(fromPoint),
            toCity: getLocationName(toPoint),
            toRegion: getStateName(toPoint)
        };
    }

    const from = parseTownLabel(trip && trip.from_town);
    const to = parseTownLabel(trip && trip.to_town);
    return {
        fromCity: from.city,
        fromRegion: from.region,
        toCity: to.city,
        toRegion: to.region
    };
}
