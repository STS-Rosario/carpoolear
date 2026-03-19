import { defineStore } from 'pinia';
import { CarApi } from '../services/api';

const carApi = new CarApi();

export const useCarsStore = defineStore('cars', {
    state: () => ({
        cars: null
    }),

    getters: {
        // 'cars' is accessed via mapState directly from state — no redundant getter needed.
    },

    actions: {
        index(data = {}) {
            return carApi
                .index(data)
                .then((response) => {
                    const cars = Array.isArray(response)
                        ? response
                        : response.data || [];
                    this.cars = cars;
                })
                .catch((err) => {
                    console.error('CarApi index error:', err);
                });
        },

        create(data = {}) {
            return carApi
                .create(data)
                .then((response) => {
                    // CARS_ADD
                    if (!this.cars) {
                        this.cars = [];
                    }
                    this.cars.push(response.data);
                    return Promise.resolve(response.data);
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        },

        update(data = {}) {
            return carApi
                .update(data)
                .then((response) => {
                    // CARS_UPDATE
                    for (let i = 0; i < this.cars.length; i++) {
                        if (this.cars[i].id === response.data.id) {
                            this.cars[i] = response.data;
                        }
                    }
                    return Promise.resolve(response.data);
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        },

        delete(data = {}) {
            return carApi
                .delete(data)
                .then((response) => {
                    // CARS_DELETE - bug fixed: original used === instead of !==
                    this.cars = this.cars.filter(
                        (item) => item.id !== data.id
                    );
                    return Promise.resolve();
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        }
    }
});
