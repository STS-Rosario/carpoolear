export const DONATION_AFTER_RATING_HEADER_ROUTE_NAMES = [
    'donate-after-rating',
    'preview-donation-after-rating'
];

export function usesDonationAfterRatingHeader(routeName) {
    return DONATION_AFTER_RATING_HEADER_ROUTE_NAMES.includes(routeName);
}
