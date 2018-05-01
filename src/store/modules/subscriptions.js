import { SubscriptionApi } from '../../services/api';
import * as types from '../mutation-types';

/* eslint-disable no-undef */

// initial state
let subscriptionApi = new SubscriptionApi();

const state = {
    subscriptions: null
};

// getters
const getters = {
    subscriptions: state => state.subscriptions
};

// actions
const actions = {
    index (store, data = {}) {
        return subscriptionApi.index(data).then(response => {
            store.commit(types.SUBSCRIPTION_SET, response.data ? response.data : []);
        }).catch(err => {
            console.log(err);
        });
    },

    create (store, data = {}) {
        return subscriptionApi.create(data).then(response => {
            store.commit(types.SUBSCRIPTION_ADD, response.data);
            return Promise.resolve(response.data);
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    },

    update (store, data = {}) {
        return subscriptionApi.update(data).then(response => {
            store.commit(types.SUBSCRIPTION_UPDATE, response.data);
            return Promise.resolve(response.data);
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    },

    delete (store, data = {}) {
        return subscriptionApi.delete(data).then(response => {
            store.commit(types.SUBSCRIPTION_DELETE, data);
            return Promise.resolve();
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    }
};

// mutations
const mutations = {
    [types.SUBSCRIPTION_SET] (state, items) {
        state.subscriptions = items;
    },
    [types.SUBSCRIPTION_ADD] (state, subs) {
        if (!state.subscriptions) {
            state.subscriptions = [];
        }
        state.subscriptions.push(subs);
    },
    [types.SUBSCRIPTION_UPDATE] (state, subs) {
        for (let i = 0; i < state.subscriptions.length; i++) {
            if (state.subscriptions[i].id === subs.id) {
                state.subscriptions[i] = subs;
            }
        }
    },
    [types.SUBSCRIPTION_DELETE] (state, subs) {
        state.subscriptions = state.subscriptions.filter(item => item.id === subs.id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

