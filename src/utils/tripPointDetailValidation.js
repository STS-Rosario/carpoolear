export function shouldShowTripPointDetailInputs(points) {
    if (!Array.isArray(points) || points.length < 2) {
        return false;
    }

    const origin = points[0];
    const destination = points[points.length - 1];

    return Boolean(origin?.json && destination?.json);
}

export function isTripPointDetailEmpty(value) {
    return !value || !String(value).trim();
}

export function validateTripPointDetails({ puntoPartida, puntoLlegada, t }) {
    const errors = {};

    if (isTripPointDetailEmpty(puntoPartida)) {
        errors.puntoPartida = t('puntoPartidaRequerido');
    }

    if (isTripPointDetailEmpty(puntoLlegada)) {
        errors.puntoLlegada = t('puntoLlegadaRequerido');
    }

    return errors;
}

export function applyTripPointDetailValidation({
    puntoPartida,
    puntoLlegada,
    t,
    puntoPartidaError,
    puntoLlegadaError
}) {
    const errors = validateTripPointDetails({ puntoPartida, puntoLlegada, t });
    let hasError = false;

    if (errors.puntoPartida) {
        puntoPartidaError.state = true;
        puntoPartidaError.message = errors.puntoPartida;
        hasError = true;
    } else {
        puntoPartidaError.state = false;
    }

    if (errors.puntoLlegada) {
        puntoLlegadaError.state = true;
        puntoLlegadaError.message = errors.puntoLlegada;
        hasError = true;
    } else {
        puntoLlegadaError.state = false;
    }

    return hasError;
}
