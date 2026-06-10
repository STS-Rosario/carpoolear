import { describe, expect, it } from 'vitest';
import {
    RATING_NEGATIVE,
    RATING_NEUTRAL,
    RATING_POSITIVE,
    canSubmitRatingVote,
    getRequiredCommentMessageKey,
    isNeutralRating,
    isNegativeRating,
    isPositiveRating,
    ratingRequiresComment,
    sumUserRatings,
    userRatingsFromProfile
} from './tripRating';

describe('tripRating constants', () => {
    it('defines negative, positive, and neutral rating values', () => {
        expect(RATING_NEGATIVE).toBe(0);
        expect(RATING_POSITIVE).toBe(1);
        expect(RATING_NEUTRAL).toBe(2);
    });
});

describe('ratingRequiresComment', () => {
    it('requires a comment for negative and neutral ratings', () => {
        expect(ratingRequiresComment(RATING_NEGATIVE)).toBe(true);
        expect(ratingRequiresComment(RATING_NEUTRAL)).toBe(true);
    });

    it('does not require a comment for positive ratings', () => {
        expect(ratingRequiresComment(RATING_POSITIVE)).toBe(false);
    });
});

describe('canSubmitRatingVote', () => {
    it('rejects votes without a selected rating', () => {
        expect(canSubmitRatingVote(null, 'note')).toBe(false);
        expect(canSubmitRatingVote(undefined, 'note')).toBe(false);
    });

    it('requires non-empty comments for negative and neutral ratings', () => {
        expect(canSubmitRatingVote(RATING_NEGATIVE, '')).toBe(false);
        expect(canSubmitRatingVote(RATING_NEGATIVE, '   ')).toBe(false);
        expect(canSubmitRatingVote(RATING_NEUTRAL, '')).toBe(false);
        expect(canSubmitRatingVote(RATING_NEUTRAL, 'ok')).toBe(true);
        expect(canSubmitRatingVote(RATING_NEGATIVE, 'bad')).toBe(true);
    });

    it('allows positive ratings without a comment', () => {
        expect(canSubmitRatingVote(RATING_POSITIVE, '')).toBe(true);
    });
});

describe('rating type helpers', () => {
    it('identifies positive, negative, and neutral ratings', () => {
        expect(isPositiveRating(1)).toBe(true);
        expect(isNegativeRating(0)).toBe(true);
        expect(isNeutralRating(2)).toBe(true);
        expect(isNeutralRating('2')).toBe(true);
    });
});

describe('getRequiredCommentMessageKey', () => {
    it('returns neutral-specific copy key for neutral votes', () => {
        expect(getRequiredCommentMessageKey(RATING_NEUTRAL)).toBe(
            'ratePendingComentarioNoPuedeEstarVacioNeutral'
        );
    });

    it('returns negative-specific copy key for negative votes', () => {
        expect(getRequiredCommentMessageKey(RATING_NEGATIVE)).toBe(
            'ratePendingComentarioNoPuedeEstarVacio'
        );
    });
});

describe('sumUserRatings', () => {
    it('sums positive, negative, and neutral counts', () => {
        expect(
            sumUserRatings({
                positive_ratings: 3,
                negative_ratings: 1,
                neutral_ratings: 2
            })
        ).toBe(6);
    });

    it('defaults missing counts to zero', () => {
        expect(sumUserRatings({})).toBe(0);
    });
});

describe('userRatingsFromProfile', () => {
    it('normalizes profile rating counts', () => {
        expect(
            userRatingsFromProfile({
                positive_ratings: '4',
                negative_ratings: 1,
                neutral_ratings: 2
            })
        ).toEqual({
            positive: 4,
            negative: 1,
            neutral: 2
        });
    });
});
