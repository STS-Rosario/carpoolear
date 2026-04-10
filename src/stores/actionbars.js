import { defineStore } from 'pinia';

// Lazy-load router to avoid circular dependency (stores → router → routes → components → stores)
let _router;
function getRouter() {
    if (!_router) _router = require('../router').default;
    return _router;
}

let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
if (appName && appName.length) {
    appName = appName.charAt(0).toUpperCase() + appName.slice(1);
}

export const useActionbarsStore = defineStore('actionbars', {
    state: () => ({
        title: appName,
        titleLink: {},
        subTitle: '',
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
        footer_buttons: [
            {
                id: 'home',
                icon: 'home',
                url: 'trips',
                active: true
            },
            {
                id: 'profile',
                icon: 'contact',
                url: 'profile',
                active: false
            },
            {
                id: 'new-trip',
                icon: 'add',
                url: 'new-trip',
                active: false
            },
            {
                id: 'conversations',
                icon: 'message',
                url: 'conversations-list',
                active: false
            },
            {
                id: 'notifications',
                icon: 'bell',
                url: 'notifications',
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
        setTitle(title = '') {
            const { useAuthStore } = require('./auth');
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

        footerButtonClick(item) {
            const params = {};
            if (item.url === 'profile') {
                params.id = 'me';
            }
            if (item.url === 'trips') {
                params.clearSearch = true;
                const { useTripsStore } = require('./trips');
                const tripsStore = useTripsStore();
                tripsStore.tripsSearch({ is_passenger: false });
                tripsStore.setRefreshList(true);
            }
            getRouter().push({ name: item.url, params });
        }
    }
});
