import * as types from '../mutation-types';
import { UserApi, RateApi } from '../../services/api';
import * as pagination from '../pagination';
import globalStore from '../index';

let userApi = new UserApi();
let rateApi = new RateApi();

const state = {
    user: null,
    ...pagination.makeState('rates')
};

const getters = {
    user: state => state.user,
    ...pagination.makeGetters('rates')
};

const actions = {
    setUser (store, user) {
        store.commit(types.PROFILE_SET_USER, user);
        store.dispatch('ratesSearch');
    },

    setUserByID (store, { id, userProfile }) {
        if (userProfile) {
            store.commit(types.PROFILE_SET_USER, userProfile);
        }
        return userApi.show(id).then((response) => {
            store.commit(types.PROFILE_SET_USER, response.data);
            store.dispatch('ratesSearch');
            return Promise.resolve(response.data);
        }).catch((error) => {
            return Promise.reject(error);
        });
    },
    registerDonation (store, data) {
        return userApi.registerDonation(data).then((response) => {
            console.log('registerDonation', response);
            globalStore.commit('auth/' + types.DONATION_INTENT_PUSH, response.donation);
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    changeProperty (store, data) {
        return userApi.changeProperty(data).then((response) => {
            console.log('changeProperty', response);
            // store.commit(types.PROFILE_SET_USER, response.data);
            globalStore.commit('auth/' + types.AUTH_SET_USER, response.user);
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    ...pagination.makeActions('rates', ({ store, data }) => {
        // TODO: Pagination not working
        data.page_size = 200;
        return rateApi.index(store.state.user.id, data);
    })

};

const mutations = {
    ...pagination.makeMutations('rates'),

    [types.PROFILE_SET_USER] (state, user) {
        state.user = user;
    },

    [types.PROFILE_SET_REPLY] (state, rate) {
        state.rates.forEach((item) => {
            if (rate.trip_id === item.trip.id && rate.user_id === item.from.id) {
                rate.reply_comment = item.comment;
                rate.reply_comment_created_at = item.reply_comment_created_at;
            }
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
