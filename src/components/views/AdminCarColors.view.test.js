import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminCarColors.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminCarColors view', () => {
    it('supports admin hex picker and swatch preview', () => {
        expect(viewSource).toContain('type="color"');
        expect(viewSource).toContain("$t('colorHexPlaceholder')");
        expect(viewSource).toContain('admin-car-color-swatch');
        expect(viewSource).toContain(':style="{ backgroundColor: row.hex }"');
    });

    it('uses AppInput and AppButton for color fields and actions', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="form\.name"[\s\S]*?color/
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="form\.hex"[\s\S]*?colorHexPlaceholder/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?removeColor/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
    });
});
