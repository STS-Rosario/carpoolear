import { useAuthStore } from '../stores/auth';
import router from './index';

export function auth(to, from, next) {
    const authStore = useAuthStore();
    if (authStore.checkLogin) {
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
    const authStore = useAuthStore();
    if (authStore.checkLogin && authStore.user && authStore.user.is_admin) {
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
    const authStore = useAuthStore();
    if (!authStore.checkLogin) {
        next();
    } else {
        next(false);
        router.replace({ name: 'trips' });
    }
}

export function profileComplete(to, from, next) {
    const authStore = useAuthStore();
    const user = authStore.user;
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
        next(false);
        router.replace({ name: 'profile_update' });
    }
}
