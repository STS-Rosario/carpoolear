import { compareSemver } from './versionCompare';

export function sortChangelogsBySemverDesc(entries) {
    if (!Array.isArray(entries)) {
        return [];
    }
    return [...entries].sort((left, right) => compareSemver(right.version, left.version));
}
