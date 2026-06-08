import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    clearLocationWatch,
    getGeolocationAdapter,
    isNativePlatform,
    requestLocationPermission,
    startLocationWatch
} from './geolocation.js';

describe('geolocation', () => {
    beforeEach(() => {
        vi.stubGlobal('navigator', {
            geolocation: {
                getCurrentPosition: vi.fn((success) => {
                    success({ coords: { latitude: -34.6, longitude: -58.38 } });
                }),
                watchPosition: vi.fn((success) => {
                    success({ coords: { latitude: -34.6, longitude: -58.38 } });
                    return 42;
                }),
                clearWatch: vi.fn()
            }
        });
        vi.stubGlobal('window', {
            Capacitor: {
                isNativePlatform: () => false
            }
        });
    });

    afterEach(() => {
        clearLocationWatch();
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('uses web geolocation adapter when not on native platform', () => {
        const adapter = getGeolocationAdapter();
        expect(adapter.name).toBe('web');
    });

    it('requestLocationPermission resolves with coordinates on web', async () => {
        const position = await requestLocationPermission();
        expect(position.lat).toBe(-34.6);
        expect(position.lng).toBe(-58.38);
    });

    it('startLocationWatch invokes callback and returns watch id on web', async () => {
        const callback = vi.fn();
        const watchId = await startLocationWatch(callback);
        expect(watchId).toBe(42);
        expect(callback).toHaveBeenCalledWith({ lat: -34.6, lng: -58.38 });
    });

    it('clearLocationWatch clears active web watch', async () => {
        await startLocationWatch(() => {});
        clearLocationWatch();
        expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(42);
    });

    it('isNativePlatform reflects Capacitor state', () => {
        expect(isNativePlatform()).toBe(false);
        window.Capacitor.isNativePlatform = () => true;
        expect(isNativePlatform()).toBe(true);
    });
});

describe('geolocation native background adapter', () => {
    const mockRemoveWatcher = vi.fn();
    const mockAddWatcher = vi.fn((_options, onLocation) => {
        const location = { latitude: -34.61, longitude: -58.39 };
        onLocation(location, undefined);
        return Promise.resolve('bg-watch-1');
    });
    const mockRequestPermissions = vi.fn(() =>
        Promise.resolve({ location: 'granted', coarseLocation: 'granted' })
    );
    const mockGetCurrentPosition = vi.fn(() =>
        Promise.resolve({
            coords: { latitude: -34.6, longitude: -58.38 }
        })
    );

    beforeEach(() => {
        vi.stubGlobal('window', {
            Capacitor: {
                isNativePlatform: () => true
            }
        });
        vi.doMock('@capacitor/core', () => ({
            registerPlugin: () => ({
                addWatcher: mockAddWatcher,
                removeWatcher: mockRemoveWatcher
            })
        }));
        vi.doMock('@capacitor/geolocation', () => ({
            Geolocation: {
                requestPermissions: mockRequestPermissions,
                getCurrentPosition: mockGetCurrentPosition
            }
        }));
    });

    afterEach(async () => {
        const { clearLocationWatch: clearWatch } = await import('./geolocation.js');
        clearWatch();
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('uses background geolocation watcher on native platforms', async () => {
        const { startLocationWatch: startWatch } = await import('./geolocation.js');
        const callback = vi.fn();
        const watchId = await startWatch(callback, {
            messages: {
                backgroundTitle: 'Carpoolear',
                backgroundMessage: 'Sharing live location'
            }
        });

        expect(watchId).toBe('bg-watch-1');
        expect(mockAddWatcher).toHaveBeenCalledWith(
            expect.objectContaining({
                backgroundTitle: 'Carpoolear',
                backgroundMessage: 'Sharing live location',
                requestPermissions: true
            }),
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith({ lat: -34.61, lng: -58.39 });
    });
});
