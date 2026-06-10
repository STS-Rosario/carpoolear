import TaggedApi from '../../classes/TaggedApi';

class CarCatalogApi extends TaggedApi {
    brands() {
        return this.get('/api/car-brands');
    }

    models(brandId) {
        return this.get('/api/car-brands/' + brandId + '/models');
    }

    colors() {
        return this.get('/api/car-colors');
    }
}

export default CarCatalogApi;
