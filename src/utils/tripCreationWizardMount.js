import { STEP } from './tripCreationSteps.js';

/**
 * Initial wizard position for create vs edit vs in-progress draft.
 * Fresh create (and deep links like ?step=9 without resumeDraft) always start at
 * step 1 and ignore a stale step query. Drafts resume only when Continuar sets
 * resumeDraft=1, so an abandoned local draft cannot open Detalles by URL alone.
 */
export function getTripCreationWizardMountState({
    isEdit = false,
    draft = null,
    resumeDraft = false
} = {}) {
    if (isEdit) {
        return {
            shouldRestoreDraft: false,
            currentStep: STEP.ORIGIN,
            maxVisitedStep: STEP.LAST_DETAILS,
            ignoreRouteStep: false,
            allowDraftPersist: false
        };
    }

    if (resumeDraft && draft) {
        const currentStep = Number(draft.currentStep) || STEP.ROLE;
        const maxVisitedStep = Math.max(
            Number(draft.maxVisitedStep) || currentStep,
            currentStep
        );
        return {
            shouldRestoreDraft: true,
            currentStep,
            maxVisitedStep,
            ignoreRouteStep: true,
            allowDraftPersist: true
        };
    }

    return {
        shouldRestoreDraft: false,
        currentStep: STEP.ROLE,
        maxVisitedStep: STEP.ROLE,
        ignoreRouteStep: true,
        // Keep an existing draft for Continuar; do not overwrite it from a fresh session
        allowDraftPersist: !draft
    };
}

/**
 * Stepper bars: green only for finished steps (visited and not current).
 * The current step uses the active style separately and stays neutral grey until finished.
 */
export function isTripCreationStepCompleted(step, currentStep, maxVisitedStep) {
    return step <= maxVisitedStep && step !== currentStep;
}
