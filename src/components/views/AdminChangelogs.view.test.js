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

    it('uses AppButton for new changelog and row actions', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?admin-changelog-new/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?remove\(row\.id\)/
        );
        expect(viewSource).not.toContain('btn btn-primary');
        expect(viewSource).not.toContain('btn btn-danger');
    });
});
