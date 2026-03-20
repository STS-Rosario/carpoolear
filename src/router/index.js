/* jshint esversion: 6 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import i18n from '../i18n';

import routes from './routes.js';

const router = createRouter({
    routes: routes,
    history: process.env.HISTORY_MODE === 'history'
        ? createWebHistory(process.env.ROUTE_BASE)
        : createWebHashHistory(process.env.ROUTE_BASE)
});

router.rememberRoute = null;

router.afterEach((to) => {
    try {
        const { getInstance } = require('../services/debug');
        const instance = getInstance();
        if (instance && instance.isEnabled()) {
            const url = (to.fullPath || to.path || window.location.href);
            console.log('[DEBUG] Navigation:', url);
        }
    } catch (e) {
        // Debug service not ready
    }
});

router.beforeEach((to, from, next) => {
    const { useAuthStore } = require('../stores/auth');
    const { useActionbarsStore } = require('../stores/actionbars');
    const { useBackgroundStore } = require('../stores/background');
    const authStore = useAuthStore();
    const actionbarsStore = useActionbarsStore();
    const backgroundStore = useBackgroundStore();

    const actionbar = to.meta.actionbar || {};
    const background = to.meta.background || {};
    const user = authStore.checkLogin;
    if (user && actionbar.footer) {
        if (actionbar.footer.show) {
            actionbarsStore.showFooter(true);
        } else {
            actionbarsStore.showFooter(false);
        }
        if (actionbar.footer.active_id) {
            actionbarsStore.setActiveFooter(actionbar.footer.active_id);
        }
    } else {
        actionbarsStore.showFooter(false);
    }
    const config = authStore.appConfig;
    console.log('config app name', config);
    let appName = process.env.TARGET_APP || 'Carpoolear';
    if (config) {
        appName = config.app_name ? config.app_name : config.name_app;
    }
    if (appName && appName.length) {
        appName = appName.charAt(0).toUpperCase() + appName.slice(1);
    }
    console.log('app name', appName);
    if (actionbar.header) {
        actionbarsStore.setSubTitle('');
        actionbarsStore.setTitleLink({});
        actionbarsStore.setImgTitle('');
        if (actionbar.header.titleKey) {
            console.log('actionbar.header.titleKey', actionbar.header.titleKey);
            const title = i18n.global.t(actionbar.header.titleKey);
            actionbarsStore.setTitle(title);
        } else {
            console.log('actionbar appName', appName);
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

router.stack = [];
router._push = router.push;
router._replace = router.replace;
router._go = router.go;

router.rememberBack = function () {
    if (router.rememberRoute) {
        router.push(router.rememberRoute);
        router.rememberRoute = null;
    } else {
        router.replace({ name: 'trips' });
    }
};

router.push = function (data, fnSuccess, fnFailure) {
    // console.log('push', JSON.stringify(router.stack), JSON.stringify(data));
    if (data.name !== 'trips') {
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    router._push(data, fnSuccess, fnFailure);
};

router.replace = function (data) {
    // console.log('replace', JSON.stringify(router.stack), JSON.stringify(data));
    if (data.name !== 'trips') {
        router.stack.pop();
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    router._push(data);
};

router.go = function (number) {
    // console.log('go', JSON.stringify(router.stack), number);
    router.stack.splice(-1, -number);
    router._go(number);
};

export default router;
