import {
    RATING_NEGATIVE,
    RATING_NEUTRAL,
    RATING_POSITIVE
} from './tripRating';

export function isAdminRatingPending(rating) {
    return rating === null || rating === undefined;
}

/**
 * Maps an admin API rating row to pill kind, i18n label key, and CSS modifier.
 * @param {{ rating?: number | null, rate_at?: string | null }} row
 */
export function getAdminRatingStatus(row) {
    const rating = row?.rating;

    if (isAdminRatingPending(rating)) {
        return {
            kind: 'pending',
            labelKey: 'adminUsuariosCalificacionPendiente',
            pillClass: 'admin-rating-pill--pending'
        };
    }

    const value = Number(rating);

    if (value === RATING_POSITIVE) {
        return {
            kind: 'positive',
            labelKey: 'rateItemPositiva',
            pillClass: 'admin-rating-pill--positive'
        };
    }

    if (value === RATING_NEUTRAL) {
        return {
            kind: 'neutral',
            labelKey: 'rateItemNeutral',
            pillClass: 'admin-rating-pill--neutral'
        };
    }

    if (value === RATING_NEGATIVE) {
        return {
            kind: 'negative',
            labelKey: 'rateItemNegativa',
            pillClass: 'admin-rating-pill--negative'
        };
    }

    return {
        kind: 'pending',
        labelKey: 'adminUsuariosCalificacionPendiente',
        pillClass: 'admin-rating-pill--pending'
    };
}