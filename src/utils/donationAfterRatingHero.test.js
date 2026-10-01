import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    DONATION_AFTER_RATING_HERO_IMAGE_FILE,
    getDonationAfterRatingHeroImageUrl
} from './donationAfterRatingHero.js';

describe('donationAfterRatingHero', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('exports the hero image filename', () => {
        expect(DONATION_AFTER_RATING_HERO_IMAGE_FILE).toBe(
            'carpoolear-grupal-1.jpg'
        );
    });

    it('builds the hero image url from API_URL/img/', () => {
        vi.stubEnv('VITE_API_URL', 'https://api.carpoolear.test');

        expect(getDonationAfterRatingHeroImageUrl()).toBe(
            'https://api.carpoolear.test/img/carpoolear-grupal-1.jpg'
        );
    });

    it('normalizes a trailing slash on API_URL', () => {
        vi.stubEnv('VITE_API_URL', 'https://api.carpoolear.test/');

        expect(getDonationAfterRatingHeroImageUrl()).toBe(
            'https://api.carpoolear.test/img/carpoolear-grupal-1.jpg'
        );
    });
});
