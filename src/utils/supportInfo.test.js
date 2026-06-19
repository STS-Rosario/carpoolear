import { describe, it, expect } from 'vitest';
import { buildSupportInfoSnapshot } from './supportInfo.js';

describe('buildSupportInfoSnapshot', () => {
    it('includes app version from native appVersionInfo on android', () => {
        const snapshot = buildSupportInfoSnapshot({
            appVersionInfo: {
                version: '120',
                versionName: '3.2.9',
                versionSource: 'real',
                platform: 'android'
            },
            capacitorPlatform: 'android',
            isNativePlatform: true
        });

        expect(snapshot.appVersion).toBe('120');
        expect(snapshot.appVersionName).toBe('3.2.9');
        expect(snapshot.appVersionSource).toBe('real');
        expect(snapshot.platform).toBe('android');
    });

    it('includes web build number when running on web', () => {
        const snapshot = buildSupportInfoSnapshot({
            windowAppVersion: '3.2.9',
            capacitorPlatform: 'web',
            isNativePlatform: false,
            webBuildNumber: 120
        });

        expect(snapshot.appVersion).toBe('3.2.9');
        expect(snapshot.webBuildNumber).toBe('120');
        expect(snapshot.platform).toBe('web');
    });

    it('normalizes device fields without undefined values', () => {
        const snapshot = buildSupportInfoSnapshot({
            device: {
                platform: 'android',
                model: 'Pixel 7',
                version: '14',
                manufacturer: 'Google',
                isVirtual: false,
                webViewVersion: '120.0.0'
            },
            deviceId: 'abc-123',
            networkOnline: true,
            notificationPermission: 'granted'
        });

        expect(snapshot.deviceModel).toBe('Pixel 7');
        expect(snapshot.osVersion).toBe('14');
        expect(snapshot.operatingSystem).toBe('android');
        expect(snapshot.deviceManufacturer).toBe('Google');
        expect(snapshot.deviceId).toBe('abc-123');
        expect(snapshot.networkOnline).toBe('online');
        expect(snapshot.notificationPermission).toBe('granted');
        expect(snapshot.isVirtual).toBe('false');
        expect(snapshot.webViewVersion).toBe('120.0.0');
        expect(Object.values(snapshot).every((value) => value !== undefined)).toBe(true);
    });
});
