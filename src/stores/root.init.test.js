import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const systemReadyHandlers = [];

vi.mock('../services/bus-event', () => ({
    default: {
        on: vi.fn((event, handler) => {
            if (event === 'system-ready') {
                systemReadyHandlers.push(handler);
            }
        }),
        emit: vi.fn((event) => {
            if (event === 'system-ready') {
                systemReadyHandlers.forEach((handler) => handler());
            }
        })
    }
}));

vi.mock('../services/cache', () => ({
    default: {
        getItem: vi.fn(() => Promise.resolve(null))
    },
    keys: {
        TOKEN_KEY: 'token',
        USER_KEY: 'user',
        DEVICE_KEY: 'device',
        FIRST_TIME_APP_KEY: 'first_time'
    }
}));

vi.mock('./auth', () => ({
    useAuthStore: vi.fn()
}));

vi.mock('./device', () => ({
    useDeviceStore: vi.fn()
}));

vi.mock('./trips', () => ({
    useTripsStore: vi.fn(() => ({
        tripsSearch: vi.fn()
    }))
}));

vi.mock('./myTrips', () => ({
    useMyTripsStore: vi.fn(() => ({
        tripAsDriver: vi.fn(),
        tripAsPassenger: vi.fn()
    }))
}));

vi.mock('./passenger', () => ({
    usePassengerStore: vi.fn(() => ({
        getPendingRequest: vi.fn()
    }))
}));

vi.mock('./cordova', () => ({
    useCordovaStore: vi.fn(() => ({
        device: null
    }))
}));

describe('root store init', () => {
    beforeEach(async () => {
        vi.resetModules();
        setActivePinia(createPinia());
        systemReadyHandlers.length = 0;

        const { useAuthStore } = await import('./auth');
        const { useDeviceStore } = await import('./device');

        useAuthStore.mockReturnValue({
            token: null,
            auth: false,
            retoken: vi.fn(() => Promise.resolve()),
            setToken: vi.fn(),
            setUser: vi.fn(),
            fetchUser: vi.fn()
        });
        useDeviceStore.mockReturnValue({
            setCurrentDevice: vi.fn(),
            setFirstTimeAppOpen: vi.fn(),
            resize: vi.fn()
        });
    });

    it('runs startup only once when init is called concurrently', async () => {
        const bus = (await import('../services/bus-event')).default;
        const { useRootStore } = await import('./root');
        const rootStore = useRootStore();
        const startAppSpy = vi.spyOn(rootStore, 'startApp');

        await Promise.all([rootStore.init(), rootStore.init()]);
        await vi.waitFor(() => {
            expect(bus.emit).toHaveBeenCalledWith('system-ready');
        });

        expect(startAppSpy).toHaveBeenCalledTimes(1);
        expect(bus.emit).toHaveBeenCalledTimes(1);
    });
});
