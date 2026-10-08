export const RATING_USER_TO_TYPE_DRIVER = 0;
export const RATING_USER_TO_TYPE_PASSENGER = 1;

export function shouldAskPaidMoreThanContribution({ userToType, seatPriceCents } = {}) {
    return Number(userToType) === RATING_USER_TO_TYPE_DRIVER && Number(seatPriceCents) > 0;
}

export function canSubmitPaidMoreAnswer(shouldAsk, paidMore) {
    if (!shouldAsk) {
        return true;
    }

    return paidMore === true || paidMore === false;
}

export function buildRatingVotePayload({ comment, rating, paidMore, includePaidMore }) {
    const payload = {
        comment,
        rating
    };

    if (includePaidMore) {
        payload.paid_more = paidMore;
    }

    return payload;
}
