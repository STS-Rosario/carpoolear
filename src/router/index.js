import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes.js';
import { useAuthStore } from '../stores/auth';
import { useActionbarsStore } from '../stores/actionbars';
import { useBackgroundStore } from '../stores/background';
import { i18n } from '../i18n';

const historyMode = import.meta.env.VITE_HISTORY_MODE || 'hash';
const routeBase = import.meta.env.VITE_ROUTE_BASE || '/';

const router = createRouter({
    history: historyMode === 'history'
        ? createWebHistory(routeBase)
        : createWebHashHistory(routeBase),
    routes
});

router.rememberRoute = null;
router.stack = [];

router.beforeEach((to, from, next) => {
    const actionbarsStore = useActionbarsStore();
    const backgroundStore = useBackgroundStore();
    const authStore = useAuthStore();

    const actionbar = to.meta.actionbar || {};
    const background = to.meta.background || {};
    const user = authStore.checkLogin;

    if (user && actionbar.footer) {
        actionbarsStore.showFooter(!!actionbar.footer.show);
        if (actionbar.footer.active_id) {
            actionbarsStore.setActiveFooter(actionbar.footer.active_id);
        }
    } else {
        actionbarsStore.showFooter(false);
    }

    const config = authStore.appConfig;
    let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
    if (config) {
        appName = config.app_name ? config.app_name : config.name_app;
    }
    if (appName && appName.length) {
        appName = appName.charAt(0).toUpperCase() + appName.slice(1);
    }

    if (actionbar.header) {
        actionbarsStore.setSubTitle('');
        actionbarsStore.setTitleLink({});
        actionbarsStore.setImgTitle('');
        if (actionbar.header.titleKey) {
            const title = i18n.global.t(actionbar.header.titleKey);
            actionbarsStore.setTitle(title);
        } else {
            actionbarsStore.setTitle(appName);
        }
        if (actionbar.header.buttons) {
            actionbarsStore.setHeaderButtons(actionbar.header.buttons);
        } else {
            actionbarsStore.setHeaderButtons([]);
        }
        if (actionbar.header.logo) {
            actionbarsStore.showHeaderLogo(actionbar.header.logo.show);
        } else {
            actionbarsStore.showHeaderLogo(true);
        }
    } else {
        actionbarsStore.setTitle(appName);
        actionbarsStore.setHeaderButtons([]);
        actionbarsStore.showHeaderLogo(true);
    }

    if (background.style) {
        backgroundStore.setBackgroundStyle(background.style);
    } else {
        backgroundStore.setBackgroundStyle('gray');
    }

    window.scrollTo(0, 0);
    next();
});

// Navigation stack tracking
const originalPush = router.push.bind(router);
const originalReplace = router.replace.bind(router);
const originalGo = router.go.bind(router);

router.push = function (data) {
    if (data.name !== 'trips') {
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    return originalPush(data);
};

router.replace = function (data) {
    if (data.name !== 'trips') {
        router.stack.pop();
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    return originalReplace(data);
};

router.go = function (number) {
    router.stack.splice(-1, -number);
    return originalGo(number);
};

router.rememberBack = function () {
    if (router.rememberRoute) {
        router.push(router.rememberRoute);
        router.rememberRoute = null;
    } else {
        router.replace({ name: 'trips' });
    }
};

export default router;
