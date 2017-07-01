/* jshint esversion: 6 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes.js';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
  // esto hay que atarlo a si estoy en cordova o no
    mode: process.env.HISTORY_MODE,
    base: process.env.ROUTE_BASE

});

router.beforeEach((to, from, next) => {
    let meta = to.meta.actionbar || {};
    let user = store.getters['auth/checkLogin'];
    if (user && meta.footer) {
        if (meta.footer.show) {
            store.dispatch('actionbars/showFooter', true);
        }
        if (meta.footer.active_id) {
            store.dispatch('actionbars/setActiveFooter', meta.footer.active_id);
        }
    } else {
        store.dispatch('actionbars/showFooter', false);
    }

    if (meta.header) {
        if (meta.header.title) {
            store.dispatch('actionbars/setTitle', meta.header.title);
        }
        if (meta.header.buttons) {
            store.dispatch('actionbars/setHeaderButtons', meta.header.buttons);
        }
    } else {
        store.dispatch('actionbars/setTitle', 'Carpoolear');
        store.dispatch('actionbars/setHeaderButtons', []);
    }
    window.scrollTo(0, 0);
    next();
});

export default router;
