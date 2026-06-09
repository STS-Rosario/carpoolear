import axios from 'axios';
import { defineStore } from 'pinia';
import { FriendsApi, UserApi } from '../services/api';
import {
    makePaginationState,
    makePaginationGetters,
    makePaginationActions,
    extractPaginatedList
} from './pagination';

const friendsApi = new FriendsApi();
const userApi = new UserApi();

export const useFriendsStore = defineStore('friends', {
    state: () => ({
        ...makePaginationState('friends'),
        pendings: null,
        sentPendings: null,
        users: [],
        searching: null
    }),

    getters: {
        ...makePaginationGetters('friends'),
        hasPendingFriendRequests: (state) =>
            Array.isArray(state.pendings) && state.pendings.length > 0
    },

    actions: {
        ...makePaginationActions('friends', ({ data }) => {
            return friendsApi.index(data);
        }),

        pending() {
            this.pendings = null;
            return friendsApi.pending().then((response) => {
                this.pendings = response.data;
                return Promise.resolve(response.data);
            });
        },

        sentPending() {
            this.sentPendings = null;
            return friendsApi.sentPending().then((response) => {
                this.sentPendings = extractPaginatedList(response);
                return Promise.resolve(this.sentPendings);
            });
        },

        cancelRequest(userId) {
            return friendsApi.cancelRequest(userId).then(() => {
                if (Array.isArray(this.sentPendings)) {
                    this.sentPendings = this.sentPendings.filter(
                        (item) => item.id !== userId
                    );
                }
                if (Array.isArray(this.users)) {
                    this.users = this.users.map((item) => {
                        if (item.id === userId) {
                            item.state = 'none';
                        }
                        return item;
                    });
                }
                return Promise.resolve();
            });
        },

        request(userId) {
            return friendsApi.request(userId).then((response) => {
                // FRIENDS_SET_REQUEST
                if (Array.isArray(this.users)) {
                    this.users = this.users.map((item) => {
                        if (item.id === userId) {
                            item.state = 'request';
                        }
                        return item;
                    });
                }
                return Promise.resolve();
            });
        },

        accept(userId) {
            return friendsApi.accept(userId).then((response) => {
                // FRIENDS_REMOVE_PENDING
                this.pendings = this.pendings.filter(
                    (item) => item.id !== userId
                );
            });
        },

        reject(userId) {
            return friendsApi.reject(userId).then((response) => {
                // FRIENDS_REMOVE_PENDING
                this.pendings = this.pendings.filter(
                    (item) => item.id !== userId
                );
            });
        },

        delete(userId) {
            return friendsApi.delete(userId).then((response) => {
                // FRIENDS_REMOVE
                this.friends = this.friends.filter(
                    (item) => item.id !== userId
                );
            });
        },

        toggleTripAlerts(userId) {
            return friendsApi.toggleTripAlerts(userId).then((response) => {
                return Promise.resolve(response.data);
            });
        },

        clearUserSearch() {
            this.users = [];
            this.searching = null;
        },

        searchUsers(value) {
            const term = typeof value === 'string' ? value : '';
            if (term.length > 0) {
                this.users = null;
                if (this.searching) {
                    this.searching.abort();
                }
                const promise = userApi
                    .list({ value: term })
                    .then((response) => {
                        this.users = extractPaginatedList(response);
                        this.searching = null;
                        return Promise.resolve(this.users);
                    })
                    .catch((error) => {
                        this.searching = null;
                        if (!axios.isCancel || !axios.isCancel(error)) {
                            this.users = [];
                        }
                        return Promise.reject(error);
                    });
                this.searching = promise;
                return promise;
            }

            this.users = [];
            this.searching = null;
            return Promise.resolve();
        }
    }
});
