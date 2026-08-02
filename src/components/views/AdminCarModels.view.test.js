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
});
