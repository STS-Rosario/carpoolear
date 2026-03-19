import { defineStore } from 'pinia';
import { FriendsApi, UserApi } from '../services/api';
import {
    makePaginationState,
    makePaginationGetters,
    makePaginationActions
} from './pagination';

const friendsApi = new FriendsApi();
const userApi = new UserApi();

export const useFriendsStore = defineStore('friends', {
    state: () => ({
        ...makePaginationState('friends'),
        pendings: null,
        users: [],
        searching: null
    }),

    getters: {
        ...makePaginationGetters('friends')
        // pendings, users, searching are accessed via mapState directly from state.
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

        request(userId) {
            return friendsApi.request(userId).then((response) => {
                // FRIENDS_SET_REQUEST
                this.users = this.users.map((item) => {
                    if (item.id === userId) {
                        item.state = 'pending';
                    }
                    return item;
                });
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

        searchUsers(value) {
            if (value.length > 0) {
                this.users = null;
                if (this.searching) {
                    this.searching.abort();
                }
                const promise = userApi.list({ value }).then((response) => {
                    this.users = response.data;
                    this.searching = null;
                    return Promise.resolve(response.data);
                });
                this.searching = promise;
                return promise;
            } else {
                this.users = [];
                return Promise.resolve();
            }
        }
    }
});
