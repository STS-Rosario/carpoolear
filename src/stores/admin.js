import { defineStore } from 'pinia';
import { AdminApi } from '../services/api';

const adminApi = new AdminApi();

export const useAdminStore = defineStore('admin', {
    actions: {
        adminUpdate(data) {
            return adminApi
                .adminUpdate(data)
                .then((response) => {
                    return Promise.resolve(response.data);
                })
                .catch(({ data, status }) => {
                    console.log(data, status);
                    return Promise.reject(data);
                });
        },

        searchUsers(name) {
            // Cross-module: check auth user for admin
            const { useAuthStore } = require('./auth');
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.is_admin) {
                return adminApi.searchUsers({ name: name });
            }
        },

        getTrips() {
            return adminApi.getTrips();
        },

        getSeats() {
            return adminApi.getSeats();
        },

        getUserStats() {
            return adminApi.getUserStats();
        }
    }
});
