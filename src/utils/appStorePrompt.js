export const GOOGLE_PLAY_URL =
    'https://play.google.com/store/apps/details?id=com.sts.carpoolear&hl=es_419';
export const APP_STORE_URL = 'https://apps.apple.com/ar/app/carpoolear/id1045211385';
export const APP_STORE_PROMPT_DISMISSED_KEY = 'app_store_prompt_dismissed';

const GOOGLE_PLAY_BADGE = { store: 'google-play', url: GOOGLE_PLAY_URL };
const APP_STORE_BADGE = { store: 'app-store', url: APP_STORE_URL };

const BADGES_BY_PLATFORM = {
    ios: [APP_STORE_BADGE],
    android: [GOOGLE_PLAY_BADGE],
    other: [GOOGLE_PLAY_BADGE, APP_STORE_BADGE]
};

/**
 * 'ios' | 'android' | 'other' (unrecognised mobile) | null (desktop).
 * iPadOS Safari reports itself as Mac; a touch-capable Mac is treated as iOS.
 */
export function detectMobilePlatform({ userAgent = '', maxTouchPoints = 0 } = {}) {
    const ua = String(userAgent || '').toLowerCase();
    if (/iphone|ipad|ipod/.test(ua) || (/macintosh/.test(ua) && maxTouchPoints > 1)) {
        return 'ios';
    }
    if (/windows phone|iemobile/.test(ua)) {
        return 'other';
    }
    if (/android/.test(ua)) {
        return 'android';
    }
    if (/mobi|tablet|opera mini|blackberry|webos|kaios/.test(ua)) {
        return 'other';
    }
    return null;
}

/**
 * Which store badges to show in the "download the app" prompt, or null when it must not
 * show (native app, desktop, or dismissed permanently).
 */
export function getAppStorePrompt({
    userAgent = '',
    maxTouchPoints = 0,
    isNativePlatform = false,
    dismissed = false
} = {}) {
    if (isNativePlatform || dismissed) {
        return null;
    }
    const platform = detectMobilePlatform({ userAgent, maxTouchPoints });
    if (!platform) {
        return null;
    }
    return { platform, badges: BADGES_BY_PLATFORM[platform] };
}
