export const DONATION_AFTER_RATING_HERO_IMAGE_FILE = 'carpoolear-grupal-1.jpg';

export function getDonationAfterRatingHeroImageUrl(env = import.meta.env) {
    const baseUrl = String(env.VITE_API_URL || '').replace(/\/$/, '');

    return `${baseUrl}/img/${DONATION_AFTER_RATING_HERO_IMAGE_FILE}`;
}
