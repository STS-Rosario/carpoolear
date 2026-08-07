import { describe, expect, it, vi } from 'vitest';
import {
    TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR,
    resolveTripInviteFriendsClose
} from './tripInviteFriendsClose.js';

describe('tripInviteFriendsClose', () => {
    it('emits close for modal usage on trip detail', () => {
        const emit = vi.fn();
        const router = { push: vi.fn() };

        const result = resolveTripInviteFriendsClose({
            closeBehavior: TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR.EMIT,
            tripId: 42,
            router,
            emit
        });

        expect(result).toEqual({ navigated: false, emitted: true });
        expect(emit).toHaveBeenCalledWith('close');
        expect(router.push).not.toHaveBeenCalled();
    });

    it('navigates to trip detail after create success dismiss', () => {
        const emit = vi.fn();
        const router = { push: vi.fn() };

        const result = resolveTripInviteFriendsClose({
            closeBehavior: TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR.TRIP_DETAIL,
            tripId: 42,
            router,
            emit
        });

        expect(result).toEqual({ navigated: true, emitted: false });
        expect(router.push).toHaveBeenCalledWith({
            name: 'detail_trip',
            params: { id: 42 }
        });
        expect(emit).not.toHaveBeenCalled();
    });
});
