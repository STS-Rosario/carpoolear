/* jshint esversion: 6 */
import store from '../store';
import router from '../router';

export function auth(to, from, next) {
    if (store.getters['auth/checkLogin']) {
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
    if (
        store.getters['auth/checkLogin'] &&
        store.getters['auth/user'].is_admin
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
    if (!store.getters['auth/checkLogin']) {
        next();
    } else {
        next(false);
        router.replace({ name: 'trips' });
    }
}

/**
 * When identity_validation_required_new_users is true and the user is a new user
 * who must validate and is not yet validated, redirect to identity validation page.
 * Call after auth (only runs when logged in).
 */
export function requireIdentityValidation(to, from, next) {
    const config = store.getters['auth/appConfig'];
    const user = store.getters['auth/user'];
    if (
        config &&
        user &&
        config.identity_validation_required_new_users &&
        user.identity_validation_required_for_user &&
        !user.identity_validated
    ) {
        next(false);
        router.replace({ name: 'identity_validation' });
        return;
    }
    next();
}

export function profileComplete(to, from, next) {
    const user = store.getters['auth/user'];
    if (
        !user.image ||
        user.image.length === 0 ||
        !user.description ||
        user.description.length === 0
    ) {
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        console.log('problem');
        next(false);
        router.replace({ name: 'profile_update' });
    } else {
        next();
    }
}
