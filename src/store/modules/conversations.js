import {ConversationApi} from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';

// import bus from '../../services/bus-event';

let conversationApi = new ConversationApi();

const state = {
    ...pagination.makeState('list'),
    userList: null
};

// getters
const getters = {
    ...pagination.makeGetters('list'),
    users: state => state.userList
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
    }
};

// mutations
const mutations = {
    ...pagination.makeMutations('list'),

    [types.CONVERSATION_SET_USERLIST] (state, users) {
        state.userList = users;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
