import { describe, expect, it } from 'vitest';
import {
    DONATION_AFTER_RATING_HEADER_ROUTE_NAMES,
    usesDonationAfterRatingHeader
} from './donationAfterRatingHeader.js';

describe('usesDonationAfterRatingHeader', () => {
    it('lists the donation after rating route names', () => {
        expect(DONATION_AFTER_RATING_HEADER_ROUTE_NAMES).toEqual([
            'donate-after-rating',
            'preview-donation-after-rating'
        ]);
    });

    it('returns true for donation after rating routes', () => {
        expect(usesDonationAfterRatingHeader('donate-after-rating')).toBe(true);
        expect(
            usesDonationAfterRatingHeader('preview-donation-after-rating')
        ).toBe(true);
    });

    it('returns false for other routes', () => {
        expect(usesDonationAfterRatingHeader('trips')).toBe(false);
        expect(usesDonationAfterRatingHeader('my-trips')).toBe(false);
        expect(usesDonationAfterRatingHeader(null)).toBe(false);
    });
});
