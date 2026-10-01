import { Capacitor } from '@capacitor/core';
import { resolveCapacitorBundledHostUrl } from './capacitorRemoteUrl.js';

/**
 * URL to use for a link that must leave the app (server-only pages like /aportar, the
 * website, third-party sites).
 *
 * On native the WebView is served from server.hostname (carpoolear.com.ar): https:// on
 * Android, capacitor:// on iOS. Relative paths and app-host URLs would load the bundled
 * index.html (app reload) instead of the website. Point them at the remote site so
 * Capacitor hands them to the system browser. Web keeps the URL unchanged.
 */
export function resolveExternalUrl(url) {
    if (!url || typeof url !== 'string' || !Capacitor.isNativePlatform()) {
        return url;
    }
    const isRootRelative = url.startsWith('/') && !url.startsWith('//');
    const absoluteUrl = isRootRelative
        ? `https://${window.location.host}${url}`
        : url;
    return resolveCapacitorBundledHostUrl(absoluteUrl);
}
