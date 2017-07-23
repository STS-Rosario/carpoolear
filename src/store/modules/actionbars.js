import * as types from '../mutation-types';
import router from '../../router';

const state = {
    title: 'Carpoolear',
    subTitle: '',
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
            icon: '&#xE88A;',
            url: 'trips',
            active: true
        },
        {
            id: 'profile',
            icon: '&#xE7FD;',
            url: 'profile',
            active: false
        },
        {
            id: 'new-trip',
            icon: '&#xE145;',
            url: 'new-trip',
            active: false
        },
        {
            id: 'conversations',
            icon: '&#xE0C9;',
            url: 'conversations-list',
            active: false
        },
        {
            id: 'notifications',
            icon: '&#xE7F4;',
            url: 'notifications',
            active: false
        }
    ]
};

const getters = {
    title: state => state.title,
    subTitle: state => state.subTitle,
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
