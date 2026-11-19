import { describe, expect, it } from 'vitest';
import {
    RATING_NEGATIVE,
    RATING_NEUTRAL,
    RATING_POSITIVE
} from './tripRating';
import { getAdminRatingStatus } from './adminRatingStatus';

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
