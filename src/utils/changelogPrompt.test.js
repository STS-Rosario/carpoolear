import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    changelogSeenStorageKey,
    isChangelogSeenForVersion,
    markChangelogSeenForVersion,
    shouldShowChangelogModal
} from './changelogPrompt.js';

function createLocalStorageMock() {
    const store = new Map();
    return {
        getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
        setItem: vi.fn((key, value) => {
            store.set(key, String(value));
        }),
        removeItem: vi.fn((key) => {
            store.delete(key);
        }),
        clear: vi.fn(() => {
            store.clear();
        })
    };
}

describe('changelogSeenStorageKey', () => {
    it('scopes dismissal to the semver version', () => {
        expect(changelogSeenStorageKey('3.2.3')).toBe('carpoolear_changelog_seen_3.2.3');
    });
});

describe('changelog once-per-version', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createLocalStorageMock());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
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
