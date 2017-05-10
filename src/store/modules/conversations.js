import {ConversationApi} from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';
import globalStore from '../index';

let conversationApi = new ConversationApi();
let pageSize = 20;

const state = {
    ...pagination.makeState('list'),
    userList: null,
    selectedID: null,
    messages: {
        /*
            id => {
                list: [],
                page: Numbre,
                last_page: Boolean
            }
        */
    }
};

// getters
const getters = {
    ...pagination.makeGetters('list'),
    users: state => state.userList,
    selectedConversation: state => state.list ? state.list.find(item => item.id === state.selectedID) : null,
    messages: state => state.messages[state.selectedID]
};

// actions
const actions = {
    ...pagination.makeActions('list', (data) => {
        return conversationApi.list();
    }),

    getUserList (store, texto) {
        if (texto.length > 0) {
            store.commit(types.CONVERSATION_SET_USERLIST, null);
            return conversationApi.userList({value: texto}).then((response) => {
                store.commit(types.CONVERSATION_SET_USERLIST, response.data);
            });
        } else {
            store.commit(types.CONVERSATION_SET_USERLIST, null);
            return Promise.resolve();
        }
    },

    createConversation (store, user) {
        return conversationApi.create(user.id).then((response) => {
            globalStore.dispatch('conversations/listSearch');
            return Promise.resolve(response.data);
        });
    },

    select (store, id) {
        store.commit(types.CONVERSATION_SET_SELECTED, id);
        if (!store.state.messages[id]) {
            store.state.messages[id] = {
                list: [],
                page: 1,
                last_page: false
            };
        }
        globalStore.dispatch('conversations/findMessage');
    },

    findMessage (store, more = false) {
        let id = store.state.selectedID;
        let msgObj = store.state.messages[id];

        return conversationApi.getMessages({ 'unread': false, pageSize, page: msgObj.page }).then(response => {

        }).catch(error => {
            return Promise.reject(error);
        });
    }

};

// mutations
const mutations = {
    ...pagination.makeMutations('list'),

    [types.CONVERSATION_SET_USERLIST] (state, users) {
        state.userList = users;
    },

    [types.CONVERSATION_SET_SELECTED] (state, id) {
        state.selectedID = id;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
