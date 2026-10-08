import { describe, expect, it } from 'vitest';
import {
    RATING_USER_TO_TYPE_DRIVER,
    RATING_USER_TO_TYPE_PASSENGER,
    buildRatingVotePayload,
    canSubmitPaidMoreAnswer,
    shouldAskPaidMoreThanContribution
} from './tripContributionOvercharge.js';

describe('shouldAskPaidMoreThanContribution', () => {
    it('asks only when a passenger rates a driver and the trip has a contribution', () => {
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: RATING_USER_TO_TYPE_DRIVER,
                seatPriceCents: 1500000
            })
        ).toBe(true);
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: RATING_USER_TO_TYPE_PASSENGER,
                seatPriceCents: 1500000
            })
        ).toBe(false);
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: RATING_USER_TO_TYPE_DRIVER,
                seatPriceCents: 0
            })
        ).toBe(false);
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: RATING_USER_TO_TYPE_DRIVER,
                seatPriceCents: -1
            })
        ).toBe(false);
        expect(
            shouldAskPaidMoreThanContribution({
                userToType: RATING_USER_TO_TYPE_DRIVER,
                seatPriceCents: null
            })
        ).toBe(false);
    });
});

describe('canSubmitPaidMoreAnswer', () => {
    it('requires a boolean answer only when the question applies', () => {
        expect(canSubmitPaidMoreAnswer(true, null)).toBe(false);
        expect(canSubmitPaidMoreAnswer(true, true)).toBe(true);
        expect(canSubmitPaidMoreAnswer(true, false)).toBe(true);
        expect(canSubmitPaidMoreAnswer(false, null)).toBe(true);
    });
});

describe('buildRatingVotePayload', () => {
    it('includes paid_more only when the question applies', () => {
        expect(
            buildRatingVotePayload({
                comment: 'ok',
                rating: 1,
                paidMore: true,
                includePaidMore: true
            })
        ).toEqual({ comment: 'ok', rating: 1, paid_more: true });
        expect(
            buildRatingVotePayload({
                comment: 'ok',
                rating: 1,
                paidMore: false,
                includePaidMore: false
            })
        ).toEqual({ comment: 'ok', rating: 1 });
    });
});
