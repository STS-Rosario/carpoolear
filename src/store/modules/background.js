import * as types from '../mutation-types';

const state = {
    background_style: 'white'
};

const getters = {
    backgroundStyle: state => state.background_style
};

const actions = {
    setBackgroundStyle (store, style) {
        store.commit(types.BACKGROUND_SET_STYLE, style);
    }
};

const mutations = {
    [types.BACKGROUND_SET_STYLE] (state, style) {
        console.log('mutating');
        state.background_style = style;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
