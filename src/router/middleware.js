/* jshint esversion: 6 */
import router from '../router';
import { useAuthStore } from '../stores/auth';
import { useRatesStore } from '../stores/rates';
import { hasRequiredProfileFields } from '../utils/profileRequirements';
import { INCOMPLETE_PROFILE_UPDATE_ROUTE } from '../utils/tripCreateErrors';
import { userNeedsIdentityValidation } from '../utils/identityValidationNavigation';
import {
    PENDING_RATINGS_REDIRECT_ROUTE,
    shouldRedirectForPendingRatings
} from '../utils/pendingRatingsEnforcement';
import { can } from '../utils/adminPermissions';
import { bannedUserRedirectLocation } from '../utils/bannedUserAccess.js';

function getAuthStore () {
    return useAuthStore();
}

function abortToIncompleteProfile(to, next) {
    router.rememberRoute = {
        name: to.name,
        params: to.params
    };
    next(false);
    router.replace(INCOMPLETE_PROFILE_UPDATE_ROUTE);
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
        const required = to.meta && to.meta.adminPermission;
        if (required && !can(authStore.user, required)) {
            next(false);
            router.replace({ name: 'admin-dashboard' });
            return;
        }
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
        router.replace(
            bannedUserRedirectLocation(getAuthStore().user, to.name) || {
                name: 'trips'
            }
        );
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

    if (userNeedsIdentityValidation(user, config)) {
        next(false);
        router.replace({ name: 'identity_validation' });
        return;
    }
    next();
}

/**
 * When the user has pending ratings, redirect to my-trips (except on my-trips itself).
 * Call after auth (only runs when logged in).
 */
export function requirePendingRatingsSubmission(to, from, next) {
    const ratesStore = useRatesStore();
    const pendingRates = ratesStore.pendingRates;

    if (shouldRedirectForPendingRatings(pendingRates, to.name)) {
        next(false);
        router.replace(PENDING_RATINGS_REDIRECT_ROUTE);
        return;
    }
    next();
}

export function requireIdentityPendingRatingsAndProfile(to, from, next) {
    const user = getAuthStore().user;
    if (!hasRequiredProfileFields(user)) {
        abortToIncompleteProfile(to, next);
        return;
    }
    requireIdentityValidation(to, from, () => {
        requirePendingRatingsSubmission(to, from, next);
    });
}

/** Profile complete, then identity validation (no pending-ratings check). */
export function requireProfileThenIdentityValidation(to, from, next) {
    const user = getAuthStore().user;
    if (!hasRequiredProfileFields(user)) {
        abortToIncompleteProfile(to, next);
        return;
    }
    requireIdentityValidation(to, from, next);
}

export function profileComplete(to, from, next) {
    const user = getAuthStore().user;
    if (!hasRequiredProfileFields(user)) {
        abortToIncompleteProfile(to, next);
        return;
    }
    next();
}
