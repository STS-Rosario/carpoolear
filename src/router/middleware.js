/* jshint esversion: 6 */
import store from '../store';
import router from '../router';

export function auth (to, from, next) {
    if (store.getters['auth/checkLogin']) {
        next();
    } else {
        next(false);
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        router.replace({name: 'login'});
    }
}

export function guest (to, from, next) {
    if (!store.getters['auth/checkLogin']) {
        next();
    } else {
        next(false);
        router.replace({name: 'trips'});
    }
}

export function profileComplete (to, from, next) {
    let user = store.getters['auth/user'];
    if (!user.image || user.image.length === 0 || !user.description || user.description.length === 0) {
        router.rememberRoute = {
            name: to.name,
            params: to.params
        };
        console.log('problem');
        next(false);
        router.replace({ name: 'profile_update' });
    }
}
