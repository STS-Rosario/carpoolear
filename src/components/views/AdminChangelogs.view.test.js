import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminChangelogs.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminChangelogs view', () => {
    it('lists changelog versions with admin actions', () => {
        expect(viewSource).toContain("name: 'admin-changelog-new'");
        expect(viewSource).toContain("name: 'admin-changelog-edit'");
        expect(viewSource).toContain('changelogVersion');
    });
});
