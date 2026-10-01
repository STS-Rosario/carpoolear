import { describe, expect, it } from 'vitest';
import {
    DONATION_AFTER_RATING_PREVIEW_TRIP_ID,
    buildDonationAfterRatingPreviewUrl
} from './donationAfterRatingPreview.js';

describe('donationAfterRatingPreview', () => {
    it('exports a default preview trip id', () => {
        expect(DONATION_AFTER_RATING_PREVIEW_TRIP_ID).toBe('0');
    });

    it('builds the hash-router preview path', () => {
        expect(buildDonationAfterRatingPreviewUrl()).toBe(
            '/preview/donation-after-rating/0'
        );
    });

    it('builds a full dev preview url when base origin is provided', () => {
        expect(
            buildDonationAfterRatingPreviewUrl({
                origin: 'http://localhost:8080'
            })
        ).toBe('http://localhost:8080/#/preview/donation-after-rating/0');
    });
});
