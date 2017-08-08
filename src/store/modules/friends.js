import {FriendsApi, UserApi} from '../../services/api';
import * as types from '../mutation-types';
import * as pagination from '../pagination';

let friendsApi = new FriendsApi();
let userApi = new UserApi();

// initial state
const state = {
    ...pagination.makeState('friends'),
    pendings: null,
    users: [],
    searching: null
};

// getters
const getters = {
    ...pagination.makeGetters('friends'),
    pendings: state => state.pendings,
    users: state => state.users,
    searching: state => state.searching
};

// actions
const actions = {
    ...pagination.makeActions('friends', ({data}) => {
        return friendsApi.index(data);
    }),

    pending (store) {
        store.commit(types.FRIENDS_SET_PENDING, null);
        return friendsApi.pending().then(response => {
            store.commit(types.FRIENDS_SET_PENDING, response.data);
            return Promise.resolve(response.data);
        });
    },

    request (store, userId) {
        return friendsApi.request(userId).then(response => {
            store.commit(types.FRIENDS_SET_REQUEST, userId);
            return Promise.resolve();
        });
    },

    accept (store, userId) {
        return friendsApi.accept(userId).then(response => {
            store.commit(types.FRIENDS_REMOVE_PENDING, userId);
        });
    },

    reject (store, userId) {
        return friendsApi.reject(userId).then(response => {
            store.commit(types.FRIENDS_REMOVE_PENDING, userId);
        });
    },

    delete (store, userId) {
        return friendsApi.delete(userId).then(response => {
            store.commit(types.FRIENDS_REMOVE, userId);
        });
    },

    searchUsers (store, value) {
        if (value.length > 0) {
            store.commit(types.FRIENDS_SET_USERS, null);
            if (store.state.searching) {
                store.state.searching.abort();
            }
            let promise = userApi.list({ value }).then(response => {
                store.commit(types.FRIENDS_SET_USERS, response.data);
                store.commit(types.FRIENDS_SET_SEARCHING, null);
                return Promise.resolve(response.data);
            });
            store.commit(types.FRIENDS_SET_SEARCHING, promise);
            return promise;
        } else {
            store.commit(types.FRIENDS_SET_USERS, []);
            return Promise.resolve();
        }
    }
};

// mutations
const mutations = {
    ...pagination.makeMutations('friends'),

    [types.FRIENDS_SET_PENDING] (state, list) {
        state.pendings = list;
    },

    [types.FRIENDS_REMOVE_PENDING] (state, userID) {
        state.pendings = state.pendings.filter(item => item.id !== userID);
    },

    [types.FRIENDS_REMOVE] (state, userID) {
        state.friends = state.friends.filter(item => item.id !== userID);
    },

    [types.FRIENDS_SET_USERS] (state, users) {
        state.users = users;
    },
    [types.FRIENDS_SET_SEARCHING] (state, promise) {
        state.searching = promise;
    },

    [types.FRIENDS_SET_REQUEST] (state, userId) {
        state.users = state.users.map(item => {
            if (item.id === userId) {
                item.state = 'pending';
            }
            return item;
        });
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
