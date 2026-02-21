import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { FriendsApi, UserApi } from '../services/api';
import { usePagination } from '../composables/usePagination';

const friendsApi = new FriendsApi();
const userApi = new UserApi();

export const useFriendsStore = defineStore('friends', () => {
    const pagination = usePagination('friends', ({ data }) => {
        return friendsApi.index(data);
    });

    const pendings = ref(null);
    const users = ref([]);
    const searching = ref(null);

    function fetchPending() {
        pendings.value = null;
        return friendsApi.pending().then((response) => {
            pendings.value = response.data;
            return Promise.resolve(response.data);
        });
    }

    function request(userId) {
        return friendsApi.request(userId).then(() => {
            users.value = users.value.map((item) => {
                if (item.id === userId) {
                    item.state = 'pending';
                }
                return item;
            });
            return Promise.resolve();
        });
    }

    function accept(userId) {
        return friendsApi.accept(userId).then(() => {
            pendings.value = pendings.value.filter((item) => item.id !== userId);
        });
    }

    function reject(userId) {
        return friendsApi.reject(userId).then(() => {
            pendings.value = pendings.value.filter((item) => item.id !== userId);
        });
    }

    function deleteFriend(userId) {
        return friendsApi.delete(userId).then(() => {
            if (pagination.items.value) {
                pagination.items.value = pagination.items.value.filter((item) => item.id !== userId);
            }
        });
    }

    function searchUsers(value) {
        if (value.length > 0) {
            users.value = null;
            if (searching.value) {
                searching.value.abort();
            }
            const promise = userApi.list({ value }).then((response) => {
                users.value = response.data;
                searching.value = null;
                return Promise.resolve(response.data);
            });
            searching.value = promise;
            return promise;
        } else {
            users.value = [];
            return Promise.resolve();
        }
    }

    return {
        friends: pagination.items,
        friendsMorePage: pagination.morePage,
        friendsSearchParam: pagination.searchParam,
        friendsSearch: pagination.search,
        pendings,
        users,
        searching,
        fetchPending,
        request,
        accept,
        reject,
        deleteFriend,
        searchUsers
    };
});
