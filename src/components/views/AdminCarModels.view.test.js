import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminCarModels.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminCarModels view', () => {
    it('loads models for the route brand and supports create/delete', () => {
        expect(viewSource).toContain('brandId');
        expect(viewSource).toContain('fetchModels');
        expect(viewSource).toContain('createModel');
        expect(viewSource).toContain('deleteModel');
        expect(viewSource).toContain("$t('modelo')");
    });

    it('uses AppInput and AppButton for create and delete actions', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="form\.name"[\s\S]*?modelo/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?removeModel/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
