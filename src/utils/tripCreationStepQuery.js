import { ALL_WIZARD_STEPS, isStepDisabledForPassenger, STEP } from './tripCreationSteps.js';

export const TRIP_CREATION_STEP_QUERY_PARAM = 'step';

export function formatStepQueryValue(step) {
    return String(step);
}

export function parseStepFromQuery(value) {
    if (value == null || value === '') {
        return null;
    }

    const step = Number.parseInt(String(value), 10);
    if (!Number.isInteger(step) || !ALL_WIZARD_STEPS.includes(step)) {
        return null;
    }

    return step;
}

export function resolveStepFromQuery(
    value,
    { isPassenger = false, isEdit = false } = {}
) {
    const step = parseStepFromQuery(value);
    if (step == null) {
        return null;
    }

    if (isEdit && step === STEP.ROLE) {
        return STEP.ORIGIN;
    }

    if (isStepDisabledForPassenger(step, isPassenger)) {
        return STEP.SEATS;
    }

    return step;
}
