import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    carFormMissingFieldKeys,
    isCarFormComplete
} from '../../utils/carFields.js';

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

    it('keeps row action buttons wide enough for icon and label', () => {
        expect(source).toContain('grid-template-columns: minmax(0, 1fr) auto');
        expect(source).toContain('min-width: max-content');
        expect(source).toContain('display: inline-flex');
    });

    it('lists cars with add, edit and delete actions', () => {
        expect(source).toContain("$t('agregarAuto')");
        expect(source).toContain("$t('editar')");
        expect(source).toContain("$t('accionEliminar')");
        expect(source).not.toContain("$t('eliminarAuto')");
        expect(source).toContain('carDisplayLabel');
        expect(source).toContain('fa-pencil');
        expect(source).toContain('fa-trash-o');
        expect(source).toContain('fa-plus');
    });

    it('requires complete marca, modelo, año and color before saving', () => {
        expect(source).toContain('isCarFormComplete');
        expect(source).toContain('carFormMissingFieldKeys');
        expect(source).toContain('autosDatosIncompletos');
    });

    it('blocks saving until fuel type and consumption are chosen', () => {
        expect(source).toMatch(
            /if \(!isCarFormComplete\(this\.formEntry\)\) \{[\s\S]*?carFormMissingFieldKeys[\s\S]*?return;/
        );
        expect(
            isCarFormComplete({
                brandSelection: 1,
                modelSelection: 2,
                car_color_id: 3,
                year: 2020
            })
        ).toBe(false);
        expect(
            carFormMissingFieldKeys({
                brandSelection: 1,
                modelSelection: 2,
                car_color_id: 3,
                year: 2020
            })
        ).toEqual(['combustible', 'consumo']);
    });

    it('prompts user to complete each incomplete saved car when enabled', () => {
        expect(source).toContain('promptIncompleteOnLoad');
        expect(source).toContain('carsNeedingCompletion');
        expect(source).toContain('autosCompletarPendientes');
    });
});
