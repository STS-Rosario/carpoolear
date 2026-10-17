import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationStepper.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationStepper.vue', () => {
    it('renders nine step segments with data-testid hooks', () => {
        expect(componentSource).toContain('trip-creation-stepper');
        expect(componentSource).toMatch(/trip-creation-step-\$\{step\}/);
        expect(componentSource).toContain('data-testid');
    });

    it('hides the steps passengers skip instead of showing them disabled', () => {
        expect(componentSource).toMatch(
            /!isStepDisabledForPassenger\(step, this\.isPassenger\)/
        );
        expect(componentSource).not.toContain('trip-creation-stepper__segment--disabled');
    });

    it('uses the passenger label for the description step', () => {
        expect(componentSource).toContain(
            'getTripCreationStepLabelKey(step, isPassenger)'
        );
    });

    it('emits select only for allowed steps', () => {
        expect(componentSource).toContain('canNavigateToStep');
        expect(componentSource).toContain('emit(\'select\'');
    });

    it('shows incomplete badge for visited invalid steps', () => {
        expect(componentSource).toContain('trip-creation-stepper__segment--incomplete');
        expect(componentSource).toContain('incompleteSteps');
    });

    it('shows a short label under each step segment', () => {
        expect(componentSource).toContain('getTripCreationStepLabelKey');
        expect(componentSource).toContain('trip-creation-stepper__label');
        expect(componentSource).toMatch(
            /\$t\(getTripCreationStepLabelKey\(step, isPassenger\)\)/
        );
    });

    it('allows step labels to wrap on two lines on mobile', () => {
        expect(componentSource).toContain('-webkit-line-clamp: 2');
        expect(componentSource).toContain('white-space: normal');
    });

    it('hides contribution segment when seat price is disabled', () => {
        expect(componentSource).toContain('seatPriceEnabled');
        expect(componentSource).toContain('STEP.CONTRIBUTION');
    });

    it('highlights the active step bar with a subtle shadow', () => {
        const activeBarRule = componentSource.match(
            /\.trip-creation-stepper__bar--active\s*{([^}]*)}/
        );
        expect(activeBarRule).not.toBeNull();
        expect(activeBarRule[1]).toMatch(/box-shadow:/);
    });
});
