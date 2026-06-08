import { describe, expect, it } from 'vitest';
import { sortChangelogsBySemverDesc } from './changelogSort.js';

describe('sortChangelogsBySemverDesc', () => {
    it('orders changelogs by semver with newest first', () => {
        const rows = [
            { id: 1, version: '1.0.0', body_markdown: 'a' },
            { id: 2, version: '2.10.0', body_markdown: 'b' },
            { id: 3, version: '2.2.0', body_markdown: 'c' },
            { id: 4, version: '10.0.0', body_markdown: 'd' }
        ];

        expect(sortChangelogsBySemverDesc(rows).map((row) => row.version)).toEqual([
            '10.0.0',
            '2.10.0',
            '2.2.0',
            '1.0.0'
        ]);
    });
});
