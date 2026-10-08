import { describe, expect, it } from 'vitest';
import {
    RATE_PENDING_PASSENGER_PREVIEW_PATH,
    RATE_PENDING_PASSENGER_PREVIEW_RATE,
    buildRatePendingPassengerPreviewUrl
} from './ratePendingPassengerPreview.js';
import { shouldAskPaidMoreThanContribution } from './tripContributionOvercharge.js';

describe('ratePendingPassengerPreview', () => {
    it('builds the hash-router preview path', () => {
        expect(RATE_PENDING_PASSENGER_PREVIEW_PATH).toBe(
            '/preview/rate-pending-passenger'
        );
        expect(buildRatePendingPassengerPreviewUrl()).toBe(
            '/preview/rate-pending-passenger'
        );
    });

    it('builds a full dev preview url when base origin is provided', () => {
        expect(
            buildRatePendingPassengerPreviewUrl({
                origin: 'http://localhost:8080'
            })
        ).toBe('http://localhost:8080/#/preview/rate-pending-passenger');
    });

    it('uses a passenger-rating-driver fixture that asks the paid-more question', () => {
        const rate = RATE_PENDING_PASSENGER_PREVIEW_RATE;
        expect(rate.user_to_type).toBe(0);
        expect(rate.to.name).toBeTruthy();
        expect(rate.trip.seat_price_cents).toBeGreaterThan(0);
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: rate.user_to_type,
                seatPriceCents: rate.trip.seat_price_cents
            })
        ).toBe(true);
    });
});
