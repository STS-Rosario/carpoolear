import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCarStepPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCarStepPanel.vue', () => {
    it('opens full cars editor via add vehicle link', () => {
        expect(componentSource).toContain("$t('tripCreationAddVehicle')");
        expect(componentSource).toContain("$emit('edit-cars')");
        expect(componentSource).not.toContain('trip-car-step-panel__editor');
        expect(componentSource).not.toContain('carCreate');
    });

    it('uses a custom car dropdown with make/model · patente labels', () => {
        expect(componentSource).toContain('formatCarDropdownLabel');
        expect(componentSource).toContain('trip-car-step-panel__dropdown');
        expect(componentSource).toContain('fa-car');
        expect(componentSource).toMatch(
            /\.trip-car-step-panel__dropdown-option\s*\{[^}]*color:\s*#22211f/s
        );
    });

    it('requires choosing a 4 or 5 seat layout with icons', () => {
        expect(componentSource).toContain("$t('tripSeatLayoutPrompt')");
        expect(componentSource).toContain("$t('tripSeatLayoutFour')");
        expect(componentSource).toContain("$t('tripSeatLayoutFive')");
        expect(componentSource).toContain('4-seats.svg');
        expect(componentSource).toContain('5-seats.svg');
        expect(componentSource).toContain('update:seatLayoutCapacity');
        expect(componentSource).toContain('seatLayoutCapacity');
    });
});
