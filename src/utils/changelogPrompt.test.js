import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    changelogSeenStorageKey,
    isChangelogSeenForVersion,
    markChangelogSeenForVersion,
    shouldShowChangelogModal
} from './changelogPrompt.js';

describe('changelogSeenStorageKey', () => {
    it('scopes dismissal to the semver version', () => {
        expect(changelogSeenStorageKey('3.2.3')).toBe('carpoolear_changelog_seen_3.2.3');
    });
});

describe('changelog once-per-version', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('shows modal when version has not been dismissed', () => {
        expect(shouldShowChangelogModal('3.2.3')).toBe(true);
        expect(isChangelogSeenForVersion('3.2.3')).toBe(false);
    });

    it('hides modal after marking version as seen', () => {
        markChangelogSeenForVersion('3.2.3');
        expect(isChangelogSeenForVersion('3.2.3')).toBe(true);
        expect(shouldShowChangelogModal('3.2.3')).toBe(false);
    });

    it('shows modal again for a different version', () => {
        markChangelogSeenForVersion('3.2.3');
        expect(shouldShowChangelogModal('3.2.4')).toBe(true);
    });

    it('does not show when version is missing', () => {
        expect(shouldShowChangelogModal('')).toBe(false);
        expect(shouldShowChangelogModal(null)).toBe(false);
    });
});
