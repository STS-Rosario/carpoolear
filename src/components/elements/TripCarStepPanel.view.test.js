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

    it('uses regular label color and underlined bold editar autos link', () => {
        expect(componentSource).toMatch(
            /\.trip-car-step-panel__label\s*\{[^}]*color:\s*var\(--ds-(?:input-label|text-primary)/
        );
        expect(componentSource).toMatch(
            /\.trip-car-step-panel__edit-link\s*\{[^}]*font-weight:\s*(?:700|bold|var\(--ds-font-weight-bold)/
        );
        expect(componentSource).toMatch(
            /\.trip-car-step-panel__edit-link\s*\{[^}]*text-decoration:\s*underline/
        );
    });
});
