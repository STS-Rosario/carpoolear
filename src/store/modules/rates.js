import { RateApi } from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';
import moment from 'moment';

let rateApi = new RateApi();

// initial state
const state = {
    pending_rates: null
};

// getters
const getters = {
    pendingRates: state => state.pending_rates
};

// actions
const actions = {
    pendingRates (store) {
        return rateApi.pending(null).then(response => {
            store.commit(types.RATES_SET, response.data);
        });
    },

    vote (store, data) {
        let obj = {
            comment: data.comment,
            rating: data.rating
        };
        return rateApi.rate(data.trip_id, data.user_id, obj).then(response => {
            store.commit(types.RATES_REMOVE, data.id);
            return Promise.resolve();
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    reply (store, data) {
        let obj = {
            comment: data.comment
        };
        return rateApi.reply(data.trip_id, data.user_id, obj).then(response => {
            data.reply_comment_created_at = moment(new Date()).format();
            globalStore.commit('profile/' + types.PROFILE_SET_REPLY, data);
            return Promise.resolve();
        }).catch(error => {
            return Promise.reject(error);
        });
    }

};

// mutations
const mutations = {
    [types.RATES_SET] (state, rates) {
        state.pending_rates = rates;
    },

    [types.RATES_REMOVE] (state, id) {
        var index = state.pending_rates.findIndex(item => item.id === id);
        if (index >= 0) {
            state.pending_rates.splice(index, 1);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
