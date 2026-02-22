import { ref } from 'vue';
import { defineStore } from 'pinia';
import { SubscriptionApi } from '../services/api';

const subscriptionApi = new SubscriptionApi();

export const useSubscriptionsStore = defineStore('subscriptions', () => {
    const subscriptions = ref(null);

    function index(data = {}) {
        return subscriptionApi
            .index(data)
            .then((response) => {
                subscriptions.value = response.data ? response.data : [];
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function create(data = {}) {
        return subscriptionApi
            .create(data)
            .then((response) => {
                if (!subscriptions.value) {
                    subscriptions.value = [];
                }
                subscriptions.value.push(response.data);
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    function update(data = {}) {
        return subscriptionApi
            .update(data)
            .then((response) => {
                if (subscriptions.value) {
                    for (let i = 0; i < subscriptions.value.length; i++) {
                        if (subscriptions.value[i].id === response.data.id) {
                            subscriptions.value[i] = response.data;
                        }
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    function remove(data = {}) {
        return subscriptionApi
            .remove(data)
            .then(() => {
                if (subscriptions.value) {
                    subscriptions.value = subscriptions.value.filter(
                        (item) => item.id !== data.id
                    );
                }
                return Promise.resolve();
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    return {
        subscriptions,
        index,
        create,
        update,
        remove
    };
});
