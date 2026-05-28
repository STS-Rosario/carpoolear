const ALLOWED_HOSTS = new Set([
    'facebook.com',
    'www.facebook.com',
    'm.facebook.com',
    'mbasic.facebook.com'
]);

/**
 * @param {string|null|undefined} value
 * @returns {string|null} Canonical https://facebook.com/... URL, or null when empty/invalid
 */
export function normalizeFacebookProfileUrl(value) {
    if (value === null || value === undefined) {
        return null;
    }

    const trimmed = String(value).trim();
    if (!trimmed) {
        return null;
    }

    let withScheme = trimmed;
    if (!/^https?:\/\//i.test(withScheme)) {
        withScheme = `https://${withScheme.replace(/^\/+/, '')}`;
    }

    let parsed;
    try {
        parsed = new URL(withScheme);
    } catch {
        return null;
    }

    const host = parsed.hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) {
        return null;
    }

    const path = parsed.pathname || '/';
    const query = parsed.search || '';
    const hash = parsed.hash || '';

    return `https://facebook.com${path === '' ? '/' : path}${query}${hash}`;
}

/**
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
export function isValidFacebookProfileUrl(value) {
    if (value === null || value === undefined || String(value).trim() === '') {
        return true;
    }

    return normalizeFacebookProfileUrl(value) !== null;
}
