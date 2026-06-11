export function formatTripDate(tripDate) {
    if (!tripDate) {
        return '';
    }
    return String(tripDate).slice(0, 10);
}

export function formatTripTime(tripDate) {
    if (!tripDate) {
        return '';
    }
    return String(tripDate).slice(11, 16);
}

export function formatOccupiedSeats(trip) {
    if (trip.passengerAccepted_count != null) {
        return trip.passengerAccepted_count;
    }
    return '—';
}

export function formatTripStatus(trip, translate) {
    if (trip.hidden) {
        return translate('oculto');
    }
    if (trip.deleted) {
        return translate('borrado');
    }
    return translate('activo');
}
