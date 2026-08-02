import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminChangelogForm.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminChangelogForm view', () => {
    it('uses AppInput for version and AppButton primary for save', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="form\.version"[\s\S]*?changelogVersion/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?:disabled="saving"[\s\S]*?save/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
