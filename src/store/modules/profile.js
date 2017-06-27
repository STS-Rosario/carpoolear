import * as types from '../mutation-types';
import {UserApi, RateApi} from '../../services/api';
import * as pagination from '../pagination';

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

    setUserByID (store, id) {
        return userApi.show(id).then((response) => {
            store.commit(types.PROFILE_SET_USER, response.data);
            store.dispatch('ratesSearch');
            return Promise.resolve(response.data);
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    ...pagination.makeActions('rates', ({store, data}) => {
        return rateApi.index(store.state.user.id, data);
    })

};

const mutations = {
    [types.PROFILE_SET_USER] (state, user) {
        state.user = user;
    },
    ...pagination.makeMutations('rates')
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
