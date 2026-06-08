export function getChangelogAppVersion(appVersionInfo, fallbackVersion) {
    if (appVersionInfo) {
        if (appVersionInfo.versionName) {
            return String(appVersionInfo.versionName);
        }
        if (appVersionInfo.version) {
            return String(appVersionInfo.version);
        }
    }
    if (fallbackVersion) {
        return String(fallbackVersion);
    }
    return '';
}
