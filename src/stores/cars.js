import { ref } from 'vue';
import { defineStore } from 'pinia';
import { CarApi } from '../services/api';

const carApi = new CarApi();

export const useCarsStore = defineStore('cars', () => {
    const cars = ref(null);

    function index(data = {}) {
        return carApi
            .index(data)
            .then((response) => {
                const result = Array.isArray(response)
                    ? response
                    : response.data || [];
                cars.value = result;
            })
            .catch((err) => {
                console.error('CarApi index error:', err);
            });
    }

    function create(data = {}) {
        return carApi
            .create(data)
            .then((response) => {
                if (!cars.value) {
                    cars.value = [];
                }
                cars.value.push(response.data);
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    function update(data = {}) {
        return carApi
            .update(data)
            .then((response) => {
                for (let i = 0; i < cars.value.length; i++) {
                    if (cars.value[i].id === response.data.id) {
                        cars.value[i] = response.data;
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    function remove(data = {}) {
        return carApi
            .delete(data)
            .then(() => {
                cars.value = cars.value.filter((item) => item.id !== data.id);
                return Promise.resolve();
            })
            .catch((err) => {
                if (err) return Promise.reject(err);
            });
    }

    return {
        cars,
        index,
        create,
        update,
        remove
    };
});
