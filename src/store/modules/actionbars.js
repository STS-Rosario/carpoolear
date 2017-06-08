import * as types from '../mutation-types';
import router from '../../router';

const state = {
    title: 'Carpoolear',
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
    footer_visibility: true,
    footer_buttons: [
        {
            id: 'home',
            icon: 'fa-home',
            url: 'trips',
            active: true
        },
        {
            id: 'profile',
            icon: 'fa-user',
            url: 'my-trips',
            active: false
        },
        {
            id: 'new-trip',
            icon: 'fa-plus',
            url: 'new-trip',
            active: false
        },
        {
            id: 'conversations',
            icon: 'fa-commenting',
            url: 'conversations-list',
            active: false
        },
        {
            id: 'notifications',
            icon: 'fa-bell',
            url: 'notifications',
            active: false
        }
    ]
};

const getters = {
    title: state => state.title,
    leftHeaderButton: state => state.header_buttons.filter(item => item.position === 'left'),
    rightHeaderButton: state => state.header_buttons.filter(item => item.position === 'right'),

    footerShow: state => state.footer_visibility,
    footerButtons: state => state.footer_buttons
};

const actions = {
    setTitle (store, title) {
        store.commit(types.HEADER_SET_TITLE, title);
        if (document) {
            document.title = title + ' - Carpoolear';
        }
    },

    setHeaderButtons (store, items) {
        store.commit(types.HEADER_SET_VISIBILITY, items);
    },

    showFooter (store, show) {
        console.log(show);
        store.commit(types.FOOTER_SET_VISIBILITY, show);
    },

    setActiveFooter (store, id) {
        store.commit(types.FOOTER_SET_ACTIVE, id);
    },

    footerButtonClick (store, item) {
        router.push({name: item.url});
    }

};

const mutations = {
    [types.HEADER_SET_TITLE] (state, title) {
        state.title = title;
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
