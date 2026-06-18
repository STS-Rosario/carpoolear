import { Capacitor } from '@capacitor/core';

/**
 * Capacitor serves the WebView as https://<server.hostname> (e.g. carpoolear.com.ar).
 * Absolute URLs to that host load from the bundled asset server, not production — /img/* 404s.
 * Rewrite same-origin http(s) URLs to VITE_API_URL (www on native builds).
 */
export function resolveCapacitorBundledHostUrl(url) {
    if (!url || typeof url !== 'string' || !Capacitor.isNativePlatform()) {
        return url;
    }

    const remoteBase = import.meta.env.VITE_API_URL;
    if (!remoteBase || typeof window === 'undefined') {
        return url;
    }

    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.origin !== window.location.origin) {
            return url;
        }

        const remoteOrigin = new URL(remoteBase).origin;
        if (parsed.origin === remoteOrigin) {
            return url;
        }

        return `${remoteOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (_error) {
        return url;
    }
}
