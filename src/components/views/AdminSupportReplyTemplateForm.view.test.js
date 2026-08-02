import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportReplyTemplateForm.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportReplyTemplateForm view', () => {
    it('uses AppInput fields and primary AppButton for save', () => {
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(source).toMatch(
            /<AppInput[\s\S]*?v-model="form\.name"[\s\S]*?nombrePlantilla/
        );
        expect(source).toMatch(
            /<AppInput[\s\S]*?v-model="form\.short_description"[\s\S]*?descripcionCortaPlantilla/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?save[\s\S]*?guardarPlantilla/
        );
        expect(source).not.toContain('form-control');
        expect(source).not.toContain('btn btn-primary');
    });
});
