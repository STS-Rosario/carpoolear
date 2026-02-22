import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RateApi } from '../services/api';
import { useProfileStore } from './profile';
import moment from 'moment';

const rateApi = new RateApi();

export const useRatesStore = defineStore('rates', () => {
    const pendingRates = ref(null);

    function fetchPendingRates() {
        return rateApi.pending(null).then((response) => {
            pendingRates.value = response.data;
        });
    }

    function vote(data) {
        const obj = {
            comment: data.comment,
            rating: data.rating
        };
        return rateApi
            .rate(data.trip_id, data.user_id, obj)
            .then(() => {
                if (!pendingRates.value) return Promise.resolve();
                const index = pendingRates.value.findIndex((item) => item.id === data.id);
                if (index >= 0) {
                    pendingRates.value.splice(index, 1);
                }
                return Promise.resolve();
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function reply(data) {
        const obj = {
            comment: data.comment
        };
        return rateApi
            .reply(data.trip_id, data.user_id, obj)
            .then(() => {
                data.reply_comment_created_at = moment(new Date()).format();
                try {
                    const profileStore = useProfileStore();
                    profileStore.setReply(data);
                } catch (e) {
                    // profile store may not be initialized
                }
                return Promise.resolve(data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    return {
        pendingRates,
        fetchPendingRates,
        vote,
        reply
    };
});
