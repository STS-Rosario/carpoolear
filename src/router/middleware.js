/* jshint esversion: 6 */
import store from '../store';

export function auth (to, from, next) {
    if (store.getters['auth/checkLogin']) {
        next();
    } else {
        next('/login');
    }
}
