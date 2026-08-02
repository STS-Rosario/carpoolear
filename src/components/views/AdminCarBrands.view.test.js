import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminCarBrands.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminCarBrands view', () => {
    it('lists brands with link to models and Argautos sync controls', () => {
        expect(viewSource).toContain("name: 'admin-car-models'");
        expect(viewSource).toContain("$t('adminCarCatalogSyncNow')");
        expect(viewSource).toContain(':disabled="syncRunning"');
        expect(viewSource).toContain('syncNow');
        expect(viewSource).toContain('triggerSync');
        expect(viewSource).toContain('fetchSyncStatus');
    });

    it('uses AppInput and AppButton for sync, create brand, and model link', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="form\.name"[\s\S]*?marca/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?syncNow/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
