import * as types from '../mutation-types';
import router from '../../router';
import globalStore from '../index';

const state = {
    title: 'Carpoolear',
    subTitle: '',
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
};

const getters = {
    title: state => state.title,
    subTitle: state => state.subTitle,
    showMenu: state => state.showMenu,
    leftHeaderButton: state => state.header_buttons.filter(item => item.position === 'left'),
    rightHeaderButton: state => state.header_buttons.filter(item => item.position === 'right'),
    headerLogoVisibility: state => state.header_logo_visibility,

    footerShow: state => state.footer_visibility,
    footerButtons: state => state.footer_buttons
};

const actions = {
    setTitle (store, title = 'Carpoolear') {
        store.commit(types.HEADER_SET_TITLE, title);
        if (document) {
            document.title = title + (title !== 'Carpoolear' ? ' - Carpoolear' : '');
        }
    },

    setSubTitle (store, newSubTitle = '') {
        store.commit(types.HEADER_SET_SUB_TITLE, newSubTitle);
    },

    setHeaderButtons (store, items) {
        store.commit(types.HEADER_SET_VISIBILITY, items);
    },

    showHeaderLogo (store, show = true) {
        store.commit(types.HEADER_LOGO_SET_VISIBILITY, show);
    },

    showFooter (store, show) {
        store.commit(types.FOOTER_SET_VISIBILITY, show);
    },

    setActiveFooter (store, id) {
        store.commit(types.FOOTER_SET_ACTIVE, id);
    },

    footerButtonClick (store, item) {
        let params = {};
        if (item.url === 'profile') {
            params.id = 'me';
        }
        if (item.url === 'trips') {
            params.clearSearch = true;
            console.log('dispatch trips/tripsSearch on footerButtonClick');
            globalStore.dispatch('trips/tripsSearch', { is_passenger: false });
            globalStore.dispatch('trips/refreshList', true);
        }
        router.push({name: item.url, params});
    }

};

const mutations = {
    [types.HEADER_SET_TITLE] (state, title) {
        state.title = title;
    },

    [types.HEADER_SET_SUB_TITLE] (state, newSubTitle) {
        state.subTitle = newSubTitle;
    },

    [types.FOOTER_SET_VISIBILITY] (state, show) {
        state.footer_visibility = show;
    },

    [types.HEADER_SET_VISIBILITY] (state, items) {
        state.header_buttons.forEach(item => {
            let index = items.findIndex(ids => ids === item.id);
            if (index < 0) {
                item.show = false;
            } else {
                item.show = true;
            }
        });
        if (items.includes('menu')) {
            state.showMenu = true;
        } else {
            state.showMenu = false;
        }
    },

    [types.HEADER_LOGO_SET_VISIBILITY] (state, show) {
        state.header_logo_visibility = show;
    },

    [types.FOOTER_SET_ACTIVE] (state, id) {
        state.footer_buttons.forEach(item => {
            if (item.id === id) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
