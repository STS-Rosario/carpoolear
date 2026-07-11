import { defineStore } from 'pinia';
import { getLazyRouter } from '../utils/routerLazy.js';
import {
    resolveMobileMenuCloseTarget,
    snapshotRoute
} from '../utils/mobileMenuNavigation.js';

let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
if (appName && appName.length) {
    appName = appName.charAt(0).toUpperCase() + appName.slice(1);
}

export const useActionbarsStore = defineStore('actionbars', {
    state: () => ({
        title: appName,
        titleLink: {},
        subTitle: '',
        headerRatings: null,
        imgTitle: '',
        showMenu: false,
        header_buttons: [
            {
                id: 'back',
                icon: 'fa-angle-left',
                show: false,
                position: 'left'
            },
            {
                id: 'clear',
                icon: 'fa-times',
                show: false,
                position: 'right'
            },
            {
                id: 'share',
                icon: 'fa-share-alt',
                show: false,
                position: 'right'
            },
            {
                id: 'search',
                icon: 'fa-search',
                show: false,
                position: 'right'
            }
        ],
        header_logo_visibility: true,
        footer_visibility: true,
        mobileMenuReturnRoute: null,
        footer_buttons: [
            {
                id: 'home',
                labelKey: 'inicio',
                icon: 'home',
                url: 'trips',
                active: true
            },
            {
                id: 'my-trips',
                labelKey: 'misViajes',
                icon: 'my-trips',
                url: 'my-trips',
                active: false
            },
            {
                id: 'new-trip',
                labelKey: 'crearViaje',
                icon: 'create-trip',
                url: 'new-trip',
                active: false
            },
            {
                id: 'messages',
                labelKey: 'mensajes',
                icon: 'message',
                url: 'conversations-list',
                active: false
            },
            {
                id: 'profile',
                labelKey: 'miCuenta',
                icon: 'account',
                url: 'my-account',
                active: false
            }
        ]
    }),

    getters: {
        // title, subTitle, imgTitle, showMenu, titleLink are accessed via mapState directly from state.
        leftHeaderButton: (state) =>
            state.header_buttons.filter((item) => item.position === 'left'),
        rightHeaderButton: (state) =>
            state.header_buttons.filter((item) => item.position === 'right'),
        headerLogoVisibility: (state) => state.header_logo_visibility,
        footerShow: (state) => state.footer_visibility,
        footerButtons: (state) => state.footer_buttons
    },

    actions: {
        async setTitle(title = '') {
            const { useAuthStore } = await import('./auth');
            const authStore = useAuthStore();
            const config = authStore.appConfig;
            let currentAppName = config ? config.name_app : import.meta.env.VITE_TARGET_APP;
            if (currentAppName && currentAppName.length) {
                currentAppName = currentAppName.charAt(0).toUpperCase() + currentAppName.slice(1);
            }
            this.title = title;
            if (document) {
                document.title =
                    title +
                    (title !== currentAppName
                        ? (title !== '' ? ' - ' : '') + currentAppName
                        : '');
            }
        },

        setTitleLink(newTitleLink = {}) {
            this.titleLink = newTitleLink;
        },

        setSubTitle(newSubTitle = '') {
            this.subTitle = newSubTitle;
        },

        setHeaderRatings(ratings = null) {
            this.headerRatings = ratings;
        },

        setImgTitle(newImgTitle = '') {
            this.imgTitle = newImgTitle;
        },

        setHeaderButtons(items) {
            this.header_buttons.forEach((item) => {
                const index = items.findIndex((ids) => ids === item.id);
                if (index < 0) {
                    item.show = false;
                } else {
                    item.show = true;
                }
            });
            if (items.includes('menu')) {
                this.showMenu = true;
            } else {
                this.showMenu = false;
            }
        },

        showHeaderLogo(show = true) {
            this.header_logo_visibility = show;
        },

        showFooter(show) {
            this.footer_visibility = show;
        },

        setActiveFooter(id) {
            this.footer_buttons.forEach((item) => {
                if (item.id === id) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            });
        },

        async openMobileMenu(router) {
            const current = router.currentRoute.value;
            if (current.name === 'mobile-menu') {
                return this.closeMobileMenu(router);
            }
            this.mobileMenuReturnRoute = snapshotRoute(current);
            return router.push({ name: 'mobile-menu' });
        },

        async closeMobileMenu(router) {
            const target = resolveMobileMenuCloseTarget(this.mobileMenuReturnRoute);
            this.mobileMenuReturnRoute = null;
            if (
                router.stack &&
                router.stack.length &&
                router.stack[router.stack.length - 1]?.name === 'mobile-menu'
            ) {
                router.stack.pop();
            }
            return router._push(target);
        },

        async footerButtonClick(item) {
            const router = await getLazyRouter();
            const params = {};
            const query = {};
            if (item.url === 'profile') {
                params.id = 'me';
            }
            if (item.url === 'trips') {
                query.clearSearch = 'true';
                const { useTripsStore } = await import('./trips');
                const tripsStore = useTripsStore();
                tripsStore.tripsSearch({ is_passenger: false });
                tripsStore.setRefreshList(true);
            }
            router.push({
                name: item.url,
                ...(Object.keys(params).length ? { params } : {}),
                ...(Object.keys(query).length ? { query } : {})
            });
        }
    }
});
