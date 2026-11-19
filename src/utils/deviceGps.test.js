import { beforeEach, describe, expect, it } from 'vitest';
import {
    clearDeviceGpsCapabilityCache,
    deviceHasGpsCapability
} from './deviceGps.js';

describe('deviceHasGpsCapability', () => {
    beforeEach(() => {
        clearDeviceGpsCapabilityCache();
    });

    it('returns true on web when geolocation exists', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'web',
                hasWebGeolocation: () => true
            })
        ).resolves.toBe(true);
    });

    it('returns false on web when geolocation missing', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'web',
                hasWebGeolocation: () => false
            })
        ).resolves.toBe(false);
    });

    it('uses Android native probe', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'android',
                hasAndroidGps: async () => false
            })
        ).resolves.toBe(false);
    });

    it('returns true on ios', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'ios'
            })
        ).resolves.toBe(true);
    });

    it('caches the first resolved value', async () => {
        let calls = 0;
        const hasWebGeolocation = () => {
            calls += 1;
            return true;
        };
        await deviceHasGpsCapability({
            getPlatform: () => 'web',
            hasWebGeolocation
        });
        await deviceHasGpsCapability({
            getPlatform: () => 'web',
            hasWebGeolocation
        });
        expect(calls).toBe(1);
    });
});
