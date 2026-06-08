import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    clearLocationWatch,
    getGeolocationAdapter,
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
    });

    afterEach(() => {
        clearLocationWatch();
        vi.unstubAllGlobals();
    });

    it('uses web geolocation adapter when navigator.geolocation exists', () => {
        const adapter = getGeolocationAdapter();
        expect(adapter.name).toBe('web');
    });

    it('requestLocationPermission resolves with coordinates', async () => {
        const position = await requestLocationPermission();
        expect(position.lat).toBe(-34.6);
        expect(position.lng).toBe(-58.38);
    });

    it('startLocationWatch invokes callback and returns watch id', () => {
        const callback = vi.fn();
        const watchId = startLocationWatch(callback);
        expect(watchId).toBe(42);
        expect(callback).toHaveBeenCalledWith({ lat: -34.6, lng: -58.38 });
    });

    it('clearLocationWatch clears active web watch', () => {
        startLocationWatch(() => {});
        clearLocationWatch();
        expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(42);
    });
});
