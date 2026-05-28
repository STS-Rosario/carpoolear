const GENERIC_API_ERROR_MESSAGES = new Set([
    'Could not update user.',
    'Could not create user.'
]);

export function isOfflineApiError(error) {
    return Boolean(
        error &&
            (error.offline === true ||
                error.status === 0 ||
                (error.data && error.data.message === 'network_offline') ||
                error.message === 'network_offline')
    );
}

/**
 * @param {object|null|undefined} apiError Rejected API payload (e.g. { errors, message })
 * @param {string} fallback Localized message when no user-facing detail is available
 * @returns {string}
 */
export function getApiErrorMessage(apiError, fallback) {
    if (!apiError) {
        return fallback;
    }

    const errors = apiError.errors;
    if (errors && typeof errors === 'object') {
        for (const key of Object.keys(errors)) {
            const value = errors[key];
            if (Array.isArray(value) && value.length > 0 && value[0]) {
                return String(value[0]);
            }
            if (typeof value === 'string' && value.trim()) {
                return value;
            }
        }
    }

    const message = apiError.message;
    if (
        typeof message === 'string' &&
        message.trim() &&
        !GENERIC_API_ERROR_MESSAGES.has(message)
    ) {
        return message;
    }

    return fallback;
}
