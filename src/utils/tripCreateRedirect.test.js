import { describe, expect, it } from 'vitest';
import {
    shouldInviteFriendsAfterCreate,
    tripDetailRouteAfterCreate
} from './tripCreateRedirect';

describe('tripCreateRedirect', () => {
    it('skips invite friends when backend returned an existing trip', () => {
        expect(shouldInviteFriendsAfterCreate({ id: 5, existing: true })).toBe(
            false
        );
    });

    it('shows invite friends for a newly created trip', () => {
        expect(shouldInviteFriendsAfterCreate({ id: 5, existing: false })).toBe(
            true
        );
        expect(shouldInviteFriendsAfterCreate({ id: 5 })).toBe(true);
    });

    it('builds detail route without inviteFriends for existing trips', () => {
        expect(tripDetailRouteAfterCreate({ id: 42, existing: true })).toEqual({
            name: 'detail_trip',
            params: { id: 42 },
            query: {}
        });
    });

    it('builds detail route with inviteFriends for new trips', () => {
        expect(tripDetailRouteAfterCreate({ id: 42 })).toEqual({
            name: 'detail_trip',
            params: { id: 42 },
            query: { inviteFriends: '1' }
        });
    });
});
