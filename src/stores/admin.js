import { defineStore } from 'pinia';
import { AdminApi } from '../services/api';
import { useAuthStore } from './auth';

const adminApi = new AdminApi();

export const useAdminStore = defineStore('admin', () => {
    function adminUpdate(data) {
        return adminApi
            .adminUpdate(data)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(({ data, status }) => {
                console.log(data, status);
                return Promise.reject(data);
            });
    }

    function searchUsers(name) {
        const authStore = useAuthStore();
        if (authStore.user && authStore.user.is_admin) {
            return adminApi.searchUsers({ name: name });
        }
    }

    function getTrips() {
        return adminApi.getTrips();
    }

    function getSeats() {
        return adminApi.getSeats();
    }

    function getUserStats() {
        return adminApi.getUserStats();
    }

    return {
        adminUpdate,
        searchUsers,
        getTrips,
        getSeats,
        getUserStats
    };
});
