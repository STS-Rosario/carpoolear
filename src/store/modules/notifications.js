import * as types from '../mutation-types';
import {NotificationApi} from '../../services/api';

const notificationApi = new NotificationApi();

const state = {
    list: null,
    count: 0
};

const getters = {
    index: state => state.list,
    count: state => state.count
};

const actions = {
    index (store, mark = false) {
        store.commit(types.NOTIFICATIONS_SET, null);
        return notificationApi.index({mark}).then(response => {
            store.commit(types.NOTIFICATIONS_SET, response.data);
            return Promise.resolve(response.data);
        }).catch(() => {
            return Promise.reject();
        });
    },

    count (store) {
        return notificationApi.count().then(response => {
            store.commit(types.NOTIFICATIONS_COUNT, response.data);
            return Promise.resolve(response.data);
        }).catch(() => {
            return Promise.reject();
        });
    },

    add (store) {
        store.commit(types.NOTIFICATIONS_COUNT, store.state.count + 1);
        console.log(store.state);
    }
};

const mutations = {
    [types.NOTIFICATIONS_SET] (state, list) {
        state.list = list;
    },

    [types.NOTIFICATIONS_COUNT] (state, count) {
        state.count = count;
    },

    [types.NOTIFICATIONS_DELETE] (state, id) {
        let index = state.list.findIndex(item => item.id === id);
        if (index >= 0) {
            state.list.splice(index, 1);
        } else {
            console.error('Notifications not found on delete');
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
