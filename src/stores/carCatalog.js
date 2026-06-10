import { defineStore } from 'pinia';
import CarCatalogApi from '../services/api/CarCatalog';

const carCatalogApi = new CarCatalogApi();

export const useCarCatalogStore = defineStore('carCatalog', {
    state: () => ({
        brands: [],
        colors: [],
        modelsByBrandId: {}
    }),

    actions: {
        async fetchBrands() {
            if (this.brands.length) {
                return this.brands;
            }

            const response = await carCatalogApi.brands();
            this.brands = response.data || [];
            return this.brands;
        },

        async fetchColors() {
            if (this.colors.length) {
                return this.colors;
            }

            const response = await carCatalogApi.colors();
            this.colors = response.data || [];
            return this.colors;
        },

        async fetchModels(brandId) {
            const key = String(brandId);
            if (this.modelsByBrandId[key]) {
                return this.modelsByBrandId[key];
            }

            const response = await carCatalogApi.models(brandId);
            this.modelsByBrandId[key] = response.data || [];
            return this.modelsByBrandId[key];
        }
    }
});
