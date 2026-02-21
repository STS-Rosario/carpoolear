import { ref } from 'vue';
import { defineStore } from 'pinia';
import { NotificationApi } from '../services/api';

const notificationApi = new NotificationApi();

export const useNotificationsStore = defineStore('notifications', () => {
    const list = ref(null);
    const count = ref(0);

    function index(data = {}) {
        list.value = null;
        return notificationApi
            .index(data)
            .then((response) => {
                list.value = response.data;
                return Promise.resolve(response.data);
            })
            .catch(() => {
                return Promise.reject(new Error());
            });
    }

    function fetchCount() {
        return notificationApi
            .count()
            .then((response) => {
                count.value = response.data;
                return Promise.resolve(response.data);
            })
            .catch(() => {
                return Promise.reject(new Error());
            });
    }

    function add() {
        count.value = count.value + 1;
    }

    function remove(id) {
        const idx = list.value.findIndex((item) => item.id === id);
        if (idx >= 0) {
            list.value.splice(idx, 1);
        }
    }

    return {
        list,
        count,
        index,
        fetchCount,
        add,
        remove
    };
});
