import { ConversationApi } from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';
import globalStore from '../index';
import Vue from 'vue';
import moment from 'moment';
import { checkError } from '../../../utils/helpers';
import dialogs from '../../services/dialogs.js';

let conversationApi = new ConversationApi();
let pageSize = 20;

/** Normalise conversation/message id to number for consistent comparison. */
function normalizeId(id) {
    if (id == null || id === '') return null;
    const n = parseInt(id, 10);
    return isNaN(n) ? null : n;
}

/** Normalise conversation from API: ensure id and updated_at. */
function normalizeConversation(conv) {
    if (!conv) return conv;
    const c = { ...conv };
    c.id = normalizeId(c.id);
    c.updated_at = c.updated_at || c.update_at || null;
    return c;
}

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

/** Deduplicate list by normalized id (keep first occurrence) and normalise each item. */
function deduplicateList(list) {
    if (!list || !list.length) return list || [];
    const seen = new Set();
    return list
        .filter((item) => {
            const id = normalizeId(item.id);
            if (id == null || seen.has(id)) return false;
            seen.add(id);
            return true;
        })
        .map((item) => {
            const c = normalizeConversation(item);
            return { ...item, ...c };
        });
}

// getters
const getters = {
    ...pagination.makeGetters('list'),
    /** Raw list from state (for internal use). list getter below overrides with deduplicated. */
    listRaw: (state) => state.list,
    /** Deduplicated list for UI (single source for left bar). */
    list: (state) => deduplicateList(state.list),
    users: (state) => state.userList,
    selectedConversation: (state) => state.conversationSelected,
    /** Selected conversation id (number) for active row highlight. */
    selectedId: (state) => state.selectedID,

    msgObj: (state) => state.messages[state.selectedID],
    messagesList: (state) => {
        const messages = state.messages[state.selectedID];
        if (!messages) return [];

        return [...messages.list].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
    },
    lastPageConversation: (state) =>
        state.messages[state.selectedID]
            ? state.messages[state.selectedID].lastPage
            : true
};

// actions
const actions = {
    ...pagination.makeActions(
        'list',
        ({ data }) => {
            return conversationApi.list(data);
        },
        (store, p) => {
            p.then((list) => {
                (list.data || []).forEach((item) => {
                    store.commit(
                        types.CONVERSATION_CREATE_MESSAGES,
                        normalizeId(item.id)
                    );
                });
            });
        }
    ),

    clearUserList(store) {
        store.commit(types.CONVERSATION_SET_USERLIST, null);
    },

    getUserList(store, texto) {
        if (texto.length > 0) {
            store.commit(types.CONVERSATION_SET_USERLIST, null);
            return conversationApi
                .userList({ value: texto })
                .then((response) => {
                    store.commit(
                        types.CONVERSATION_SET_USERLIST,
                        response.data
                    );
                });
        } else {
            store.commit(types.CONVERSATION_SET_USERLIST, null);
            return Promise.resolve();
        }
    },

    createConversation(store, param) {
        let user = param;
        if (param.user) {
            user = param.user;
        }
        let tripId;
        if (param.tripId) {
            tripId = param.tripId;
        }
        console.log('createConversation', user, tripId);
        return conversationApi
            .create(user.id, tripId)
            .then((response) => {
                // globalStore.dispatch('conversations/listSearch');
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                if (checkError(error, 'user_has_reach_request_limit')) {
                    dialogs.message(
                        'Se ha alcanzado el límite de consultas que el usuario acepta por este viaje.',
                        { duration: 10, estado: 'error' }
                    );
                } else {
                    dialogs.message(
                        'Ocurrió al crear la conversación. Vuelva a intentarlo más tarde.',
                        { estado: 'error' }
                    );
                }
            });
    },

    select(store, id) {
        const nid = normalizeId(id);
        if (nid) {
            const list = store.state.list || [];
            let conversationTemp = list.find(
                (item) => normalizeId(item.id) === nid
            );

            if (conversationTemp) {
                conversationTemp.unread = false;
                store.commit(
                    types.CONVERSATION_SET_CONVERSATION,
                    conversationTemp
                );
                store.commit(types.CONVERSATION_SET_SELECTED, nid);
                store.commit(types.CONVERSATION_CREATE_MESSAGES, nid);
                globalStore.dispatch('conversations/findConversation', {
                    id: nid,
                    more: false
                });

                return Promise.resolve(conversationTemp);
            } else {
                return globalStore
                    .dispatch('conversations/findConversation', {
                        id: nid,
                        more: false
                    })
                    .then((conversation) => {
                        conversation.unread = false;
                        store.commit(types.CONVERSATION_CREATE_MESSAGES, nid);
                        store.commit(
                            types.CONVERSATION_SET_CONVERSATION,
                            conversation
                        );
                        store.commit(types.CONVERSATION_SET_SELECTED, nid);
                        return Promise.resolve(conversation);
                    })
                    .catch((err) => Promise.reject(err));
            }
        } else {
            store.commit(types.CONVERSATION_SET_SELECTED, null);
        }
    },

    getUnreadMessages(store, { id } = {}) {
        if (!id) {
            id = store.state.selectedID;
        }
        let unread = true;
        let read = true;
        return conversationApi
            .getMessages(id, { read, unread, pageSize })
            .then((response) => {
                store.commit(types.CONVERSATION_INSERT_MESSAGE, {
                    messages: response.data.reverse()
                });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    },

    getUnreaded(store) {
        let data = {};
        if (store.state.selectedID) {
            data.conversation_id = store.state.selectedID;
        }
        if (store.state.timestamp) {
            data.timestamp = store.state.timestamp;
        }
        return conversationApi
            .unread(data)
            .then(async (response) => {
                const messages = response.data.reverse();
                for (const msg of messages) {
                    const convId = normalizeId(msg.conversation_id);
                    if (!store.state.messages[convId]) {
                        try {
                            const res = await conversationApi.show(convId);
                            if (res.data) {
                                store.commit(
                                    types.CONVERSATION_PUSH,
                                    normalizeConversation(res.data)
                                );
                            }
                        } catch (e) {
                            // skip this message if conversation fetch fails
                        }
                    }
                    store.commit(types.CONVERSATION_INSERT_MESSAGE, {
                        messages: [msg]
                    });
                }
                if (messages.length > 0) {
                    store.commit(
                        types.CONVERSATION_SET_TIMESTAMP,
                        messages[0].created_at
                    );
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    },

    findConversation(store, { id } = {}) {
        const nid = id != null ? normalizeId(id) : store.state.selectedID;
        if (!nid) return Promise.reject(new Error('No conversation id'));
        return conversationApi
            .show(nid)
            .then((response) => {
                if (response.data) {
                    const conv = normalizeConversation(response.data);
                    store.commit(types.CONVERSATION_CREATE_MESSAGES, conv.id);
                    store.commit(types.CONVERSATION_PUSH, conv);
                    store.commit(types.CONVERSATION_SET_CONVERSATION, conv);
                    globalStore.dispatch('conversations/findMessage', {
                        id: conv.id,
                        more: false
                    });
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    },

    findMessage(store, { id, more } = {}) {
        const nid = id != null ? normalizeId(id) : store.state.selectedID;
        if (!nid) return Promise.reject(new Error('No conversation id'));
        let msgObj = store.state.messages[nid];
        let timestamp = null;
        if (more && msgObj && msgObj.list.length) {
            timestamp = msgObj.list[0].created_at;
        }

        let unread = false;
        let read = true;
        return conversationApi
            .getMessages(nid, { read, unread, pageSize, timestamp })
            .then((response) => {
                if (!more) {
                    store.commit(types.CONVERSATION_BLANK_MESSAGES, {
                        id: nid
                    });
                }
                if (response.data.length === 0) {
                    store.commit(types.CONVERSATION_SET_LAST_PAGE, {
                        id: nid
                    });
                } else {
                    let messages = response.data.reverse();
                    store.commit(types.CONVERSATION_ADD_MESSAGE, {
                        messages,
                        id: nid
                    });
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    },

    sendMessage(store, message) {
        const id = store.state.selectedID;
        if (!id) return Promise.reject(new Error('No conversation selected'));
        return conversationApi
            .send(id, message)
            .then((response) => {
                store.commit(types.CONVERSATION_INSERT_MESSAGE, {
                    messages: [response.data],
                    id
                });
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    },

    sendToAll(store, { message, users }) {
        users = users.map((item) => item.id);
        return conversationApi.sendToAll({ message, users });
    }
};

// mutations
const mutations = {
    ...pagination.makeMutations('list'),

    /** Override: SET list with normalized conversations. */
    LIST_SET(state, items) {
        if (!items) {
            state.list = items;
            return;
        }
        state.list = items.map(normalizeConversation);
    },

    /** Override: ADD page with deduplication by normalized id. */
    LIST_ADD(state, items) {
        if (!items || !items.length) return;
        const normalized = items.map(normalizeConversation);
        if (!state.list || !state.list.length) {
            state.list = normalized;
            return;
        }
        const existingIds = new Set(
            state.list.map((i) => normalizeId(i.id)).filter((x) => x != null)
        );
        const toAdd = normalized.filter((item) => {
            const id = normalizeId(item.id);
            return id != null && !existingIds.has(id);
        });
        if (toAdd.length) {
            state.list = [...state.list, ...toAdd];
        }
    },

    [types.CONVERSATION_PUSH](state, conv) {
        const normalized = normalizeConversation(conv);
        if (!state.list) {
            state.list = [];
        }
        const nid = normalizeId(normalized.id);
        if (nid == null) return;
        if (!state.list.some((i) => normalizeId(i.id) === nid)) {
            state.list.unshift(normalized);
        }
    },

    [types.CONVERSATION_SET_TIMESTAMP](state, timestamp) {
        state.timestamp = timestamp;
    },

    [types.CONVERSATION_SET_USERLIST](state, users) {
        state.userList = users;
    },

    [types.CONVERSATION_SET_SELECTED](state, id) {
        const nid = normalizeId(id);
        if (nid != null) {
            state.selectedID = nid;
        } else {
            state.selectedID = null;
            state.conversationSelected = null;
        }
    },

    [types.CONVERSATION_SET_CONVERSATION](state, conversation) {
        if (conversation) {
            state.conversationSelected = conversation;
        } else {
            state.conversationSelected = null;
        }
    },

    [types.CONVERSATION_CREATE_MESSAGES](state, id) {
        const nid = normalizeId(id);
        if (nid == null) return;
        if (!state.messages[nid]) {
            Vue.set(state.messages, nid, {
                list: [],
                lastPage: false
            });
        }
    },

    [types.CONVERSATION_INSERT_MESSAGE](state, { messages, id }) {
        messages.forEach((item) => {
            const convId = normalizeId(item.conversation_id);
            const msgBucket = state.messages[convId];
            if (!msgBucket) return;
            const exists = msgBucket.list.some(
                (i) => normalizeId(i.id) === normalizeId(item.id)
            );
            if (!exists) {
                msgBucket.list.push(item);
                if (!id) {
                    const conv = (state.list || []).find(
                        (c) => normalizeId(c.id) === convId
                    );
                    if (conv) conv.unread = true;
                }
            }
            if (state.list && state.list.length) {
                state.list.forEach((c) => {
                    if (normalizeId(c.id) === convId) {
                        c.updated_at = item.created_at;
                        c.last_message = item;
                    }
                });
                const arrayClone = state.list.slice(0);
                arrayClone.sort((a, b) => {
                    const dateA = moment(a.updated_at || a.update_at).toDate();
                    const dateB = moment(b.updated_at || b.update_at).toDate();
                    return dateB - dateA;
                });
                state.list = arrayClone;
            }
        });
    },

    [types.CONVERSATION_ADD_MESSAGE](state, { messages, id }) {
        const nid = id != null ? normalizeId(id) : state.selectedID;
        if (nid == null || !state.messages[nid]) return;
        Vue.set(state.messages, nid, {
            list: [...messages, ...state.messages[nid].list],
            lastPage: state.messages[nid].lastPage
        });
    },

    [types.CONVERSATION_UPDATE](state, msg) {
        const convId = normalizeId(msg.conversation_id);
        const conv = (state.list || []).find(
            (item) => normalizeId(item.id) === convId
        );
        if (!conv) return;
        conv.unread = true;
        conv.updated_at = msg.created_at;
        conv.last_message = msg;

        state.list.sort((a, b) => {
            const dateA = moment(a.updated_at || a.update_at).toDate();
            const dateB = moment(b.updated_at || b.update_at).toDate();
            return dateB - dateA;
        });

        if (state.messages[convId] && !state.messages[convId].timestamp) {
            state.messages[convId].timestamp = msg.created_at;
        }
    },

    [types.CONVERSATION_SET_LAST_PAGE](state, { id } = {}) {
        const nid = id != null ? normalizeId(id) : state.selectedID;
        if (nid != null && state.messages[nid]) {
            state.messages[nid].lastPage = true;
        }
    },

    [types.CONVERSATION_BLANK_MESSAGES](state, { id }) {
        const nid = id != null ? normalizeId(id) : state.selectedID;
        if (nid != null && state.messages[nid]) {
            state.messages[nid].lastPage = false;
            state.messages[nid].list = [];
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
