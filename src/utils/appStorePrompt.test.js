import { describe, expect, it } from 'vitest';
import {
    APP_STORE_PROMPT_DISMISSED_KEY,
    APP_STORE_URL,
    GOOGLE_PLAY_URL,
    detectMobilePlatform,
    getAppStorePrompt
} from './appStorePrompt.js';

const UA = {
    iphone:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    ipadLegacy:
        'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    macSafari:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    android:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
    windowsChrome:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    windowsPhone:
        'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15063',
    unknownMobile:
        'Mozilla/5.0 (Mobile; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5'
};

describe('detectMobilePlatform', () => {
    it('detects iPhone as ios', () => {
        expect(detectMobilePlatform({ userAgent: UA.iphone })).toBe('ios');
    });

    it('detects legacy iPad user agent as ios', () => {
        expect(detectMobilePlatform({ userAgent: UA.ipadLegacy })).toBe('ios');
    });

    it('detects iPadOS reporting itself as Mac with touch as ios', () => {
        expect(
            detectMobilePlatform({ userAgent: UA.macSafari, maxTouchPoints: 5 })
        ).toBe('ios');
    });

    it('treats Mac without touch as desktop', () => {
        expect(
            detectMobilePlatform({ userAgent: UA.macSafari, maxTouchPoints: 0 })
        ).toBeNull();
    });

    it('detects Android phones as android', () => {
        expect(detectMobilePlatform({ userAgent: UA.android })).toBe('android');
    });

    it('treats desktop Windows as desktop', () => {
        expect(detectMobilePlatform({ userAgent: UA.windowsChrome })).toBeNull();
    });

    it('treats an unrecognised mobile device as other', () => {
        expect(detectMobilePlatform({ userAgent: UA.unknownMobile })).toBe('other');
    });

    it('treats Windows Phone as other even if it mentions Android', () => {
        expect(detectMobilePlatform({ userAgent: UA.windowsPhone })).toBe('other');
    });

    it('treats a missing user agent as desktop', () => {
        expect(detectMobilePlatform({})).toBeNull();
    });
});

describe('getAppStorePrompt', () => {
    it('shows only the App Store badge on iOS web', () => {
        expect(getAppStorePrompt({ userAgent: UA.iphone })).toEqual({
            platform: 'ios',
            badges: [{ store: 'app-store', url: APP_STORE_URL }]
        });
    });

    it('shows only the Google Play badge on Android web', () => {
        expect(getAppStorePrompt({ userAgent: UA.android })).toEqual({
            platform: 'android',
            badges: [{ store: 'google-play', url: GOOGLE_PLAY_URL }]
        });
    });

    it('shows both badges on an unknown mobile device', () => {
        expect(getAppStorePrompt({ userAgent: UA.unknownMobile })).toEqual({
            platform: 'other',
            badges: [
                { store: 'google-play', url: GOOGLE_PLAY_URL },
                { store: 'app-store', url: APP_STORE_URL }
            ]
        });
    });

    it('does not show on desktop', () => {
        expect(getAppStorePrompt({ userAgent: UA.windowsChrome })).toBeNull();
        expect(getAppStorePrompt({ userAgent: UA.macSafari })).toBeNull();
    });

    it('does not show on native iOS', () => {
        expect(
            getAppStorePrompt({ userAgent: UA.iphone, isNativePlatform: true })
        ).toBeNull();
    });

    it('does not show on native Android', () => {
        expect(
            getAppStorePrompt({ userAgent: UA.android, isNativePlatform: true })
        ).toBeNull();
    });

    it('does not show once dismissed permanently', () => {
        expect(
            getAppStorePrompt({ userAgent: UA.android, dismissed: true })
        ).toBeNull();
    });
});

describe('app store prompt constants', () => {
    it('links to the Carpoolear store listings', () => {
        expect(GOOGLE_PLAY_URL).toBe(
            'https://play.google.com/store/apps/details?id=com.sts.carpoolear&hl=es_419'
        );
        expect(APP_STORE_URL).toBe(
            'https://apps.apple.com/ar/app/carpoolear/id1045211385'
        );
    });

    it('uses a new dismissal key so old PWA dismissals do not hide it', () => {
        expect(APP_STORE_PROMPT_DISMISSED_KEY).toBe('app_store_prompt_dismissed');
        expect(APP_STORE_PROMPT_DISMISSED_KEY).not.toBe('pwa_install_modal_dismissed');
    });
});
