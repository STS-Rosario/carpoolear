import { defineStore } from 'pinia';
import { NotificationApi } from '../services/api';

const notificationApi = new NotificationApi();

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        list: null,
        count: 0
    }),

    getters: {
        index: (state) => state.list
        // 'count' is accessed via mapState directly from state.
    },

    actions: {
        indexAction(data = {}) {
            this.list = null;
            return notificationApi
                .index(data)
                .then((response) => {
                    this.list = response.data;
                    return Promise.resolve(response.data);
                })
                .catch(() => {
                    return Promise.reject(new Error());
                });
        },

        countAction() {
            return notificationApi
                .count()
                .then((response) => {
                    this.count = response.data;
                    return Promise.resolve(response.data);
                })
                .catch(() => {
                    return Promise.reject(new Error());
                });
        },

        add() {
            this.count = this.count + 1;
            console.log(this.$state);
        }
    }
});
