import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'ProfileCars.vue');
const formPath = path.join(__dirname, '../elements/CarForm.vue');

describe('ProfileCars CRUD section', () => {
    it('defines profile cars view and car form components', () => {
        expect(fs.existsSync(viewPath)).toBe(true);
        expect(fs.existsSync(formPath)).toBe(true);
    });

    it('delegates cars CRUD to shared CarsEditorPanel', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('CarsEditorPanel');
        expect(viewSource).not.toContain('CarForm');
    });

    it('lists cars with add, edit and delete actions', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain("$t('autos')");
        expect(viewSource).toContain("$t('agregarAuto')");
        expect(viewSource).toContain("$t('editarAuto')");
        expect(viewSource).toContain('carDisplayLabel');
        expect(viewSource).toContain('openEditCar');
        expect(viewSource).toContain('deleteCar');
        expect(viewSource).toContain('openAddCar');
        expect(viewSource).toContain('btn-danger');
        expect(viewSource).toContain('fa-pencil');
        expect(viewSource).toContain('fa-trash-o');
        expect(viewSource).toContain('fa-plus');
    });

    it('requires complete marca, modelo, año and color before saving', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('isCarFormComplete');
        expect(viewSource).toContain('carFormMissingFieldKeys');
        expect(viewSource).toContain('autosDatosIncompletos');
    });

    it('prompts user to complete each incomplete saved car', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('carsNeedingCompletion');
        expect(viewSource).toContain('autosCompletarPendientes');
    });

    it('uses readable text colors and mobile-only page heading', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');

        expect(viewSource).toContain('visible-xs-block');
        expect(viewSource).toContain('color: #036686');
        expect(viewSource).toContain('var(--main-font-color');
        expect(viewSource).toContain('profile-cars__label');
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
