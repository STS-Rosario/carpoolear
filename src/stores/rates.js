import { defineStore } from 'pinia';
import { RateApi } from '../services/api';
import dayjs from '../dayjs';

const rateApi = new RateApi();

export const useRatesStore = defineStore('rates', {
    state: () => ({
        pending_rates: null
    }),

    getters: {
        pendingRates: (state) => state.pending_rates
    },

    actions: {
        pendingRatesAction() {
            return rateApi.pending(null).then((response) => {
                this.pending_rates = response.data;
            });
        },

        vote(data) {
            const obj = {
                comment: data.comment,
                rating: data.rating
            };
            return rateApi
                .rate(data.trip_id, data.user_id, obj)
                .then((response) => {
                    // RATES_REMOVE
                    const index = this.pending_rates.findIndex(
                        (item) => item.id === data.id
                    );
                    if (index >= 0) {
                        this.pending_rates.splice(index, 1);
                    }
                    return Promise.resolve();
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        reply(data) {
            const obj = {
                comment: data.comment
            };
            return rateApi
                .reply(data.trip_id, data.user_id, obj)
                .then((response) => {
                    data.reply_comment_created_at = dayjs(new Date()).format();
                    // Cross-module: call profile store's setReply
                    const { useProfileStore } = require('./profile');
                    useProfileStore().setReply(data);
                    return Promise.resolve();
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
    }
});
