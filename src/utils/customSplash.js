export const CUSTOM_SPLASH_DISMISS_MS = 3000;
export const SPLASH_WEB_BUILD_NUMBER = 125;

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
