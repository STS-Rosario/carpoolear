import { defineStore } from 'pinia';
import { NotificationApi } from '../services/api';

const notificationApi = new NotificationApi();
let countInFlight = null;

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
            if (countInFlight) {
                return countInFlight;
            }

            countInFlight = notificationApi
                .count()
                .then((response) => {
                    this.count = response.data;
                    return Promise.resolve(response.data);
                })
                .catch(() => {
                    return Promise.reject(new Error());
                })
                .finally(() => {
                    countInFlight = null;
                });

            return countInFlight;
        },

        add() {
            this.count = this.count + 1;
            console.log(this.$state);
        }
    }
});
