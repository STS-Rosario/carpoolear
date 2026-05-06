export const PROFILE_EDIT_ROUTE = Object.freeze({
    name: 'profile_update'
});

export const MANUAL_IDENTITY_VALIDATION_ROUTE = Object.freeze({
    name: 'identity_validation_manual'
});

export function isIdentityValidationActionBlockedByMissingDni(user) {
    return !user || !user.nro_doc;
}

export function getManualIdentityValidationRoute(user) {
    return isIdentityValidationActionBlockedByMissingDni(user)
        ? PROFILE_EDIT_ROUTE
        : MANUAL_IDENTITY_VALIDATION_ROUTE;
}
