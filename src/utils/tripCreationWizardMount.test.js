import { describe, expect, it } from 'vitest';
import { STEP } from './tripCreationSteps.js';
import {
    getTripCreationWizardMountState,
    isTripCreationStepCompleted
} from './tripCreationWizardMount.js';

describe('getTripCreationWizardMountState', () => {
    it('starts a fresh create at step 1 and ignores stale route steps', () => {
        expect(getTripCreationWizardMountState({})).toEqual({
            shouldRestoreDraft: false,
            currentStep: STEP.ROLE,
            maxVisitedStep: STEP.ROLE,
            ignoreRouteStep: true
        });
    });

    it('resumes an in-progress draft at the draft current step', () => {
        expect(
            getTripCreationWizardMountState({
                draft: {
                    currentStep: STEP.SEATS,
                    maxVisitedStep: STEP.DESCRIPTION
                }
            })
        ).toEqual({
            shouldRestoreDraft: true,
            currentStep: STEP.SEATS,
            maxVisitedStep: STEP.DESCRIPTION,
            ignoreRouteStep: true
        });
    });

    it('keeps edit flow open through last details and allows route step', () => {
        expect(getTripCreationWizardMountState({ isEdit: true })).toEqual({
            shouldRestoreDraft: false,
            currentStep: STEP.ORIGIN,
            maxVisitedStep: STEP.LAST_DETAILS,
            ignoreRouteStep: false
        });
    });
});

describe('isTripCreationStepCompleted', () => {
    it('does not mark the current step completed on a fresh create', () => {
        expect(isTripCreationStepCompleted(STEP.ROLE, STEP.ROLE, STEP.ROLE)).toBe(
            false
        );
        expect(
            isTripCreationStepCompleted(STEP.ORIGIN, STEP.ROLE, STEP.ROLE)
        ).toBe(false);
    });

    it('marks only steps before the current one when progress matches', () => {
        expect(
            isTripCreationStepCompleted(
                STEP.ORIGIN,
                STEP.SEATS,
                STEP.SEATS
            )
        ).toBe(true);
        expect(
            isTripCreationStepCompleted(STEP.SEATS, STEP.SEATS, STEP.SEATS)
        ).toBe(false);
        expect(
            isTripCreationStepCompleted(
                STEP.DESCRIPTION,
                STEP.SEATS,
                STEP.SEATS
            )
        ).toBe(false);
    });

    it('keeps previously visited later steps completed after going back', () => {
        expect(
            isTripCreationStepCompleted(
                STEP.DESCRIPTION,
                STEP.SEATS,
                STEP.DESCRIPTION
            )
        ).toBe(true);
    });
});
