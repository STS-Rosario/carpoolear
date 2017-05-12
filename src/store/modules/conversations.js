import {ConversationApi} from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';
import globalStore from '../index';
import Vue from 'vue';

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
                timestamp: DateTime,
                lastPage: Boolean
            }
        */
    }
};

// getters
const getters = {
    ...pagination.makeGetters('list'),
    users: state => state.userList,
    selectedConversation: state => state.list ? state.list.find(item => item.id === state.selectedID) : null,
    msgObj: state => state.messages[state.selectedID],
    messagesList: state => state.messages[state.selectedID].list,
    lastPageConversation: state => state.messages[state.selectedID].lastPage,
    timestampConversation: state => state.messages[state.selectedID].timestamp
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
        globalStore.dispatch('conversations/findMessage', {id, more: false});
    },

    getUnreadMessages (store, {id} = {}) {
        if (!id) {
            id = store.state.selectedID;
        }
        let unread = true;
        let read = true;
        return conversationApi.getMessages(id, { read, unread, pageSize }).then(response => {
            store.commit(types.CONVERSATION_INSERT_MESSAGE, { messages: response.data.reverse() });
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    findMessage (store, {id, more} = {}) {
        if (!id) {
            id = store.state.selectedID;
        }
        let msgObj = store.state.messages[id];
        let timestamp = more ? msgObj.timestamp : null;
        let unread = false;
        let read = true;
        return conversationApi.getMessages(id, { read, unread, pageSize, timestamp }).then(response => {
            if (!more) {
                store.commit(types.CONVERSATION_BLANK_MESSAGES, {id});
            }
            if (response.data.length === 0) {
                store.commit(types.CONVERSATION_SET_LAST_PAGE);
            } else {
                let messages = response.data.reverse();
                store.commit(types.CONVERSATION_ADD_MESSAGE, {messages});
                let last = messages[0];
                store.commit(types.CONVERSATION_SET_TIMESTAMP, {timestamp: last.created_at});
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    sendMessage (store, message) {
        let id = store.state.selectedID;
        return conversationApi.send(id, message).then(response => {
            store.commit(types.CONVERSATION_INSERT_MESSAGE, { messages: [response.data] });
            return Promise.resolve(response.data);
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
        id = parseInt(id);
        state.selectedID = id;
        if (!state.messages[id]) {
            let obj = {
                list: [],
                timestamp: null,
                lastPage: false
            };
            Vue.set(state.messages, id, obj);
        }
    },

    [types.CONVERSATION_INSERT_MESSAGE] (state, {messages, id}) {
        if (!id) {
            id = state.selectedID;
        }
        messages.forEach(item => {
            state.messages[id].list.push(item);
        });
    },

    [types.CONVERSATION_ADD_MESSAGE] (state, {messages, id}) {
        if (!id) {
            id = state.selectedID;
        }
        let obj = {};
        obj[id] = {
            list: [...messages, ...state.messages[id].list],
            timestamp: state.messages[id].timestamp,
            lastPage: state.messages[id].lastPage
        };

        state.messages = Object.assign({}, state.messages, obj);
    },

    [types.CONVERSATION_SET_LAST_PAGE] (state, {id} = {}) {
        if (!id) {
            id = state.selectedID;
        }
        state.messages[id].lastPage = true;
    },

    [types.CONVERSATION_SET_TIMESTAMP] (state, {id, timestamp} = {}) {
        if (!id) {
            id = state.selectedID;
        }
        state.messages[id].timestamp = timestamp;
    },

    [types.CONVERSATION_BLANK_MESSAGES] (state, {id}) {
        id = parseInt(id);
        if (!id) {
            id = state.selectedID;
        }
        state.messages[id].lastPage = false;
        state.messages[id].list = [];
        state.messages[id].timestamp = null;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
