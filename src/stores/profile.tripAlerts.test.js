import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const toggleTripAlertsMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                toggleTripAlerts: toggleTripAlertsMock
            };
        }
    },
    UserApi: class UserApiMock {
        constructor() {
            return {};
        }
    },
    RateApi: class RateApiMock {
        constructor() {
            return {};
        }
    },
    ReferencesApi: class ReferencesApiMock {
        constructor() {
            return {};
        }
    }
}));

describe('profile store friend trip alerts', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('toggles friend_trip_alerts_enabled on repeated updates', async () => {
        const { useProfileStore } = await import('./profile');
        const store = useProfileStore();
        store.user = {
            id: 7,
            name: 'Ana',
            friendship_state: 'friend',
            friend_trip_alerts_enabled: false
        };

        store.setFriendTripAlertsEnabled(true);
        expect(store.user.friend_trip_alerts_enabled).toBe(true);

        store.setFriendTripAlertsEnabled(false);
        expect(store.user.friend_trip_alerts_enabled).toBe(false);

        store.setFriendTripAlertsEnabled(true);
        expect(store.user.friend_trip_alerts_enabled).toBe(true);
    });

    it('reflects alternating API responses across repeated toggles', async () => {
        toggleTripAlertsMock
            .mockResolvedValueOnce({ friend_trip_alerts_enabled: true })
            .mockResolvedValueOnce({ friend_trip_alerts_enabled: false })
            .mockResolvedValueOnce({ friend_trip_alerts_enabled: true });

        const { useFriendsStore } = await import('./friends');
        const { useProfileStore } = await import('./profile');
        const friendsStore = useFriendsStore();
        const profileStore = useProfileStore();
        profileStore.user = {
            id: 7,
            name: 'Ana',
            friendship_state: 'friend',
            friend_trip_alerts_enabled: false
        };

        const first = await friendsStore.toggleTripAlerts(7);
        profileStore.setFriendTripAlertsEnabled(
            Boolean(first.friend_trip_alerts_enabled)
        );
        expect(profileStore.user.friend_trip_alerts_enabled).toBe(true);

        const second = await friendsStore.toggleTripAlerts(7);
        profileStore.setFriendTripAlertsEnabled(
            Boolean(second.friend_trip_alerts_enabled)
        );
        expect(profileStore.user.friend_trip_alerts_enabled).toBe(false);

        const third = await friendsStore.toggleTripAlerts(7);
        profileStore.setFriendTripAlertsEnabled(
            Boolean(third.friend_trip_alerts_enabled)
        );
        expect(profileStore.user.friend_trip_alerts_enabled).toBe(true);
    });
});
