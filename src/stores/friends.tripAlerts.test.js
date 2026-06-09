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
    }
}));

describe('friends store trip alerts', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        toggleTripAlertsMock.mockReset();
    });

    it('returns the API body without double-unwrapping response.data', async () => {
        toggleTripAlertsMock
            .mockResolvedValueOnce({ friend_trip_alerts_enabled: true })
            .mockResolvedValueOnce({ friend_trip_alerts_enabled: false });

        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();

        const first = await store.toggleTripAlerts(7);
        const second = await store.toggleTripAlerts(7);

        expect(first).toEqual({ friend_trip_alerts_enabled: true });
        expect(second).toEqual({ friend_trip_alerts_enabled: false });
    });
});
