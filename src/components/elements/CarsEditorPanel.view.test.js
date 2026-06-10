import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(__dirname, 'CarsEditorPanel.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('CarsEditorPanel', () => {
    it('provides shared cars CRUD for profile and create trip flows', () => {
        expect(source).toContain('carIndex');
        expect(source).toContain('openEditCar');
        expect(source).toContain('openAddCar');
        expect(source).toContain('deleteCar');
        expect(source).toContain('CarForm');
    });

    it('reloads cars when panel becomes active', () => {
        expect(source).toContain('active');
        expect(source).toMatch(/watch:\s*\{[\s\S]*active/s);
    });

    it('lists cars with add, edit and delete actions', () => {
        expect(source).toContain("$t('agregarAuto')");
        expect(source).toContain("$t('editarAuto')");
        expect(source).toContain('carDisplayLabel');
        expect(source).toContain('btn-danger');
        expect(source).toContain('fa-pencil');
        expect(source).toContain('fa-trash-o');
        expect(source).toContain('fa-plus');
    });

    it('requires complete marca, modelo, año and color before saving', () => {
        expect(source).toContain('isCarFormComplete');
        expect(source).toContain('carFormMissingFieldKeys');
        expect(source).toContain('autosDatosIncompletos');
    });

    it('prompts user to complete each incomplete saved car when enabled', () => {
        expect(source).toContain('promptIncompleteOnLoad');
        expect(source).toContain('carsNeedingCompletion');
        expect(source).toContain('autosCompletarPendientes');
    });
});
