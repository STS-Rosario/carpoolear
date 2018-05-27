import {ConversationApi} from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';
import globalStore from '../index';
import Vue from 'vue';
import moment from 'moment';

let conversationApi = new ConversationApi();
let pageSize = 20;

const state = {
    ...pagination.makeState('list'),
    userList: null,
    selectedID: null,
    conversationSelected: null,
    messages: {
        /*
            id => {
                list: [],
                lastPage: Boolean
            }
        */
    },
    timestamp: null
};

// getters
const getters = {
    ...pagination.makeGetters('list'),
    users: state => state.userList,
    selectedConversation: state => state.conversationSelected,

    msgObj: state => state.messages[state.selectedID],
    messagesList: state => state.messages[state.selectedID] ? state.messages[state.selectedID].list : [],
    lastPageConversation: state => state.messages[state.selectedID] ? state.messages[state.selectedID].lastPage : true
};

// actions
const actions = {
    ...pagination.makeActions('list', ({data}) => {
        return conversationApi.list(data);
    }, (store, p) => {
        p.then((list) => {
            list.data.forEach(item => {
                store.commit(types.CONVERSATION_CREATE_MESSAGES, item.id);
            });
        });
    }),

    clearUserList (store) {
        store.commit(types.CONVERSATION_SET_USERLIST, null);
    },

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
            // globalStore.dispatch('conversations/listSearch');
            return Promise.resolve(response.data);
        }).catch((error) => {
            console.log(error);
        });
    },

    select (store, id) {
        if (id) {
            let conversationTemp = store.state.list ? store.state.list.find(item => item.id === id) : null;

            if (conversationTemp) {
                conversationTemp.unread = false;
                store.commit(types.CONVERSATION_SET_CONVERSATION, conversationTemp);
                store.commit(types.CONVERSATION_SET_SELECTED, id);
                store.commit(types.CONVERSATION_CREATE_MESSAGES, id);
                globalStore.dispatch('conversations/findConversation', {id, more: false});

                return Promise.resolve(conversationTemp);
            } else {
                return globalStore.dispatch('conversations/findConversation', {id, more: false}).then(conversation => {
                    conversation.unread = false;
                    store.commit(types.CONVERSATION_CREATE_MESSAGES, id);
                    store.commit(types.CONVERSATION_SET_CONVERSATION, conversation);
                    store.commit(types.CONVERSATION_SET_SELECTED, id);
                    return Promise.resolve(conversation);
                }).catch(err => Promise.reject(err));
            }
        } else {
            store.commit(types.CONVERSATION_SET_SELECTED, null);
        }
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

    getUnreaded (store) {
        let data = {};
        if (store.state.selectedID) {
            data.conversation_id = store.state.selectedID;
        }
        if (store.state.timestamp) {
            data.timestamp = store.state.timestamp;
        }
        return conversationApi.unread(data).then(response => {
            response.data.reverse().forEach(msg => {
                new Promise((resolve, reject) => {
                    if (!store.state.messages[msg.conversation_id]) {
                        // Si la conversacion no está cargada la busco en el backend
                        conversationApi.show(msg.conversation_id).then((response) => {
                            store.commit(types.CONVERSATION_PUSH, response.data);
                            resolve();
                        }).catch(reject);
                    } else {
                        // Si la conversación ya está listada no la necesito ir a buscar
                        resolve();
                    }
                }).then(() => {
                    // Tengo la conversacion, inserto el mensaje
                    // store.commit(types.CONVERSATION_CREATE_MESSAGES, msg.conversation_id);
                    store.commit(types.CONVERSATION_INSERT_MESSAGE, { messages: [msg] });
                    // store.commit(types.CONVERSATION_UPDATE, msg);
                });
            });
            if (response.data.length > 0) {
                let first = response.data[0];
                store.commit(types.CONVERSATION_SET_TIMESTAMP, first.created_at);
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    findConversation (store, {id} = {}) {
        if (!id) {
            id = store.state.selectedID;
        }
        return conversationApi.show(id).then(response => {
            if (response.data) {
                store.commit(types.CONVERSATION_CREATE_MESSAGES, id);
                store.commit(types.CONVERSATION_PUSH, response.data);
                store.commit(types.CONVERSATION_GET, response.data);
                store.commit(types.CONVERSATION_SET_CONVERSATION, response.data);
                globalStore.dispatch('conversations/findMessage', {id, more: false});
            }
            return Promise.resolve(response.data);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    findMessage (store, {id, more} = {}) {
        if (!id) {
            id = store.state.selectedID;
        }
        let msgObj = store.state.messages[id];
        let timestamp = null;
        if (more && msgObj.list.length) {
            timestamp = msgObj.list[0].created_at;
        }

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
                store.commit(types.CONVERSATION_ADD_MESSAGE, {messages, id});
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    sendMessage (store, message) {
        let id = store.state.selectedID;
        return conversationApi.send(id, message).then(response => {
            store.commit(types.CONVERSATION_INSERT_MESSAGE, { messages: [response.data], id });
            return Promise.resolve(response.data);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    sendToAll (store, { message, users }) {
        users = users.map(item => item.id);
        return conversationApi.sendToAll({message, users});
    }

};

// mutations
const mutations = {
    ...pagination.makeMutations('list'),

    [types.CONVERSATION_PUSH] (state, conv) {
        // Agrega una conversación a la lista si no existe
        if (!state.list) {
            state.list = [];
        }
        if (!state.list.find(i => i.id === conv.id)) {
            // uso unshift para agregarlo primero, se asume una nueva conversacion
            state.list.unshift(conv);
        }
    },

    [types.CONVERSATION_SET_TIMESTAMP] (state, timestamp) {
        state.timestamp = timestamp;
    },

    [types.CONVERSATION_SET_USERLIST] (state, users) {
        state.userList = users;
    },

    [types.CONVERSATION_SET_SELECTED] (state, id) {
        if (id) {
            id = parseInt(id);
            state.selectedID = id;
        } else {
            state.selectedID = null;
            state.conversationSelected = null;
        }
    },

    [types.CONVERSATION_SET_CONVERSATION] (state, conversation) {
        if (conversation) {
            state.conversationSelected = conversation;
        } else {
            state.conversationSelected = null;
        }
    },

    [types.CONVERSATION_CREATE_MESSAGES] (state, id) {
        id = parseInt(id);
        if (!state.messages[id]) {
            let obj = {
                list: [],
                lastPage: false
            };
            Vue.set(state.messages, id, obj);
        }
    },

    [types.CONVERSATION_INSERT_MESSAGE] (state, { messages, id }) {
        messages.forEach(item => {
            if (!state.messages[item.conversation_id].list.find(i => i.id === item.id)) {
                state.messages[item.conversation_id].list.push(item);
                if (!id) {
                    // marcar conversacion como no leida
                    let conv = state.list.find(c => c.id === item.conversation_id);
                    if (conv) {
                        conv.unread = true;
                    }
                }
            }
            if (state.list) {
                state.list.forEach(c => {
                    if (c.id.toString() === item.conversation_id.toString()) {
                        c.update_at = item.created_at;
                        c.last_message = item;
                    }
                });
                let arrayClone = state.list.slice(0);
                arrayClone.sort((a, b) => {
                    let dateA = moment(a.update_at).toDate();
                    let dateB = moment(b.update_at).toDate();
                    return dateB - dateA;
                });
                state.list = arrayClone;
            }
        });
    },

    [types.CONVERSATION_ADD_MESSAGE] (state, {messages, id}) {
        if (!id) {
            id = state.selectedID;
        }
        let obj = {};
        obj[id] = {
            list: [...messages, ...state.messages[id].list],
            lastPage: state.messages[id].lastPage
        };
        state.messages = Object.assign({}, state.messages, obj);
    },
    [types.CONVERSATION_GET] (state, conversation) {
        state.conversation = Object.assign({}, state.conversation, conversation);
    },

    [types.CONVERSATION_UPDATE] (state, msg) {
        let conv = state.list.find(item => item.id === msg.conversation_id);
        conv.unread = true;
        conv.updated_at = msg.created_at;
        conv.last_message = msg;

        state.list.sort((a, b) => a.updated_at <= b.updated_at);
        if (!state.messages[msg.conversation_id].timestamp) {
            state.messages[msg.conversation_id].timestamp = msg.created_at;
        }
    },

    [types.CONVERSATION_SET_LAST_PAGE] (state, {id} = {}) {
        if (!id) {
            id = state.selectedID;
        }
        state.messages[id].lastPage = true;
    },

    [types.CONVERSATION_BLANK_MESSAGES] (state, {id}) {
        id = parseInt(id);
        if (!id) {
            id = state.selectedID;
        }
        state.messages[id].lastPage = false;
        state.messages[id].list = [];
        // state.messages[id].timestamp = null;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
