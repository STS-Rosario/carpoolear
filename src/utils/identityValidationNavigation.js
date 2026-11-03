import { useAuthStore } from '../stores/auth';
import { hasRequiredProfileFields } from './profileRequirements';
import { INCOMPLETE_PROFILE_UPDATE_ROUTE } from './tripCreateErrors';

export function shouldBlockForIncompleteProfile(user) {
    return !hasRequiredProfileFields(user);
}

export function userNeedsIdentityValidation(user, config) {
    if (!config || !user) {
        return false;
    }

    const enforced =
        config.identity_validation_enabled === true &&
        config.identity_validation_optional !== true;

    if (!enforced) {
        return false;
    }

    if (user.identity_validation_required_for_user && !user.identity_validated) {
        return true;
    }

    if (user.validate_by_date && !user.identity_validated) {
        const [y, m, d] = user.validate_by_date.split('-').map(Number);
        const deadlineEndOfDay = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
        if (Date.now() >= deadlineEndOfDay) {
            return true;
        }
    }

    return false;
}

/**
 * Route to navigate when identity enforcement applies, or profile must be completed first.
 * @returns {object|null} vue-router location or null
 */
export function getIdentityValidationRedirectRoute(user, config) {
    if (shouldBlockForIncompleteProfile(user)) {
        return INCOMPLETE_PROFILE_UPDATE_ROUTE;
    }
    if (userNeedsIdentityValidation(user, config)) {
        return { name: 'identity_validation' };
    }
    return null;
}

/**
 * @returns {boolean} true if navigation was performed
 */
export function redirectIfIdentityValidationRequired(
    router,
    { user, config, useReplace = false } = {}
) {
    const route = getIdentityValidationRedirectRoute(user, config);
    if (!route) {
        return false;
    }
    if (useReplace) {
        router.replace(route);
    } else {
        router.push(route);
    }
    return true;
}

/** Uses current auth store (components / stores with active Pinia). */
export function redirectOnIdentityValidationRequiredError(router) {
    const authStore = useAuthStore();
    return redirectIfIdentityValidationRequired(router, {
        user: authStore.user,
        config: authStore.appConfig
    });
}
