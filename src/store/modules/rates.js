import {RateApi} from '../../services/api';
import * as types from '../mutation-types';

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
    }
};

// mutations
const mutations = {
    [types.RATES_SET] (state, rates) {
        state.pending_rates = rates;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
