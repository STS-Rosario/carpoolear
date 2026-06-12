import { describe, expect, it } from 'vitest';
import { shouldPromptDonationAfterRating } from './donationAfterRating.js';

describe('shouldPromptDonationAfterRating', () => {
    it('returns true when the user has not interacted with this trip yet', () => {
        expect(
            shouldPromptDonationAfterRating({
                user: { monthly_donate: false, donations: [] },
                tripId: 42,
                tripsRated: 2
            })
        ).toBe(true);
    });

    it('returns false when the user already denied or donated for the trip', () => {
        expect(
            shouldPromptDonationAfterRating({
                user: {
                    monthly_donate: false,
                    donations: [{ trip_id: '42', has_donated: 0, has_denied: 1 }]
                },
                tripId: 42,
                tripsRated: 2
            })
        ).toBe(false);
    });

    it('returns false for monthly donors', () => {
        expect(
            shouldPromptDonationAfterRating({
                user: { monthly_donate: true, donations: [] },
                tripId: 42,
                tripsRated: 2
            })
        ).toBe(false);
    });

    it('returns false once the monthly trip limit is reached', () => {
        expect(
            shouldPromptDonationAfterRating({
                user: {
                    monthly_donate: false,
                    donations: [{ trip_id: 1 }, { trip_id: 2 }]
                },
                tripId: 42,
                tripsRated: 2
            })
        ).toBe(false);
    });
});
