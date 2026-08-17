import { checkError } from '../../utils/helpers.js';
import { getApiErrorMessage, isOfflineApiError } from './apiErrors.js';
import { logGenericApiErrorForDebug } from './clientErrorReporting.js';
import { isServerUnavailableApiError } from './serverErrors.js';

export const INCOMPLETE_PROFILE_UPDATE_ROUTE = {
    name: 'profile_update',
    query: { incompleteProfile: 'true' }
};

function hasTripFieldError(error, field) {
    if (!error || error.status !== 422) {
        return false;
    }

    const fieldErrors = error.data?.errors?.[field];
    if (Array.isArray(fieldErrors)) {
        return fieldErrors.length > 0;
    }

    return typeof fieldErrors === 'string' && fieldErrors.trim().length > 0;
}

export function isProfileRequiredTripError(error) {
    return hasTripFieldError(error, 'profile_required');
}

export function redirectToIncompleteProfileForTripCreate(router) {
    router.replace(INCOMPLETE_PROFILE_UPDATE_ROUTE);
    return true;
}

export function resolveTripCreateError(error) {
    if (isOfflineApiError(error)) {
        return { messageKey: 'offlineStatusBarMessage' };
    }

    if (isServerUnavailableApiError(error)) {
        return { messageKey: 'serverDownTitle' };
    }

    if (checkError(error, 'identity_validation_required')) {
        return {
            messageKey: 'debesValidarIdentidadParaAccion',
            redirectTo: { name: 'identity_validation' }
        };
    }

    if (hasTripFieldError(error, 'driver_is_verified')) {
        return { messageKey: 'tienesQueSerConductor' };
    }

    if (checkError(error, 'routing_service_unavailable')) {
        return { messageKey: 'routingServiceTemporaryError' };
    }

    if (isProfileRequiredTripError(error)) {
        return {
            messageKey: 'completaPerfilParaCrearViaje',
            redirectTo: INCOMPLETE_PROFILE_UPDATE_ROUTE
        };
    }

    if (hasTripFieldError(error, 'car_id')) {
        return { messageKey: 'olvidastePatente' };
    }

    if (hasTripFieldError(error, 'car_incomplete')) {
        return { messageKey: 'tripCreateCarIncomplete' };
    }

    if (hasTripFieldError(error, 'banned')) {
        return { messageKey: 'tripCreateBanned' };
    }

    const errors = error?.data?.errors;
    const hasFieldErrors =
        errors && typeof errors === 'object' && Object.keys(errors).length > 0;

    if (hasFieldErrors) {
        const detailedMessage = getApiErrorMessage(error, null);
        if (detailedMessage) {
            return { message: detailedMessage };
        }
    }

    return { messageKey: 'problemaAlCargarElViaje' };
}

export async function handleTripCreateApiError(
    error,
    {
        t,
        router,
        dialogs,
        reportError = logGenericApiErrorForDebug,
        isDebugEnabled = async () => false
    } = {}
) {
    const resolved = resolveTripCreateError(error);
    const debugEnabled = await isDebugEnabled();

    await reportError('trip_create', error, { debugEnabled });

    if (resolved.redirectTo?.name === 'identity_validation') {
        router.push(resolved.redirectTo);
    } else if (resolved.redirectTo) {
        router.replace(resolved.redirectTo);
    }

    const message = resolved.message
        ? resolved.message
        : t(resolved.messageKey || 'problemaAlCargarElViaje');

    dialogs.message(message, { estado: 'error' });

    return resolved;
}
