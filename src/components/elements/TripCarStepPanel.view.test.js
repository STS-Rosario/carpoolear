import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCarStepPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCarStepPanel.vue', () => {
    it('opens full cars editor via editar autos instead of inline patente fields', () => {
        expect(componentSource).toContain("$t('editarAutosEnViaje')");
        expect(componentSource).toContain("$emit('edit-cars')");
        expect(componentSource).not.toContain('trip-car-step-panel__editor');
        expect(componentSource).not.toContain('carCreate');
    });

    it('shows catalog-aware labels in the car select', () => {
        expect(componentSource).toContain('formatCarSelectLabel');
    });
});
