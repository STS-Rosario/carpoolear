import { AdminApi } from '../../services/api';
import globalStore from '../index';

let adminApi = new AdminApi();

function adminUpdate (store, data) {
    return adminApi.adminUpdate(data).then((response) => {
        return Promise.resolve(response.data);
    }).catch(({ data, status }) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

function searchUsers (store, name) {
    if (globalStore.getters['auth/user'].is_admin) {
        return adminApi.searchUsers({ name: name });
    }
}

function getTrips (store) {
    return adminApi.getTrips();
}

function getSeats (store) {
    return adminApi.getSeats();
}

function getUserStats (store) {
    return adminApi.getUserStats();
}
const actions = {
    searchUsers,
    adminUpdate,
    getTrips,
    getSeats,
    getUserStats
};

// const state = {
// };

// // getters
// const getters = {
// };

// const mutations = {
// };

export default {
    namespaced: true,
    // state,
    // getters,
    // mutations,
    actions
};
