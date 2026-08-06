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
    {
        isPassenger = false,
        isEdit = false,
        seatPriceEnabled = true
    } = {}
) {
    const step = parseStepFromQuery(value);
    if (step == null) {
        return null;
    }

    if (isEdit && step === STEP.ROLE) {
        return STEP.ORIGIN;
    }

    if (step === STEP.CONTRIBUTION && !seatPriceEnabled) {
        return STEP.DESCRIPTION;
    }

    if (isStepDisabledForPassenger(step, isPassenger)) {
        return step === STEP.CONTRIBUTION ? STEP.DESCRIPTION : STEP.SEATS;
    }

    return step;
}
