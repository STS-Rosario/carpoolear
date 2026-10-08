import {
    ALL_WIZARD_STEPS,
    getVisibleSteps,
    isStepDisabledForPassenger,
    STEP
} from './tripCreationSteps.js';

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
        // Land on the nearest step a passenger can actually see, in order:
        // car/seats/contribution/description are all skipped for them, so a
        // deep link into any of those resolves forward to whatever comes
        // next (falling back to the last visible step if none does).
        const visibleSteps = getVisibleSteps(isPassenger);
        const fallbackStep = visibleSteps.find(
            (visibleStep) => visibleStep > step
        );
        return fallbackStep != null
            ? fallbackStep
            : visibleSteps[visibleSteps.length - 1];
    }

    return step;
}
