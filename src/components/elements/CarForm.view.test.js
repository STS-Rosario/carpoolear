import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const formPath = path.resolve(__dirname, 'CarForm.vue');
const formSource = fs.readFileSync(formPath, 'utf8');

describe('CarForm DS inputs', () => {
    it('uses AppInput and AppField instead of Bootstrap form-control', () => {
        expect(formSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(formSource).toContain("import AppField from '../ui/AppField.vue'");
        expect(formSource).toMatch(
            /<AppInput[\s\S]*?:label="\$t\('patente'\)"[\s\S]*?entry\.patente/
        );
        expect(formSource).toMatch(
            /<AppField[\s\S]*?:label="\$t\('marca'\)"[\s\S]*?CatalogCombobox/
        );
        expect(formSource).toMatch(
            /<AppField[\s\S]*?:label="\$t\('modelo'\)"[\s\S]*?CatalogCombobox/
        );
        expect(formSource).toMatch(
            /<AppInput[\s\S]*?:label="\$t\('anio'\)"[\s\S]*?entry\.year/
        );
        expect(formSource).toMatch(
            /<AppField[\s\S]*?:label="\$t\('color'\)"[\s\S]*?<select[\s\S]*?entry\.car_color_id/
        );
        expect(formSource).not.toContain('form-control');
        expect(formSource).not.toContain('form-group');
    });

    it('supports disabling the patente field for complete-car modal', () => {
        expect(formSource).toContain('patenteDisabled');
        expect(formSource).toMatch(
            /<AppInput[\s\S]*?patente[\s\S]*?:disabled="patenteDisabled"/
        );
    });
});
