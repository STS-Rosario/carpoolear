import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'ProfileCars.vue');
const panelPath = path.join(__dirname, '../elements/CarsEditorPanel.vue');
const formPath = path.join(__dirname, '../elements/CarForm.vue');

describe('ProfileCars CRUD section', () => {
    it('defines profile cars view and car form components', () => {
        expect(fs.existsSync(viewPath)).toBe(true);
        expect(fs.existsSync(panelPath)).toBe(true);
        expect(fs.existsSync(formPath)).toBe(true);
    });

    it('delegates cars CRUD to shared CarsEditorPanel', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('CarsEditorPanel');
        expect(viewSource).not.toContain('CarForm');
        expect(viewSource).toContain(':prompt-incomplete-on-load="true"');
    });

    it('shows autos heading on profile settings page', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain("$t('autos')");
    });

    it('uses readable text colors and mobile-only page heading', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('visible-xs-block');
        expect(viewSource).toContain('color: #036686');
        expect(viewSource).toContain('var(--main-font-color');
    });
});

describe('CarForm fields', () => {
    it('includes patente, marca, modelo, año and color inputs', () => {
        const formSource = fs.readFileSync(formPath, 'utf8');

        expect(formSource).toContain('CatalogCombobox');
        expect(formSource).toContain('entry.patente');
        expect(formSource).toContain('entry.year');
        expect(formSource).toContain('entry.car_color_id');
        expect(formSource).toContain("$t('patente')");
        expect(formSource).toContain("$t('marca')");
        expect(formSource).toContain("$t('modelo')");
        expect(formSource).toContain("$t('anio')");
        expect(formSource).toContain("$t('color')");
    });
});
