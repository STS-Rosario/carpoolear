import { describe, expect, it } from 'vitest';
import { splitFriendTrips } from './splitFriendTrips.js';

describe('splitFriendTrips', () => {
    it('splits trips by driver_is_friend flag', () => {
        const trips = [
            { id: 1, driver_is_friend: true },
            { id: 2, driver_is_friend: false },
            { id: 3, driver_is_friend: true }
        ];

        expect(splitFriendTrips(trips)).toEqual({
            friendTrips: [
                { id: 1, driver_is_friend: true },
                { id: 3, driver_is_friend: true }
            ],
            otherTrips: [{ id: 2, driver_is_friend: false }]
        });
    });

    it('returns empty lists for missing input', () => {
        expect(splitFriendTrips(null)).toEqual({
            friendTrips: [],
            otherTrips: []
        });
        expect(splitFriendTrips([])).toEqual({
            friendTrips: [],
            otherTrips: []
        });
    });
});
