import {ConversationApi} from '../../services/api';
import * as types from '../mutation-types';

// import bus from '../../services/bus-event';

let conversationApi = new ConversationApi();

const state = {
    list: null,
    userList: null
};

// getters
const getters = {

};

// actions
const actions = {
    getList (store) {
        store.commit(types.CONVERSATION_SET_LIST, null);
        return conversationApi.list().then((response) => {
            store.commit(types.CONVERSATION_SET_LIST, response.data);
        });
    },

    getUserList (store, texto) {
        store.commit(types.CONVERSATION_SET_USERLIST, null);
        return conversationApi.userList({value: texto}).then((response) => {
            store.commit(types.CONVERSATION_SET_USERLIST, response.data);
        });
    }
};

// mutations
const mutations = {
    [types.CONVERSATION_SET_LIST] (state, conversations) {
        state.list = conversations;
    },

    [types.CONVERSATION_SET_USERLIST] (state, users) {
        state.list = users;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
