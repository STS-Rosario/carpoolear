import { describe, expect, it } from 'vitest';
import { resolveWizardStepperValidation } from './tripCreationStepperValidation.js';
import { STEP } from './tripCreationSteps.js';

describe('resolveWizardStepperValidation', () => {
    it('clears incomplete marks for steps that become valid after a field change', () => {
        const result = resolveWizardStepperValidation({
            incompleteSteps: [STEP.ORIGIN, STEP.DESTINATION],
            currentStep: STEP.ORIGIN,
            stepErrors: { origin: 'tripCreationOriginRequired' },
            validateStepFor: (step) => {
                if (step === STEP.ORIGIN) {
                    return { valid: true, errors: {} };
                }
                return {
                    valid: false,
                    errors: { destination: 'tripCreationDestinationRequired' }
                };
            }
        });

        expect(result.incompleteSteps).toEqual([STEP.DESTINATION]);
        expect(result.stepErrors).toEqual({});
    });

    it('does not mark a step incomplete until the user has already failed validation', () => {
        const result = resolveWizardStepperValidation({
            incompleteSteps: [],
            currentStep: STEP.ORIGIN,
            stepErrors: {},
            validateStepFor: () => ({
                valid: false,
                errors: { origin: 'tripCreationOriginRequired' }
            })
        });

        expect(result.incompleteSteps).toEqual([]);
        expect(result.stepErrors).toEqual({});
    });

    it('refreshes current-step field errors while that step is still incomplete', () => {
        const result = resolveWizardStepperValidation({
            incompleteSteps: [STEP.ORIGIN],
            currentStep: STEP.ORIGIN,
            stepErrors: {
                origin: 'tripCreationOriginRequired',
                puntoPartida: 'tripCreationPuntoPartidaRequired'
            },
            validateStepFor: () => ({
                valid: false,
                errors: { puntoPartida: 'tripCreationPuntoPartidaRequired' }
            })
        });

        expect(result.incompleteSteps).toEqual([STEP.ORIGIN]);
        expect(result.stepErrors).toEqual({
            puntoPartida: 'tripCreationPuntoPartidaRequired'
        });
    });
});
