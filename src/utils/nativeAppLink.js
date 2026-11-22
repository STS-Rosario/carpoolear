/** Web path prefix for Mercado Pago OAuth return URLs (production SPA base /app/). */
export const MP_IDENTITY_WEB_PATH_PREFIX = '/app/setting/identity-validation';

export const NATIVE_APP_LINK_HOSTS = new Set([
    'carpoolear.com.ar',
    'www.carpoolear.com.ar'
]);

/**
 * Parse an https App Link / Universal Link into a native router target (v1: MP identity only).
 *
 * @param {string} rawUrl
 * @returns {{ name: string, path: string, query: Record<string, string> } | null}
 */
export function parseNativeAppLinkUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
        return null;
    }

    let url;
    try {
        url = new URL(rawUrl);
    } catch {
        return null;
    }

    if (url.protocol !== 'https:') {
        return null;
    }

    if (!NATIVE_APP_LINK_HOSTS.has(url.hostname.toLowerCase())) {
        return null;
    }

    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    if (pathname !== MP_IDENTITY_WEB_PATH_PREFIX) {
        return null;
    }

    const query = {};
    url.searchParams.forEach((value, key) => {
        query[key] = value;
    });

    return {
        name: 'identity_validation',
        path: '/setting/identity-validation',
        query
    };
}
