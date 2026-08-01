import dayjs from '../dayjs';
import { activeCarsWithPlate, resolveTripCarId } from './userCars.js';
import { getIntermediatePoints } from './tripCreationPoints.js';

export const STEP = {
    ROLE: 1,
    ORIGIN: 2,
    DESTINATION: 3,
    STOPS: 4,
    SCHEDULE: 5,
    CAR: 6,
    SEATS: 7,
    DESCRIPTION: 8,
    LAST_DETAILS: 9
};

export const ALL_WIZARD_STEPS = [
    STEP.ROLE,
    STEP.ORIGIN,
    STEP.DESTINATION,
    STEP.STOPS,
    STEP.SCHEDULE,
    STEP.CAR,
    STEP.SEATS,
    STEP.DESCRIPTION,
    STEP.LAST_DETAILS
];

const DRIVER_STEPS = ALL_WIZARD_STEPS;

const PASSENGER_STEPS = [
    STEP.ROLE,
    STEP.ORIGIN,
    STEP.DESTINATION,
    STEP.STOPS,
    STEP.SCHEDULE,
    STEP.SEATS,
    STEP.DESCRIPTION,
    STEP.LAST_DETAILS
];

const STEP_LABEL_KEYS = {
    [STEP.ROLE]: 'tripCreationStepLabelRole',
    [STEP.ORIGIN]: 'tripCreationStepLabelOrigin',
    [STEP.DESTINATION]: 'tripCreationStepLabelDestination',
    [STEP.STOPS]: 'tripCreationStepLabelStops',
    [STEP.SCHEDULE]: 'tripCreationStepLabelSchedule',
    [STEP.CAR]: 'tripCreationStepLabelCar',
    [STEP.SEATS]: 'tripCreationStepLabelSeats',
    [STEP.DESCRIPTION]: 'tripCreationStepLabelDescription',
    [STEP.LAST_DETAILS]: 'tripCreationStepLabelLastDetails'
};

export function getTripCreationStepLabelKey(step) {
    return STEP_LABEL_KEYS[step] || '';
}

export function getVisibleSteps(isPassenger) {
    return isPassenger ? [...PASSENGER_STEPS] : [...DRIVER_STEPS];
}

export function isCarStep(step) {
    return step === STEP.CAR;
}

export function isStepDisabledForPassenger(step, isPassenger) {
    return isPassenger && step === STEP.CAR;
}

function getNavigationOptions(options = {}) {
    return {
        wantsIntermediateStops: Boolean(options.wantsIntermediateStops)
    };
}

function getLinearSteps(isPassenger, options = {}) {
    const { wantsIntermediateStops } = getNavigationOptions(options);
    const steps = getVisibleSteps(isPassenger);

    if (!wantsIntermediateStops) {
        return steps.filter((step) => step !== STEP.STOPS);
    }

    return steps;
}

export function getNextStep(currentStep, isPassenger, options = {}) {
    const steps = getLinearSteps(isPassenger, options);
    const index = steps.indexOf(currentStep);
    if (index === -1 || index >= steps.length - 1) {
        return null;
    }
    return steps[index + 1];
}

export function getPreviousStep(currentStep, isPassenger, options = {}) {
    const steps = getLinearSteps(isPassenger, options);
    const index = steps.indexOf(currentStep);
    if (index <= 0) {
        return null;
    }
    return steps[index - 1];
}

export function canNavigateToStep(targetStep, maxVisitedStep, isPassenger) {
    if (isStepDisabledForPassenger(targetStep, isPassenger)) {
        return false;
    }

    if (
        targetStep === STEP.STOPS &&
        maxVisitedStep >= STEP.DESTINATION
    ) {
        return true;
    }

    return targetStep <= maxVisitedStep;
}

function lastPoint(points) {
    if (!Array.isArray(points) || points.length === 0) {
        return null;
    }
    return points[points.length - 1];
}

export function validateStep(step, context = {}) {
    switch (step) {
    case STEP.ROLE:
        return { valid: true, errors: {} };
    case STEP.ORIGIN:
        return validateOrigin(context);
    case STEP.DESTINATION:
        return validateDestination(context);
    case STEP.STOPS:
        return validateStops(context);
    case STEP.SCHEDULE:
        return validateSchedule(context);
    case STEP.CAR:
        return validateCar(context);
    case STEP.SEATS:
        return validateSeats(context);
    case STEP.DESCRIPTION:
        return validateDescription(context);
    case STEP.LAST_DETAILS:
        return validateLastDetails(context);
    default:
        return { valid: true, errors: {} };
    }
}

function validateOrigin({ points = [] }) {
    const origin = points[0];
    const valid = Boolean(origin && origin.json);
    return {
        valid,
        errors: valid ? {} : { origin: 'localidadValida' }
    };
}

function validateDestination({ points = [] }) {
    const destination = lastPoint(points);
    if (!destination || !destination.json) {
        return { valid: false, errors: { destination: 'localidadValida' } };
    }

    const origin = points[0];
    if (origin && origin.json && origin.name === destination.name) {
        return { valid: false, errors: { destination: 'origenDestinoDistintos' } };
    }

    return { valid: true, errors: {} };
}

function validateStops({ points = [] }) {
    const intermediates = getIntermediatePoints(points);
    const invalid = intermediates.find(
        (point) => point.name && !point.json
    );

    return {
        valid: !invalid,
        errors: invalid ? { stops: 'localidadValida' } : {}
    };
}

function validateSchedule({
    useWeeklySchedule = false,
    weeklySchedule = 0,
    weeklyScheduleTime = '',
    dateAnswer = '',
    time = ''
}) {
    if (useWeeklySchedule) {
        const hasDays = Number(weeklySchedule) > 0;
        const hasTime = weeklyScheduleTime && dayjs(weeklyScheduleTime, 'HH:mm').isValid();
        const valid = hasDays && hasTime;
        return {
            valid,
            errors: valid
                ? {}
                : {
                    schedule: hasDays ? 'noHorarioValido' : 'faltaFechaOProgramaSemanal'
                }
        };
    }

    const hasDate = dateAnswer && dayjs(dateAnswer).isValid();
    const hasTime = time && dayjs(time, 'HH:mm').isValid();
    if (!hasDate || !hasTime) {
        return {
            valid: false,
            errors: {
                schedule: !hasDate ? 'faltaFecha' : 'noHorarioValido'
            }
        };
    }

    if (dayjs(dateAnswer).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
        if (dayjs(time, 'HH:mm').format('HH:mm') < dayjs().format('HH:mm')) {
            return { valid: false, errors: { schedule: 'viajesPasado' } };
        }
    }

    return { valid: true, errors: {} };
}

function validateCar({ isPassenger = false, cars = [], selectedCarId = null }) {
    if (isPassenger) {
        return { valid: true, errors: {} };
    }

    const withPlate = activeCarsWithPlate(cars);
    if (withPlate.length === 0) {
        return { valid: false, errors: { car: 'olvidastePatente' } };
    }

    const resolved = resolveTripCarId(cars, selectedCarId);
    return {
        valid: resolved != null && resolved !== undefined,
        errors: resolved != null && resolved !== undefined ? {} : { car: 'elegiPatente' }
    };
}

function validateSeats({ totalSeats = 0, passengers = 0 }) {
    if (Number(totalSeats) < 1) {
        return { valid: false, errors: { seats: 'lugaresDisponibles' } };
    }

    if (Number(totalSeats) < Number(passengers)) {
        return { valid: false, errors: { seats: 'pasajerosSubidos' } };
    }

    return { valid: true, errors: {} };
}

function validateDescription({ description = '' }) {
    const valid = String(description).trim().length > 0;
    return {
        valid,
        errors: valid ? {} : { description: 'olvidasteDescripcion' }
    };
}

function validateLastDetails({ isPassenger = false, noLucrar = false }) {
    if (isPassenger) {
        return { valid: true, errors: {} };
    }

    const valid = Boolean(noLucrar);
    return {
        valid,
        errors: valid ? {} : { lastDetails: 'teComprometesANoLucrar' }
    };
}
