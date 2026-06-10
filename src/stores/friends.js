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

const friendsPaginationActions = makePaginationActions('friends', ({ data }) =>
    friendsApi.index(data)
);
const friendsSearchBase = friendsPaginationActions.friendsSearch;

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
        ...friendsPaginationActions,

        friendsSearch(data = {}) {
            const isNextPage = Boolean(data.next);
            return friendsSearchBase.call(this, data).then((response) => {
                const items = extractPaginatedList(response);
                if (!isNextPage) {
                    this.friends = items;
                }
                this.pruneSentPendingsForAcceptedFriends();
                return items;
            });
        },

        pruneSentPendingsForAcceptedFriends() {
            if (!Array.isArray(this.sentPendings) || !Array.isArray(this.friends)) {
                return;
            }
            const friendIds = new Set(this.friends.map((friend) => friend.id));
            this.sentPendings = this.sentPendings.filter(
                (item) => !friendIds.has(item.id)
            );
        },

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
                this.pruneSentPendingsForAcceptedFriends();
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
            return friendsApi.accept(userId).then(() => {
                if (Array.isArray(this.pendings)) {
                    this.pendings = this.pendings.filter(
                        (item) => item.id !== userId
                    );
                }
                return this.friendsSearch({
                    ...this.friendsSearchParam.data
                });
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
            const normalizedUserId = userId.toString();
            return friendsApi.delete(userId).then(() => {
                if (Array.isArray(this.friends)) {
                    this.friends = this.friends.filter(
                        (item) => item.id.toString() !== normalizedUserId
                    );
                }
                return this.friendsSearch({
                    ...this.friendsSearchParam.data
                });
            });
        },

        toggleTripAlerts(userId) {
            return friendsApi.toggleTripAlerts(userId);
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
