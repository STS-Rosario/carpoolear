import dayjs from '../dayjs';
import { activeCarsWithPlate, resolveTripCarId } from './userCars.js';

export const STEP = {
    ORIGIN: 1,
    DESTINATION: 2,
    SCHEDULE: 3,
    CAR: 4,
    SEATS: 5,
    DESCRIPTION: 6,
    LAST_DETAILS: 7
};

const DRIVER_STEPS = [
    STEP.ORIGIN,
    STEP.DESTINATION,
    STEP.SCHEDULE,
    STEP.CAR,
    STEP.SEATS,
    STEP.DESCRIPTION,
    STEP.LAST_DETAILS
];

const PASSENGER_STEPS = [
    STEP.ORIGIN,
    STEP.DESTINATION,
    STEP.SCHEDULE,
    STEP.SEATS,
    STEP.DESCRIPTION,
    STEP.LAST_DETAILS
];

export function getVisibleSteps(isPassenger) {
    return isPassenger ? [...PASSENGER_STEPS] : [...DRIVER_STEPS];
}

export function isCarStep(step) {
    return step === STEP.CAR;
}

export function isStepDisabledForPassenger(step, isPassenger) {
    return isPassenger && step === STEP.CAR;
}

export function getNextStep(currentStep, isPassenger) {
    const steps = getVisibleSteps(isPassenger);
    const index = steps.indexOf(currentStep);
    if (index === -1 || index >= steps.length - 1) {
        return null;
    }
    return steps[index + 1];
}

export function getPreviousStep(currentStep, isPassenger) {
    const steps = getVisibleSteps(isPassenger);
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
        case STEP.ORIGIN:
            return validateOrigin(context);
        case STEP.DESTINATION:
            return validateDestination(context);
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
