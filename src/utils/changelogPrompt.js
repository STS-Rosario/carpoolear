const STORAGE_PREFIX = 'carpoolear_changelog_seen';

export function changelogSeenStorageKey(version) {
    return `${STORAGE_PREFIX}_${version}`;
}

export function isChangelogSeenForVersion(version) {
    if (!version || typeof localStorage === 'undefined') return false;
    return localStorage.getItem(changelogSeenStorageKey(version)) === '1';
}

export function markChangelogSeenForVersion(version) {
    if (!version || typeof localStorage === 'undefined') return;
    localStorage.setItem(changelogSeenStorageKey(version), '1');
}

export function shouldShowChangelogModal(version) {
    if (!version) return false;
    return !isChangelogSeenForVersion(version);
}
