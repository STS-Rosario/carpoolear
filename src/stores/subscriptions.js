import { defineStore } from 'pinia';
import { SubscriptionApi } from '../services/api';

const subscriptionApi = new SubscriptionApi();

export const useSubscriptionsStore = defineStore('subscriptions', {
    state: () => ({
        subscriptions: null
    }),

    getters: {
        // 'subscriptions' is accessed via mapState directly from state — no redundant getter needed.
    },

    actions: {
        index(data = {}) {
            return subscriptionApi
                .index(data)
                .then((response) => {
                    this.subscriptions = response.data ? response.data : [];
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        create(data = {}) {
            return subscriptionApi
                .create(data)
                .then((response) => {
                    // SUBSCRIPTION_ADD
                    if (!this.subscriptions) {
                        this.subscriptions = [];
                    }
                    this.subscriptions.push(response.data);
                    return Promise.resolve(response.data);
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        },

        update(data = {}) {
            return subscriptionApi
                .update(data)
                .then((response) => {
                    // SUBSCRIPTION_UPDATE
                    for (let i = 0; i < this.subscriptions.length; i++) {
                        if (this.subscriptions[i].id === response.data.id) {
                            this.subscriptions[i] = response.data;
                        }
                    }
                    return Promise.resolve(response.data);
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        },

        remove(data = {}) {
            return subscriptionApi
                .remove(data)
                .then((response) => {
                    // SUBSCRIPTION_DELETE
                    this.subscriptions = this.subscriptions.filter(
                        (item) => item.id !== data.id
                    );
                    return Promise.resolve();
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        }
    }
});
