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

    it('uses AppButton primary add, secondary edit, and danger delete', () => {
        expect(source).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?icon-left="fa fa-plus"[\s\S]*?agregarAuto[\s\S]*?<\/AppButton>/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?icon-left="fa fa-pencil"[\s\S]*?editar[\s\S]*?<\/AppButton>/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?icon-left="fa fa-trash-o"[\s\S]*?accionEliminar[\s\S]*?<\/AppButton>/
        );
        expect(source).not.toContain('btn btn-primary');
        expect(source).not.toContain('btn-danger');
        expect(source).not.toContain('btn-default');
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
