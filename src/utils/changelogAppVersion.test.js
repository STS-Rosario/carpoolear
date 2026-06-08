import { describe, expect, it } from 'vitest';
import { getChangelogAppVersion } from './changelogAppVersion.js';

describe('getChangelogAppVersion', () => {
    it('prefers semver versionName over android versionCode', () => {
        expect(
            getChangelogAppVersion({
                version: '3020300',
                versionName: '3.2.3',
                platform: 'android'
            })
        ).toBe('3.2.3');
    });

    it('falls back to version when versionName is missing', () => {
        expect(getChangelogAppVersion({ version: '2.1.0', platform: 'ios' })).toBe('2.1.0');
    });

    it('falls back to window.appVersion on web', () => {
        expect(getChangelogAppVersion(null, '1.5.0')).toBe('1.5.0');
    });
});
