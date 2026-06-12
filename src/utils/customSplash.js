export const CUSTOM_SPLASH_DISMISS_MS = 3000;

export function isAdminAppUrl(location) {
    if (!location) {
        return false;
    }

    const path = location.path || location.pathname || '';
    const hash = location.hash || '';
    const fullPath = location.fullPath || '';

    return (
        path.includes('/admin') ||
        hash.includes('/admin') ||
        fullPath.includes('/admin')
    );
}

export function isCustomSplashVisible({ location, showCustomSplash }) {
    if (isAdminAppUrl(location)) {
        return false;
    }

    return Boolean(showCustomSplash);
}

export function getRemainingSplashMs(
    now,
    startedAt,
    dismissMs = CUSTOM_SPLASH_DISMISS_MS
) {
    if (startedAt == null) {
        return 0;
    }

    return Math.max(0, dismissMs - (now - startedAt));
}

export function hideBootstrapSplash(doc = typeof document !== 'undefined' ? document : null) {
    if (!doc) {
        return;
    }

    const bootstrapSplash = doc.getElementById('bootstrap-splash');
    if (bootstrapSplash) {
        bootstrapSplash.remove();
    }
}

export function initBootstrapSplash({
    location = typeof window !== 'undefined' ? window.location : null,
    doc = typeof document !== 'undefined' ? document : null,
    now = typeof performance !== 'undefined' ? performance.now() : 0,
    setStartedAt = (value) => {
        if (typeof window !== 'undefined') {
            window.__customSplashStartedAt = value;
        }
    },
    scheduleTimeout = (fn, delay) => setTimeout(fn, delay)
} = {}) {
    if (isAdminAppUrl(location)) {
        hideBootstrapSplash(doc);
        setStartedAt(null);
        return { skipped: true, startedAt: null };
    }

    const startedAt = now;
    setStartedAt(startedAt);

    scheduleTimeout(() => {
        hideBootstrapSplash(doc);
    }, getRemainingSplashMs(now, startedAt));

    return { skipped: false, startedAt };
}
