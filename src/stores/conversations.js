import { defineStore } from 'pinia';
import { ConversationApi } from '../services/api';
import dayjs from '../dayjs';
import { checkError } from '../../utils/helpers';
import dialogs from '../services/dialogs.js';
import i18n from '../i18n';
// Lazy-load router to avoid circular dependency (stores → router → routes → components → stores)
let _router;
function getRouter() {
    if (!_router) _router = require('../router').default;
    return _router;
}

const conversationApi = new ConversationApi();
const pageSize = 20;

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

export const useConversationsStore = defineStore('conversations', {
    state: () => ({
        _list: null,
        listSearchParam: {
            page: 1,
            pageSize: 20,
            lastPage: false,
            data: {}
        },
        listCurrentPage: 1,
        userList: null,
        selectedID: null,
        conversationSelected: null,
        messages: {},
        timestamp: null
    }),

    getters: {
        /** Deduplicated list for UI — components access this as 'list' via mapState. */
        list: (state) => deduplicateList(state._list),
        listMorePage: (state) => !state.listSearchParam.lastPage,
        // listSearchParam is accessed via mapState directly from state.
        /** Raw list from state (for internal use). */
        listRaw: (state) => state._list,
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
    },

    actions: {
        // Custom pagination action for list (with normalization overrides)
        listSearch(data = {}) {
            let params = null;
            if (data.next) {
                if (this.listSearchParam.lastPage) {
                    return;
                }
                // NEXT_PAGE
                this.listSearchParam.page++;
                params = Object.assign({}, this.listSearchParam.data);
                params.page = this.listSearchParam.page;
                params.page_size = this.listSearchParam.pageSize;
            } else {
                // RESTORE_PAGE
                this.listSearchParam.page = 1;
                this.listSearchParam.lastPage = false;
                // SET_FILTER
                this.listSearchParam.data = data;
                // SET null
                this._list = null;
                params = Object.assign({}, data);
                params.page = this.listSearchParam.page;
                params.page_size = this.listSearchParam.pageSize;
            }
            const promises = conversationApi.list(params);
            promises
                .then((response) => {
                    if (
                        response.meta.pagination.total_pages ===
                        response.meta.pagination.current_page
                    ) {
                        // SET_LASTPAGE
                        this.listSearchParam.lastPage = true;
                    }
                    if (data.next) {
                        // ADD with normalization and dedup
                        if (response.data && response.data.length) {
                            const normalized = response.data.map(normalizeConversation);
                            if (!this._list || !this._list.length) {
                                this._list = normalized;
                            } else {
                                const existingIds = new Set(
                                    this._list.map((i) => normalizeId(i.id)).filter((x) => x != null)
                                );
                                const toAdd = normalized.filter((item) => {
                                    const id = normalizeId(item.id);
                                    return id != null && !existingIds.has(id);
                                });
                                if (toAdd.length) {
                                    this._list = [...this._list, ...toAdd];
                                }
                            }
                        } else {
                            console.error(this._list, response.data);
                        }
                    } else {
                        // SET with normalization
                        if (!response.data) {
                            this._list = response.data;
                        } else {
                            this._list = response.data.map(normalizeConversation);
                        }
                    }
                    return Promise.resolve(response.data);
                })
                .catch((error) => {
                    if (error) {
                        // intentionally empty (matches original)
                    }
                    return Promise.reject(error);
                });

            // Callback: create message buckets
            promises.then((response) => {
                (response.data || []).forEach((item) => {
                    this.createMessages(normalizeId(item.id));
                });
            });

            return promises;
        },

        clearUserList() {
            this.userList = null;
        },

        getUserList(texto) {
            if (texto.length > 0) {
                this.userList = null;
                return conversationApi
                    .userList({ value: texto })
                    .then((response) => {
                        this.userList = response.data;
                    });
            } else {
                this.userList = null;
                return Promise.resolve();
            }
        },

        createConversation(param) {
            // Inline identity validation check (replaces redirectToIdentityValidationIfRequired)
            const { useAuthStore } = require('./auth');
            const authStore = useAuthStore();
            const config = authStore.appConfig;
            const currentUser = authStore.user;
            if (config && config.identity_validation_required_new_users && currentUser && currentUser.identity_validation_required_for_user && !currentUser.identity_validated) {
                getRouter().push({ name: 'identity_validation' });
                return Promise.resolve();
            }

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
                    return Promise.resolve(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    if (checkError(error, 'identity_validation_required')) {
                        getRouter().push({ name: 'identity_validation' });
                        dialogs.message(i18n.global.t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    } else if (checkError(error, 'user_has_reach_request_limit')) {
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

        select(id) {
            const nid = normalizeId(id);
            if (nid) {
                const list = this._list || [];
                const conversationTemp = list.find(
                    (item) => normalizeId(item.id) === nid
                );

                if (conversationTemp) {
                    conversationTemp.unread = false;
                    this.setConversation(conversationTemp);
                    this.setSelected(nid);
                    this.createMessages(nid);
                    this.findConversation({
                        id: nid,
                        more: false
                    });

                    return Promise.resolve(conversationTemp);
                } else {
                    return this.findConversation({
                        id: nid,
                        more: false
                    })
                        .then((conversation) => {
                            conversation.unread = false;
                            this.createMessages(nid);
                            this.setConversation(conversation);
                            this.setSelected(nid);
                            return Promise.resolve(conversation);
                        })
                        .catch((err) => Promise.reject(err));
                }
            } else {
                this.setSelected(null);
            }
        },

        getUnreadMessages({ id } = {}) {
            if (!id) {
                id = this.selectedID;
            }
            const unread = true;
            const read = true;
            return conversationApi
                .getMessages(id, { read, unread, pageSize })
                .then((response) => {
                    this.insertMessage({
                        messages: response.data.reverse()
                    });
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        async getUnreaded() {
            const data = {};
            if (this.selectedID) {
                data.conversation_id = this.selectedID;
            }
            if (this.timestamp) {
                data.timestamp = this.timestamp;
            }
            return conversationApi
                .unread(data)
                .then(async (response) => {
                    const messages = response.data.reverse();
                    for (let mi = 0; mi < messages.length; mi += 1) {
                        const message = messages[mi];
                        const convId = normalizeId(message.conversation_id);
                        if (!this.messages[convId]) {
                            try {
                                const res = await conversationApi.show(convId);
                                if (res.data) {
                                    this.pushConversation(normalizeConversation(res.data));
                                }
                            } catch (e) {
                                // skip this message if conversation fetch fails
                            }
                        }
                        this.insertMessage({
                            messages: [message]
                        });
                    }
                    if (messages.length > 0) {
                        this.setTimestamp(messages[0].created_at);
                    }
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        findConversation({ id } = {}) {
            const nid = id != null ? normalizeId(id) : this.selectedID;
            if (!nid) return Promise.reject(new Error('No conversation id'));
            return conversationApi
                .show(nid)
                .then((response) => {
                    if (response.data) {
                        const conv = normalizeConversation(response.data);
                        this.createMessages(conv.id);
                        this.pushConversation(conv);
                        this.setConversation(conv);
                        this.findMessage({
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

        findMessage({ id, more } = {}) {
            const nid = id != null ? normalizeId(id) : this.selectedID;
            if (!nid) return Promise.reject(new Error('No conversation id'));
            const msgObj = this.messages[nid];
            let timestamp = null;
            if (more && msgObj && msgObj.list.length) {
                timestamp = msgObj.list[0].created_at;
            }

            const unread = false;
            const read = true;
            return conversationApi
                .getMessages(nid, { read, unread, pageSize, timestamp })
                .then((response) => {
                    if (!more) {
                        this.blankMessages({ id: nid });
                    }
                    if (response.data.length === 0) {
                        this.setLastPage({ id: nid });
                    } else {
                        const messages = response.data.reverse();
                        this.addMessage({
                            messages,
                            id: nid
                        });
                    }
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        sendMessage(message) {
            const id = this.selectedID;
            if (!id) return Promise.reject(new Error('No conversation selected'));
            return conversationApi
                .send(id, message)
                .then((response) => {
                    this.insertMessage({
                        messages: [response.data],
                        id
                    });
                    return Promise.resolve(response.data);
                })
                .catch((error) => {
                    if (checkError(error, 'identity_validation_required')) {
                        getRouter().push({ name: 'identity_validation' });
                        dialogs.message(i18n.global.t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    }
                    return Promise.reject(error);
                });
        },

        sendToAll({ message, users }) {
            users = users.map((item) => item.id);
            return conversationApi.sendToAll({ message, users });
        },

        // State mutation methods (replacing Vuex mutations)
        createMessages(id) {
            const nid = normalizeId(id);
            if (nid == null) return;
            if (!this.messages[nid]) {
                this.messages = { ...this.messages, [nid]: { list: [], lastPage: false } };
            }
        },

        insertMessage({ messages, id }) {
            messages.forEach((item) => {
                const convId = normalizeId(item.conversation_id);
                const msgBucket = this.messages[convId];
                if (!msgBucket) return;
                const exists = msgBucket.list.some(
                    (i) => normalizeId(i.id) === normalizeId(item.id)
                );
                if (!exists) {
                    msgBucket.list.push(item);
                    if (!id) {
                        const conv = (this._list || []).find(
                            (c) => normalizeId(c.id) === convId
                        );
                        if (conv) conv.unread = true;
                    }
                }
                if (this._list && this._list.length) {
                    this._list.forEach((c) => {
                        if (normalizeId(c.id) === convId) {
                            c.updated_at = item.created_at;
                            c.last_message = item;
                        }
                    });
                    const arrayClone = this._list.slice(0);
                    arrayClone.sort((a, b) => {
                        const dateA = dayjs(a.updated_at || a.update_at).toDate();
                        const dateB = dayjs(b.updated_at || b.update_at).toDate();
                        return dateB - dateA;
                    });
                    this._list = arrayClone;
                }
            });
        },

        addMessage({ messages, id }) {
            const nid = id != null ? normalizeId(id) : this.selectedID;
            if (nid == null || !this.messages[nid]) return;
            this.messages = {
                ...this.messages,
                [nid]: {
                    list: [...messages, ...this.messages[nid].list],
                    lastPage: this.messages[nid].lastPage
                }
            };
        },

        pushConversation(conv) {
            const normalized = normalizeConversation(conv);
            if (!this._list) {
                this._list = [];
            }
            const nid = normalizeId(normalized.id);
            if (nid == null) return;
            if (!this._list.some((i) => normalizeId(i.id) === nid)) {
                this._list.unshift(normalized);
            }
        },

        setTimestamp(timestamp) {
            this.timestamp = timestamp;
        },

        setUserList(users) {
            this.userList = users;
        },

        setSelected(id) {
            const nid = normalizeId(id);
            if (nid != null) {
                this.selectedID = nid;
            } else {
                this.selectedID = null;
                this.conversationSelected = null;
            }
        },

        setConversation(conversation) {
            if (conversation) {
                this.conversationSelected = conversation;
            } else {
                this.conversationSelected = null;
            }
        },

        setLastPage({ id } = {}) {
            const nid = id != null ? normalizeId(id) : this.selectedID;
            if (nid != null && this.messages[nid]) {
                this.messages[nid].lastPage = true;
            }
        },

        blankMessages({ id }) {
            const nid = id != null ? normalizeId(id) : this.selectedID;
            if (nid != null && this.messages[nid]) {
                this.messages[nid].lastPage = false;
                this.messages[nid].list = [];
            }
        },

        updateConversation(msg) {
            const convId = normalizeId(msg.conversation_id);
            const conv = (this._list || []).find(
                (item) => normalizeId(item.id) === convId
            );
            if (!conv) return;
            conv.unread = true;
            conv.updated_at = msg.created_at;
            conv.last_message = msg;

            this._list.sort((a, b) => {
                const dateA = dayjs(a.updated_at || a.update_at).toDate();
                const dateB = dayjs(b.updated_at || b.update_at).toDate();
                return dateB - dateA;
            });

            if (this.messages[convId] && !this.messages[convId].timestamp) {
                this.messages[convId].timestamp = msg.created_at;
            }
        }
    }
});
