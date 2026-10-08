export const RATE_PENDING_PASSENGER_PREVIEW_PATH =
    '/preview/rate-pending-passenger';

export const RATE_PENDING_PASSENGER_PREVIEW_RATE = {
    id: 1,
    user_to_type: 0,
    to: {
        id: 2,
        name: 'Ana Pérez',
        image: null
    },
    trip: {
        id: 99,
        from_town: 'Rosario',
        to_town: 'Córdoba',
        trip_date: '2026-10-01T08:00:00',
        seat_price_cents: 1500000
    }
};

export function buildRatePendingPassengerPreviewUrl(options = {}) {
    const basePath =
        options.basePath ?? RATE_PENDING_PASSENGER_PREVIEW_PATH;

    if (options.origin) {
        return `${options.origin}/#${basePath}`;
    }

    return basePath;
}
