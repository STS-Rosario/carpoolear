export const MP_BOTH_MISMATCH_PREVIEW_QUERY = {
    result: 'both_mismatch',
    user_name: 'Juan Pérez',
    mp_name: 'María García',
    user_dni: '30123456',
    mp_dni: '30999999'
};

export function buildIdentityValidationMpBothMismatchPreviewUrl(options = {}) {
    const basePath = options.basePath ?? '/identity-validation';
    const params = new URLSearchParams(MP_BOTH_MISMATCH_PREVIEW_QUERY);
    const query = params.toString();
    const pathWithQuery = `${basePath}?${query}`;

    if (options.origin) {
        return `${options.origin}/#${pathWithQuery}`;
    }

    return pathWithQuery;
}
