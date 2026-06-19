import { describe, it, expect } from 'vitest';
import {
    appendSupportInfoToMessage,
    buildSupportInfoSnapshot,
    formatSupportInfoBlock,
    SUPPORT_INFO_SECTION_HEADER
} from './supportInfo.js';

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

describe('formatSupportInfoBlock', () => {
    it('renders labeled device and app fields', () => {
        const snapshot = buildSupportInfoSnapshot({
            appVersionInfo: {
                version: '120',
                versionName: '3.2.9',
                versionSource: 'real',
                platform: 'android'
            },
            capacitorPlatform: 'android',
            isNativePlatform: true,
            device: {
                platform: 'android',
                model: 'Pixel 7',
                version: '14'
            }
        });

        const block = formatSupportInfoBlock(snapshot);

        expect(block).toContain(SUPPORT_INFO_SECTION_HEADER);
        expect(block).toContain('App Version: 120');
        expect(block).toContain('App Version Name: 3.2.9');
        expect(block).toContain('Platform: android');
        expect(block).toContain('Device Model: Pixel 7');
        expect(block).toContain('OS Version: 14');
    });
});

describe('appendSupportInfoToMessage', () => {
    it('appends support info block after the user message', () => {
        const snapshot = buildSupportInfoSnapshot({
            windowAppVersion: '3.2.9',
            capacitorPlatform: 'web',
            isNativePlatform: false,
            webBuildNumber: 120
        });

        const result = appendSupportInfoToMessage('Need help with login', snapshot);

        expect(result.startsWith('Need help with login')).toBe(true);
        expect(result).toContain(SUPPORT_INFO_SECTION_HEADER);
        expect(result).toContain('Web Build: 120');
    });
});
