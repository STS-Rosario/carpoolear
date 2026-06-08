import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');

describe('App changelog integration', () => {
    it('mounts the changelog modal with splash suppression', () => {
        expect(appSource).toContain('ChangelogModal');
        expect(appSource).toContain(':suppress="changelogModalSuppress"');
    });
});
