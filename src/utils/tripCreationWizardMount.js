import { STEP } from './tripCreationSteps.js';

/**
 * Initial wizard position for create vs edit vs in-progress draft.
 * Fresh create always starts at step 1 and must ignore a stale step query.
 * An existing draft resumes at the draft's current step (last place the user left off).
 */
export function getTripCreationWizardMountState({
    isEdit = false,
    draft = null
} = {}) {
    if (isEdit) {
        return {
            shouldRestoreDraft: false,
            currentStep: STEP.ORIGIN,
            maxVisitedStep: STEP.LAST_DETAILS,
            ignoreRouteStep: false
        };
    }

    if (draft) {
        const currentStep = Number(draft.currentStep) || STEP.ROLE;
        const maxVisitedStep = Math.max(
            Number(draft.maxVisitedStep) || currentStep,
            currentStep
        );
        return {
            shouldRestoreDraft: true,
            currentStep,
            maxVisitedStep,
            ignoreRouteStep: true
        };
    }

    return {
        shouldRestoreDraft: false,
        currentStep: STEP.ROLE,
        maxVisitedStep: STEP.ROLE,
        ignoreRouteStep: true
    };
}

/**
 * Stepper bars: green for finished steps only (visited and not the current one).
 * The current step uses the active style separately.
 */
export function isTripCreationStepCompleted(step, currentStep, maxVisitedStep) {
    return step <= maxVisitedStep && step !== currentStep;
}
