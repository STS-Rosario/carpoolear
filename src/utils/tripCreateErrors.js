export const INCOMPLETE_PROFILE_UPDATE_ROUTE = {
    name: 'profile_update',
    query: { incompleteProfile: 'true' }
};

export function isProfileRequiredTripError(error) {
    if (!error || error.status !== 422) {
        return false;
    }

    const errors = error.data?.errors;
    if (!errors) {
        return false;
    }
    // API field name from Laravel validation bag
    const profileRequired = errors.profile_required;
    if (Array.isArray(profileRequired)) {
        return profileRequired.length > 0;
    }

    return typeof profileRequired === 'string' && profileRequired.trim().length > 0;
}

export function redirectToIncompleteProfileForTripCreate(router) {
    router.replace(INCOMPLETE_PROFILE_UPDATE_ROUTE);
    return true;
}
