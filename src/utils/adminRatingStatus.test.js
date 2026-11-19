import { describe, expect, it } from 'vitest';
import {
    RATING_NEGATIVE,
    RATING_NEUTRAL,
    RATING_POSITIVE
} from './tripRating';
import {
    filterAdminGivenRatings,
    filterAdminReceivedRatings,
    getAdminRatingStatus,
    isAdminRatingSubmitted
} from './adminRatingStatus';

describe('getAdminRatingStatus', () => {
    it.each([
        [{ rating: null, rate_at: null }, 'pending', 'adminUsuariosCalificacionPendiente'],
        [{ rating: undefined, rate_at: null }, 'pending', 'adminUsuariosCalificacionPendiente'],
        [
            { rating: RATING_NEGATIVE, rate_at: '2024-01-01T00:00:00Z' },
            'negative',
            'rateItemNegativa'
        ],
        [
            { rating: RATING_POSITIVE, rate_at: '2024-01-01T00:00:00Z' },
            'positive',
            'rateItemPositiva'
        ],
        [
            { rating: RATING_NEUTRAL, rate_at: '2024-01-01T00:00:00Z' },
            'neutral',
            'rateItemNeutral'
        ]
    ])('maps %j to %s with label key %s', (row, kind, labelKey) => {
        const status = getAdminRatingStatus(row);
        expect(status.kind).toBe(kind);
        expect(status.labelKey).toBe(labelKey);
    });

    it('never treats null rating as negative', () => {
        const status = getAdminRatingStatus({ rating: null, rate_at: null });
        expect(status.kind).not.toBe('negative');
        expect(status.labelKey).not.toBe('rateItemNegativa');
        expect(status.pillClass).not.toBe('admin-rating-pill--negative');
    });

    it('uses a distinct pending pill class', () => {
        expect(getAdminRatingStatus({ rating: null }).pillClass).toBe(
            'admin-rating-pill--pending'
        );
    });
});

describe('isAdminRatingSubmitted', () => {
    it.each([
        [null, false],
        [undefined, false],
        [RATING_NEGATIVE, true],
        [RATING_POSITIVE, true],
        [RATING_NEUTRAL, true]
    ])('rating %p → submitted %p', (rating, expected) => {
        expect(isAdminRatingSubmitted({ rating })).toBe(expected);
    });
});

describe('filterAdminReceivedRatings', () => {
    it('drops unvoted rows and keeps submitted ratings like the public profile', () => {
        const list = [
            { id: 1, rating: null, rate_at: null },
            { id: 2, rating: RATING_POSITIVE, rate_at: '2024-01-01', available: 1 },
            { id: 3, rating: RATING_NEGATIVE, rate_at: '2024-01-02', available: 0 }
        ];
        expect(filterAdminReceivedRatings(list).map((r) => r.id)).toEqual([2]);
    });

    it('keeps submitted rows when available is omitted from the API payload', () => {
        const list = [
            { id: 10, rating: RATING_NEUTRAL, rate_at: '2024-01-01' },
            { id: 11, rating: null, rate_at: null }
        ];
        expect(filterAdminReceivedRatings(list).map((r) => r.id)).toEqual([10]);
    });
});

describe('filterAdminGivenRatings', () => {
    it('drops unvoted rows regardless of availability', () => {
        const list = [
            { id: 1, rating: null },
            { id: 2, rating: RATING_NEGATIVE, available: 0 }
        ];
        expect(filterAdminGivenRatings(list).map((r) => r.id)).toEqual([2]);
    });
});
