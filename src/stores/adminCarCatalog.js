import { defineStore } from 'pinia';
import AdminCarCatalogApi from '../services/api/AdminCarCatalog';

const api = new AdminCarCatalogApi();

export const useAdminCarCatalogStore = defineStore('adminCarCatalog', {
    state: () => ({
        colors: [],
        brands: [],
        models: [],
        syncStatus: null
    }),
    actions: {
        fetchColors() {
            return api.colors().then((response) => {
                this.colors = response.data || [];
                return this.colors;
            });
        },
        createColor(data) {
            return api.createColor(data).then((response) => {
                this.colors.push(response.data);
                return response.data;
            });
        },
        updateColor(id, data) {
            return api.updateColor(id, data).then((response) => {
                const index = this.colors.findIndex((row) => row.id === id);
                if (index >= 0) {
                    this.colors[index] = response.data;
                }
                return response.data;
            });
        },
        deleteColor(id) {
            return api.deleteColor(id).then(() => {
                this.colors = this.colors.filter((row) => row.id !== id);
            });
        },
        fetchBrands() {
            return api.brands().then((response) => {
                this.brands = response.data || [];
                return this.brands;
            });
        },
        createBrand(data) {
            return api.createBrand(data).then((response) => {
                this.brands.push(response.data);
                return response.data;
            });
        },
        fetchModels(brandId) {
            return api.models(brandId).then((response) => {
                this.models = response.data || [];
                return this.models;
            });
        },
        createModel(brandId, data) {
            return api.createModel(brandId, data).then((response) => {
                this.models.push(response.data);
                return response.data;
            });
        },
        deleteModel(brandId, modelId) {
            return api.deleteModel(brandId, modelId).then(() => {
                this.models = this.models.filter((row) => row.id !== modelId);
            });
        },
        triggerSync() {
            return api.triggerSync();
        },
        fetchSyncStatus() {
            return api.syncStatus().then((response) => {
                this.syncStatus = response.data || null;
                return this.syncStatus;
            });
        }
    }
});
