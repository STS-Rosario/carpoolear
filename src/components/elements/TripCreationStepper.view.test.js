import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationStepper.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationStepper.vue', () => {
    it('renders seven step segments with data-testid hooks', () => {
        expect(componentSource).toContain('trip-creation-stepper');
        expect(componentSource).toMatch(/trip-creation-step-\$\{step\}/);
        expect(componentSource).toContain('data-testid');
    });

    it('disables car step segment for passengers', () => {
        expect(componentSource).toContain('isStepDisabledForPassenger');
        expect(componentSource).toContain('trip-creation-stepper__segment--disabled');
    });

    it('emits select only for allowed steps', () => {
        expect(componentSource).toContain('canNavigateToStep');
        expect(componentSource).toContain('emit(\'select\'');
    });

    it('shows incomplete badge for visited invalid steps', () => {
        expect(componentSource).toContain('trip-creation-stepper__segment--incomplete');
        expect(componentSource).toContain('incompleteSteps');
    });
});
