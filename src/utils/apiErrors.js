const GENERIC_API_ERROR_MESSAGES = new Set([
    'Could not update user.',
    'Could not create user.'
]);

const API_ERROR_I18N_KEYS = {
    impersonation_action_forbidden: 'impersonationActionForbidden',
    migration_banned_user: 'errorMigracionUsuarioSuspendido'
};

function extractApiErrorPayload(apiError) {
    if (!apiError) {
        return null;
    }

    if (apiError.data && typeof apiError.data === 'object') {
        return apiError.data;
    }

    return null;
}

function extractApiErrorMessage(apiError) {
    if (!apiError) {
        return null;
    }

    if (typeof apiError.message === 'string' && apiError.message.trim()) {
        return apiError.message;
    }

    if (
        apiError.data &&
        typeof apiError.data.message === 'string' &&
        apiError.data.message.trim()
    ) {
        return apiError.data.message;
    }

    return null;
}

export function getApiErrorMessage(apiError, fallback, translate) {
    if (!apiError) {
        return fallback;
    }

    const errors = apiError.errors || (apiError.data && apiError.data.errors);
    if (errors && typeof errors === 'object') {
        const errorValues = Object.values(errors);
        for (let i = 0; i < errorValues.length; i += 1) {
            const value = errorValues[i];
            if (Array.isArray(value) && value.length > 0 && value[0]) {
                return String(value[0]);
            }
            if (typeof value === 'string' && value.trim()) {
                return value;
            }
        }
    }

    const message = extractApiErrorMessage(apiError);
    if (message) {
        const payload = extractApiErrorPayload(apiError);
        if (translate && API_ERROR_I18N_KEYS[message]) {
            if (message === 'migration_banned_user' && payload) {
                return translate(API_ERROR_I18N_KEYS[message], {
                    name: payload.user_name || '',
                    id: payload.user_id ?? ''
                });
            }

            return translate(API_ERROR_I18N_KEYS[message]);
        }
        if (!GENERIC_API_ERROR_MESSAGES.has(message)) {
            return message;
        }
    }

    return fallback;
}

export function isOfflineApiError(error) {
    return Boolean(
        error &&
            (error.offline === true ||
                error.status === 0 ||
                (error.data && error.data.message === 'network_offline') ||
                error.message === 'network_offline')
    );
}
