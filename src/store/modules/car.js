import {CarApi} from '../../services/api';
import * as types from '../mutation-types';

/* eslint-disable no-undef */

// initial state
let carApi = new CarApi();

const state = {
    cars: null
};

// getters
const getters = {
    cars: state => state.cars
};

// actions
const actions = {
    index (store, data = {}) {
        return carApi.index(data).then(response => {
            store.commit(types.CARS_SET, response.cars ? response.cars : []);
        }).catch(err => {
            console.log(err);
        });
    },

    create (store, data = {}) {
        return carApi.create(data).then(response => {
            store.commit(types.CARS_ADD, response.data);
            return Promise.resolve(response.data);
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    },

    update (store, data = {}) {
        return carApi.update(data).then(response => {
            store.commit(types.CARS_UPDATE, response.data);
            return Promise.resolve(response.data);
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    },

    delete (store, data = {}) {
        return carApi.delete(data).then(response => {
            store.commit(types.CARS_DELETE, data);
            return Promise.resolve();
        }).catch(err => {
            if (err) {
                return Promise.reject(err);
            }
        });
    }
};

// mutations
const mutations = {
    [types.CARS_SET] (state, items) {
        state.cars = items;
    },
    [types.CARS_ADD] (state, car) {
        if (!state.cars) {
            state.cars = [];
        }
        state.cars.push(car);
    },
    [types.CARS_UPDATE] (state, car) {
        for (let i = 0; i < state.cars.length; i++) {
            if (state.cars[i].id === car.id) {
                state.cars[i] = car;
            }
        }
    },
    [types.CARS_DELETE] (state, car) {
        state.cars = state.cars.filter(item => item.id === car.id);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

