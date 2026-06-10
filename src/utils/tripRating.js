export const RATING_NEGATIVE = 0;
export const RATING_POSITIVE = 1;
export const RATING_NEUTRAL = 2;

export function ratingRequiresComment(rating) {
    const value = Number(rating);
    return value === RATING_NEGATIVE || value === RATING_NEUTRAL;
}

export function canSubmitRatingVote(rating, comment) {
    if (rating === null || rating === undefined) {
        return false;
    }

    if (ratingRequiresComment(rating)) {
        return Boolean(String(comment || '').trim());
    }

    return true;
}

export function isPositiveRating(rating) {
    return Number(rating) === RATING_POSITIVE;
}

export function isNegativeRating(rating) {
    return Number(rating) === RATING_NEGATIVE;
}

export function isNeutralRating(rating) {
    return Number(rating) === RATING_NEUTRAL;
}

export function sumUserRatings(profile) {
    const source = profile || {};
    return (
        (Number(source.positive_ratings) || 0) +
        (Number(source.negative_ratings) || 0) +
        (Number(source.neutral_ratings) || 0)
    );
}

export function userRatingsFromProfile(profile) {
    const source = profile || {};
    return {
        positive: Number(source.positive_ratings) || 0,
        negative: Number(source.negative_ratings) || 0,
        neutral: Number(source.neutral_ratings) || 0
    };
}

export const NEUTRAL_RATING_ICON_STYLE = {
    transform: 'rotate(-90deg)',
    filter: 'grayscale(100%)'
};
