import { describe, expect, it } from 'vitest';
import {
    hasPendingRatings,
    shouldRedirectForPendingRatings,
    PENDING_RATINGS_REDIRECT_ROUTE
} from './pendingRatingsEnforcement.js';

describe('pendingRatingsEnforcement', () => {
    it('returns false when pending rates are null', () => {
        expect(hasPendingRatings(null)).toBe(false);
    });

    it('returns false when pending rates are an empty array', () => {
        expect(hasPendingRatings([])).toBe(false);
    });

    it('returns true when pending rates has items', () => {
        expect(hasPendingRatings([{ id: 1 }])).toBe(true);
    });

    it('does not redirect when there are no pending rates', () => {
        expect(shouldRedirectForPendingRatings([], 'detail_trip')).toBe(false);
    });

    it('does not redirect on my-trips so users can submit ratings', () => {
        expect(shouldRedirectForPendingRatings([{ id: 1 }], 'my-trips')).toBe(
            false
        );
    });

    it('redirects on restricted routes when pending rates exist', () => {
        expect(
            shouldRedirectForPendingRatings([{ id: 1 }], 'detail_trip')
        ).toBe(true);
    });

    it('uses my-trips as redirect destination', () => {
        expect(PENDING_RATINGS_REDIRECT_ROUTE).toEqual({ name: 'my-trips' });
    });
});
