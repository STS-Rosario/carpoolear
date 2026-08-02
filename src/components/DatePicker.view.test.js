import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'DatePicker.vue');
const appFieldCssPath = path.resolve(
    __dirname,
    '../styles/components/app-field.css'
);
const componentSource = fs.readFileSync(componentPath, 'utf8');
const appFieldCss = fs.readFileSync(appFieldCssPath, 'utf8');

describe('DatePicker.vue DS chrome', () => {
    it('uses semantic surface classes instead of Bootstrap form-control', () => {
        expect(componentSource).toContain('date-picker__surface');
        expect(componentSource).toContain('date-picker__surface--mobile');
        expect(componentSource).not.toContain('form-control');
        expect(componentSource).not.toContain('form-control-date');
        expect(componentSource).not.toContain('form-control-with-icon');
    });

    it('keeps AppField nested date styles on the semantic surface classes', () => {
        expect(appFieldCss).toContain('.app-field .date-picker .date-picker__surface');
        expect(appFieldCss).toContain(
            '.app-field .date-picker .date-picker__surface--mobile'
        );
        expect(appFieldCss).not.toContain(
            '.app-field .date-picker .form-control-date'
        );
    });
});
