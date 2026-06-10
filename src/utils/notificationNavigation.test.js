import { describe, expect, it } from 'vitest';
import {
    resolveTripDetailRoute,
    TRIP_DETAIL_NOTIFICATION_TYPES
} from './notificationNavigation.js';

describe('resolveTripDetailRoute', () => {
    it('includes friend trip alert notification types', () => {
        expect(TRIP_DETAIL_NOTIFICATION_TYPES).toEqual([
            'trip',
            'friend_trip',
            'friend_trip_invite'
        ]);
    });

    it('routes standard trip notifications to trip detail', () => {
        expect(
            resolveTripDetailRoute({
                extras: { type: 'trip', trip_id: 42 }
            })
        ).toEqual({
            name: 'detail_trip',
            params: { id: 42 }
        });
    });

    it('routes friend trip alert notifications to trip detail', () => {
        expect(
            resolveTripDetailRoute({
                extras: {
                    type: 'friend_trip',
                    trip_id: 99,
                    user_id: 7
                }
            })
        ).toEqual({
            name: 'detail_trip',
            params: { id: 99 }
        });
    });

    it('routes friend trip invite notifications to trip detail', () => {
        expect(
            resolveTripDetailRoute({
                extras: { type: 'friend_trip_invite', trip_id: 15 }
            })
        ).toEqual({
            name: 'detail_trip',
            params: { id: 15 }
        });
    });

    it('returns null for unrelated notification types', () => {
        expect(
            resolveTripDetailRoute({
                extras: { type: 'friends', user_id: 3 }
            })
        ).toBeNull();
    });

    it('returns null when trip_id is missing', () => {
        expect(
            resolveTripDetailRoute({
                extras: { type: 'friend_trip', trip_id: null }
            })
        ).toBeNull();
    });
});
