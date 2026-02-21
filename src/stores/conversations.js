import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { ConversationApi } from '../services/api';
import { usePagination } from '../composables/usePagination';
import { checkError } from '../../utils/helpers';
import dialogs from '../services/dialogs.js';
import moment from 'moment';

const conversationApi = new ConversationApi();
const pageSize = 20;

function normalizeId(id) {
    if (id == null || id === '') return null;
    const n = parseInt(id, 10);
    return isNaN(n) ? null : n;
}

function normalizeConversation(conv) {
    if (!conv) return conv;
    const c = { ...conv };
    c.id = normalizeId(c.id);
    c.updated_at = c.updated_at || c.update_at || null;
    return c;
}

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
        .map((item) => normalizeConversation(item));
}

export const useConversationsStore = defineStore('conversations', () => {
    const pagination = usePagination(
        'list',
        ({ data }) => conversationApi.list(data),
        (promise) => {
            promise.then((list) => {
                (list.data || []).forEach((item) => {
                    createMessages(normalizeId(item.id));
                });
            });
        }
    );

    const userList = ref(null);
    const selectedID = ref(null);
    const conversationSelected = ref(null);
    const messages = reactive({});
    const timestamp = ref(null);

    const list = computed(() => deduplicateList(pagination.items.value));
    const selectedConversation = computed(() => conversationSelected.value);
    const selectedId = computed(() => selectedID.value);
    const msgObj = computed(() => messages[selectedID.value]);
    const messagesList = computed(() => {
        const msgs = messages[selectedID.value];
        if (!msgs) return [];
        return [...msgs.list].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
    });
    const lastPageConversation = computed(() =>
        messages[selectedID.value]
            ? messages[selectedID.value].lastPage
            : true
    );

    function listSearch(data) {
        return pagination.search(data);
    }

    function clearUserList() {
        userList.value = null;
    }

    function getUserList(texto) {
        if (texto.length > 0) {
            userList.value = null;
            return conversationApi
                .userList({ value: texto })
                .then((response) => {
                    userList.value = response.data;
                });
        } else {
            userList.value = null;
            return Promise.resolve();
        }
    }

    function createConversation(param) {
        let user = param;
        if (param.user) {
            user = param.user;
        }
        let tripId;
        if (param.tripId) {
            tripId = param.tripId;
        }
        return conversationApi
            .create(user.id, tripId)
            .then((response) => Promise.resolve(response.data))
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
    }

    function select(id) {
        const nid = normalizeId(id);
        if (nid) {
            const rawList = pagination.items.value || [];
            const conversationTemp = rawList.find(
                (item) => normalizeId(item.id) === nid
            );

            if (conversationTemp) {
                conversationTemp.unread = false;
                conversationSelected.value = conversationTemp;
                selectedID.value = nid;
                createMessages(nid);
                findConversation({ id: nid, more: false });
                return Promise.resolve(conversationTemp);
            } else {
                return findConversation({ id: nid, more: false })
                    .then((conversation) => {
                        conversation.unread = false;
                        createMessages(nid);
                        conversationSelected.value = conversation;
                        selectedID.value = nid;
                        return Promise.resolve(conversation);
                    })
                    .catch((err) => Promise.reject(err));
            }
        } else {
            selectedID.value = null;
            conversationSelected.value = null;
        }
    }

    function getUnreadMessages({ id } = {}) {
        if (!id) id = selectedID.value;
        const unread = true;
        const read = true;
        return conversationApi
            .getMessages(id, { read, unread, pageSize })
            .then((response) => {
                insertMessages({ messages: response.data.reverse() });
            })
            .catch((error) => Promise.reject(error));
    }

    function getUnreaded() {
        const data = {};
        if (selectedID.value) {
            data.conversation_id = selectedID.value;
        }
        if (timestamp.value) {
            data.timestamp = timestamp.value;
        }
        return conversationApi
            .unread(data)
            .then(async (response) => {
                const msgs = response.data.reverse();
                for (const msg of msgs) {
                    const convId = normalizeId(msg.conversation_id);
                    if (!messages[convId]) {
                        try {
                            const res = await conversationApi.show(convId);
                            if (res.data) {
                                pushConversation(normalizeConversation(res.data));
                            }
                        } catch (e) {
                            // skip
                        }
                    }
                    insertMessages({ messages: [msg] });
                }
                if (msgs.length > 0) {
                    timestamp.value = msgs[0].created_at;
                }
            })
            .catch((error) => Promise.reject(error));
    }

    function findConversation({ id } = {}) {
        const nid = id != null ? normalizeId(id) : selectedID.value;
        if (!nid) return Promise.reject(new Error('No conversation id'));
        return conversationApi
            .show(nid)
            .then((response) => {
                if (response.data) {
                    const conv = normalizeConversation(response.data);
                    createMessages(conv.id);
                    pushConversation(conv);
                    conversationSelected.value = conv;
                    findMessage({ id: conv.id, more: false });
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => Promise.reject(error));
    }

    function findMessage({ id, more } = {}) {
        const nid = id != null ? normalizeId(id) : selectedID.value;
        if (!nid) return Promise.reject(new Error('No conversation id'));
        const msgObj = messages[nid];
        let msgTimestamp = null;
        if (more && msgObj && msgObj.list.length) {
            msgTimestamp = msgObj.list[0].created_at;
        }

        const unread = false;
        const read = true;
        return conversationApi
            .getMessages(nid, { read, unread, pageSize, timestamp: msgTimestamp })
            .then((response) => {
                if (!more) {
                    blankMessages({ id: nid });
                }
                if (response.data.length === 0) {
                    setLastPage({ id: nid });
                } else {
                    const msgs = response.data.reverse();
                    addMessages({ messages: msgs, id: nid });
                }
            })
            .catch((error) => Promise.reject(error));
    }

    function sendMessage(message) {
        const id = selectedID.value;
        if (!id) return Promise.reject(new Error('No conversation selected'));
        return conversationApi
            .send(id, message)
            .then((response) => {
                insertMessages({ messages: [response.data], id });
                return Promise.resolve(response.data);
            })
            .catch((error) => Promise.reject(error));
    }

    function sendToAll({ message, users }) {
        users = users.map((item) => item.id);
        return conversationApi.sendToAll({ message, users });
    }

    // Internal mutation-like functions
    function createMessages(id) {
        const nid = normalizeId(id);
        if (nid == null) return;
        if (!messages[nid]) {
            messages[nid] = { list: [], lastPage: false };
        }
    }

    function pushConversation(conv) {
        const normalized = normalizeConversation(conv);
        if (!pagination.items.value) {
            pagination.items.value = [];
        }
        const nid = normalizeId(normalized.id);
        if (nid == null) return;
        if (!pagination.items.value.some((i) => normalizeId(i.id) === nid)) {
            pagination.items.value.unshift(normalized);
        }
    }

    function insertMessages({ messages: msgs, id }) {
        msgs.forEach((item) => {
            const convId = normalizeId(item.conversation_id);
            const msgBucket = messages[convId];
            if (!msgBucket) return;
            const exists = msgBucket.list.some(
                (i) => normalizeId(i.id) === normalizeId(item.id)
            );
            if (!exists) {
                msgBucket.list.push(item);
                if (!id && pagination.items.value) {
                    const conv = pagination.items.value.find(
                        (c) => normalizeId(c.id) === convId
                    );
                    if (conv) conv.unread = true;
                }
            }
            if (pagination.items.value && pagination.items.value.length) {
                pagination.items.value.forEach((c) => {
                    if (normalizeId(c.id) === convId) {
                        c.updated_at = item.created_at;
                        c.last_message = item;
                    }
                });
                pagination.items.value.sort((a, b) => {
                    const dateA = moment(a.updated_at || a.update_at).toDate();
                    const dateB = moment(b.updated_at || b.update_at).toDate();
                    return dateB - dateA;
                });
            }
        });
    }

    function addMessages({ messages: msgs, id }) {
        const nid = id != null ? normalizeId(id) : selectedID.value;
        if (nid == null || !messages[nid]) return;
        messages[nid] = {
            list: [...msgs, ...messages[nid].list],
            lastPage: messages[nid].lastPage
        };
    }

    function setLastPage({ id } = {}) {
        const nid = id != null ? normalizeId(id) : selectedID.value;
        if (nid != null && messages[nid]) {
            messages[nid].lastPage = true;
        }
    }

    function blankMessages({ id }) {
        const nid = id != null ? normalizeId(id) : selectedID.value;
        if (nid != null && messages[nid]) {
            messages[nid].lastPage = false;
            messages[nid].list = [];
        }
    }

    function setListItems(items) {
        if (!items) {
            pagination.items.value = items;
            return;
        }
        pagination.items.value = items.map(normalizeConversation);
    }

    return {
        list,
        listMorePage: pagination.morePage,
        users: userList,
        selectedConversation,
        selectedId,
        msgObj,
        messagesList,
        lastPageConversation,
        messages,
        timestamp,
        selectedID,
        listSearch,
        clearUserList,
        getUserList,
        createConversation,
        select,
        getUnreadMessages,
        getUnreaded,
        findConversation,
        findMessage,
        sendMessage,
        sendToAll,
        pushConversation,
        insertMessages,
        setListItems
    };
});
