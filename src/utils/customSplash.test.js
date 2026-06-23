import { describe, expect, it } from 'vitest';
import {
    CUSTOM_SPLASH_DISMISS_MS,
    formatSplashVersionText,
    isAdminAppUrl,
    isCustomSplashVisible,
    resolveSplashVersion,
    SPLASH_WEB_BUILD_NUMBER
} from './customSplash.js';

describe('formatSplashVersionText', () => {
    it('shows version and build number on web', () => {
        expect(
            formatSplashVersionText({ version: '3.2.5', isNativePlatform: false })
        ).toBe('Version 3.2.5 - build 125');
    });

    it('shows version only on native platforms', () => {
        expect(
            formatSplashVersionText({ version: '123', isNativePlatform: true })
        ).toBe('Version 123');
    });

    it('falls back to zero when version is missing', () => {
        expect(
            formatSplashVersionText({ version: null, isNativePlatform: false })
        ).toBe('Version 0 - build 125');
    });

    it('falls back to zero on native when version is missing', () => {
        expect(
            formatSplashVersionText({ version: null, isNativePlatform: true })
        ).toBe('Version 0');
    });

    it('does not append build suffix on native even with a custom web build number', () => {
        expect(
            formatSplashVersionText({
                version: '3.3.2',
                isNativePlatform: true,
                webBuildNumber: 999
            })
        ).toBe('Version 3.3.2');
    });

    it('uses a custom web build number on web', () => {
        expect(
            formatSplashVersionText({
                version: '3.3.2',
                isNativePlatform: false,
                webBuildNumber: 999
            })
        ).toBe('Version 3.3.2 - build 999');
    });
});

describe('resolveSplashVersion', () => {
    it('prefers appVersionInfo over window fallback', () => {
        expect(
            resolveSplashVersion({
                appVersionInfo: { version: '9.9.9' },
                windowAppVersion: '3.2.5'
            })
        ).toBe('9.9.9');
    });

    it('uses window.appVersion when store info is unavailable', () => {
        expect(
            resolveSplashVersion({
                appVersionInfo: null,
                windowAppVersion: '3.2.5'
            })
        ).toBe('3.2.5');
    });

    it('falls back to zero when no version source is available', () => {
        expect(
            resolveSplashVersion({
                appVersionInfo: null,
                windowAppVersion: null
            })
        ).toBe('0');
    });
});

describe('splash version display (App.vue integration)', () => {
    function formatAppSplashVersionText({
        appVersionInfo,
        windowAppVersion,
        isNativePlatform,
        webBuildNumber = SPLASH_WEB_BUILD_NUMBER
    }) {
        return formatSplashVersionText({
            version: resolveSplashVersion({ appVersionInfo, windowAppVersion }),
            isNativePlatform,
            webBuildNumber
        });
    }

    it('shows native app version without build suffix on Android', () => {
        expect(
            formatAppSplashVersionText({
                appVersionInfo: {
                    version: '3030020',
                    versionName: '3.3.2',
                    versionSource: 'real',
                    platform: 'android'
                },
                windowAppVersion: '3.3.2',
                isNativePlatform: true
            })
        ).toBe('Version 3030020');
    });

    it('shows semver fallback with build suffix on web', () => {
        expect(
            formatAppSplashVersionText({
                appVersionInfo: null,
                windowAppVersion: '3.3.2',
                isNativePlatform: false
            })
        ).toBe('Version 3.3.2 - build 125');
    });
});

describe('isAdminAppUrl', () => {
    it('detects admin routes in history and hash mode', () => {
        expect(isAdminAppUrl({ path: '/admin' })).toBe(true);
        expect(isAdminAppUrl({ path: '/admin/users' })).toBe(true);
        expect(isAdminAppUrl({ pathname: '/app/admin/trips' })).toBe(true);
        expect(isAdminAppUrl({ hash: '#/admin/users' })).toBe(true);
        expect(isAdminAppUrl({ fullPath: '/admin/support-tickets/new' })).toBe(true);
    });

    it('does not treat public routes as admin', () => {
        expect(isAdminAppUrl({ path: '/trips' })).toBe(false);
        expect(isAdminAppUrl({ path: '/trips', fullPath: '/trips?clearSearch=true' })).toBe(false);
        expect(isAdminAppUrl({ pathname: '/trips', search: '?clearSearch=true' })).toBe(false);
        expect(isAdminAppUrl({ path: '/login' })).toBe(false);
        expect(isAdminAppUrl({ hash: '#/trips' })).toBe(false);
        expect(isAdminAppUrl(null)).toBe(false);
    });
});

describe('isCustomSplashVisible', () => {
    it('shows splash on public routes including trips with query params', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: true
            })
        ).toBe(true);
        expect(
            isCustomSplashVisible({
                location: { path: '/trips', fullPath: '/trips?clearSearch=true' },
                showCustomSplash: true
            })
        ).toBe(true);
    });

    it('still shows splash for admin users outside admin routes', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: true
            })
        ).toBe(true);
    });

    it('hides splash on admin routes', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/admin/users' },
                showCustomSplash: true
            })
        ).toBe(false);
    });

    it('hides splash after dismiss timer clears showCustomSplash', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: false
            })
        ).toBe(false);
    });
});

describe('CUSTOM_SPLASH_DISMISS_MS', () => {
    it('keeps the public splash visible for three seconds', () => {
        expect(CUSTOM_SPLASH_DISMISS_MS).toBe(3000);
    });

    it('exposes the web build number used on the splash screen', () => {
        expect(SPLASH_WEB_BUILD_NUMBER).toBe(125);
    });
});
