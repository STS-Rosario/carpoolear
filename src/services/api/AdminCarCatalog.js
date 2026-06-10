import TaggedApi from '../../classes/TaggedApi';

class AdminCarCatalogApi extends TaggedApi {
    colors() {
        return this.get('/api/admin/car-colors');
    }

    createColor(data) {
        return this.post('/api/admin/car-colors', data);
    }

    updateColor(id, data) {
        return this.put('/api/admin/car-colors/' + id, data);
    }

    deleteColor(id) {
        return this.delete('/api/admin/car-colors/' + id);
    }

    brands() {
        return this.get('/api/admin/car-brands');
    }

    createBrand(data) {
        return this.post('/api/admin/car-brands', data);
    }

    updateBrand(id, data) {
        return this.put('/api/admin/car-brands/' + id, data);
    }

    deleteBrand(id) {
        return this.delete('/api/admin/car-brands/' + id);
    }

    models(brandId) {
        return this.get('/api/admin/car-brands/' + brandId + '/models');
    }

    createModel(brandId, data) {
        return this.post('/api/admin/car-brands/' + brandId + '/models', data);
    }

    updateModel(brandId, modelId, data) {
        return this.put(
            '/api/admin/car-brands/' + brandId + '/models/' + modelId,
            data
        );
    }

    deleteModel(brandId, modelId) {
        return this.delete(
            '/api/admin/car-brands/' + brandId + '/models/' + modelId
        );
    }

    triggerSync() {
        return this.post('/api/admin/car-catalog/sync');
    }

    syncStatus() {
        return this.get('/api/admin/car-catalog/sync-status');
    }
}

export default AdminCarCatalogApi;
