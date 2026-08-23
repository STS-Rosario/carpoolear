export const DONATION_AFTER_RATING_PREVIEW_TRIP_ID = '0';

export function buildDonationAfterRatingPreviewUrl(options = {}) {
    const tripId = options.tripId ?? DONATION_AFTER_RATING_PREVIEW_TRIP_ID;
    const basePath = options.basePath ?? `/preview/donation-after-rating/${tripId}`;

    if (options.origin) {
        return `${options.origin}/#${basePath}`;
    }

    return basePath;
}
