/**
 * Compare Android versionCode (integer).
 * Returns: -1 if current < minimum, 0 if equal, 1 if current > minimum
 */
export function compareAndroidVersion(currentVersionCode, minVersionAndroid) {
    const current = parseInt(currentVersionCode, 10) || 0;
    const min = parseInt(minVersionAndroid, 10) || 0;
    if (current < min) return -1;
    if (current > min) return 1;
    return 0;
}

/**
 * Compare iOS semantic versions (CFBundleShortVersionString, e.g. "1.2.3").
 * Returns: -1 if current < minimum, 0 if equal, 1 if current > minimum
 */
export function compareSemver(current, minimum) {
    const currParts = parseVersionParts(current);
    const minParts = parseVersionParts(minimum);

    for (let i = 0; i < Math.max(currParts.length, minParts.length); i += 1) {
        const c = currParts[i] || 0;
        const m = minParts[i] || 0;
        if (c < m) return -1;
        if (c > m) return 1;
    }
    return 0;
}

/**
 * Parse semver string into array of integers (e.g. "1.2.3" -> [1, 2, 3])
 */
function parseVersionParts(version) {
    if (!version || typeof version !== 'string') return [0];
    return version.split('.').map((p) => parseInt(p, 10) || 0);
}
