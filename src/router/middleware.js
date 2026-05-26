/* jshint esversion: 6 */
import router from '../router';
import { useAuthStore } from '../stores/auth';
import { hasRequiredProfileFields } from '../utils/profileRequirements';

function getAuthStore () {
    return useAuthStore();
}

export function auth(to, from, next) {
    if (getAuthStore().checkLogin) {
        next();
    } else {
        next(false);
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        router.replace({ name: 'login' });
    }
}
export function authAdmin(to, from, next) {
    const authStore = getAuthStore();
    if (
        authStore.checkLogin &&
        authStore.user.is_admin
    ) {
        next();
    } else {
        next(false);
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        router.replace({ name: 'login' });
    }
}

export function guest(to, from, next) {
    if (!getAuthStore().checkLogin) {
        next();
    } else {
        next(false);
        router.replace({ name: 'trips' });
    }
}

/**
 * When identity validation is enforced (enabled and not optional) and the user
 * must validate, redirect to identity validation page.
 * Call after auth (only runs when logged in).
 */
export function requireIdentityValidation(to, from, next) {
    const authStore = getAuthStore();
    const config = authStore.appConfig;
    const user = authStore.user;

    const enforced =
        config &&
        config.identity_validation_enabled === true &&
        config.identity_validation_optional !== true;

    // Check if user needs validation (either new user flag or past deadline for current users)
    let needsValidation = false;
    if (enforced && user) {
        if (user.identity_validation_required_for_user && !user.identity_validated) {
            needsValidation = true;
        } else if (user.validate_by_date && !user.identity_validated) {
            // Check if deadline has passed for current users
            const [y, m, d] = user.validate_by_date.split('-').map(Number);
            const deadlineEndOfDay = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
            if (Date.now() >= deadlineEndOfDay) {
                needsValidation = true;
            }
        }
    }

    if (needsValidation) {
        next(false);
        router.replace({ name: 'identity_validation' });
        return;
    }
    next();
}

export function profileComplete(to, from, next) {
    const user = getAuthStore().user;
    if (!hasRequiredProfileFields(user)) {
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        console.log('problem');
        next(false);
        router.replace({ name: 'profile_update', query: { incompleteProfile: 'true' } });
    } else {
        next();
    }
}
