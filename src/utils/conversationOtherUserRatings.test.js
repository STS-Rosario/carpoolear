import { describe, expect, it } from 'vitest';
import {
    getOtherParticipant,
    getOtherParticipantRatings
} from './conversationOtherUserRatings.js';

describe('conversationOtherUserRatings', () => {
    const currentUserId = 1;
    const users = [
        { id: 1, name: 'Me' },
        {
            id: 2,
            name: 'Other',
            positive_ratings: 5,
            negative_ratings: 2
        }
    ];

    it('returns the single other participant in a 1:1 conversation', () => {
        expect(getOtherParticipant(users, currentUserId)).toEqual(users[1]);
    });

    it('returns null when there is not exactly one other participant', () => {
        expect(getOtherParticipant(users, currentUserId)).not.toBeNull();
        expect(
            getOtherParticipant(
                [
                    { id: 1, name: 'Me' },
                    { id: 2, name: 'A' },
                    { id: 3, name: 'B' }
                ],
                currentUserId
            )
        ).toBeNull();
        expect(getOtherParticipant(null, currentUserId)).toBeNull();
    });

    it('returns positive and negative rating counts for the other participant', () => {
        expect(getOtherParticipantRatings(users, currentUserId)).toEqual({
            positive: 5,
            negative: 2
        });
    });

    it('defaults missing rating counts to zero', () => {
        expect(
            getOtherParticipantRatings(
                [{ id: 1, name: 'Me' }, { id: 2, name: 'Other' }],
                currentUserId
            )
        ).toEqual({
            positive: 0,
            negative: 0
        });
    });

    it('returns null when ratings are not applicable', () => {
        expect(getOtherParticipantRatings(null, currentUserId)).toBeNull();
    });
});
