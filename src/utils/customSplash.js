export const CUSTOM_SPLASH_DISMISS_MS = 3000;
export const SPLASH_WEB_BUILD_NUMBER = 116;
export const BOOTSTRAP_SPLASH_VERSION_ID = 'bootstrap-splash-version';

export function formatSplashVersionText({
    version,
    isNativePlatform = false,
    webBuildNumber = SPLASH_WEB_BUILD_NUMBER
}) {
    const resolvedVersion =
        version != null && String(version) !== '' ? String(version) : '0';
    const base = `Version ${resolvedVersion}`;

    return isNativePlatform ? base : `${base} - build ${webBuildNumber}`;
}

export function resolveSplashVersion({ appVersionInfo, windowAppVersion }) {
    if (appVersionInfo && appVersionInfo.version) {
        return String(appVersionInfo.version);
    }

    if (windowAppVersion) {
        return String(windowAppVersion);
    }

    return '0';
}

export function updateBootstrapSplashVersion(
    doc,
    { version, isNativePlatform = false, webBuildNumber = SPLASH_WEB_BUILD_NUMBER }
) {
    if (!doc) {
        return;
    }

    const versionEl = doc.getElementById(BOOTSTRAP_SPLASH_VERSION_ID);
    if (!versionEl) {
        return;
    }

    versionEl.textContent = formatSplashVersionText({
        version,
        isNativePlatform,
        webBuildNumber
    });
}

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
    windowAppVersion = typeof window !== 'undefined' ? window.appVersion : null,
    isNativePlatform = false,
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

    updateBootstrapSplashVersion(doc, {
        version: resolveSplashVersion({ windowAppVersion }),
        isNativePlatform
    });

    const startedAt = now;
    setStartedAt(startedAt);

    scheduleTimeout(() => {
        hideBootstrapSplash(doc);
    }, getRemainingSplashMs(now, startedAt));

    return { skipped: false, startedAt };
}
