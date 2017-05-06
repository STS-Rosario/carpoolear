import TaggedApi from '../../classes/TaggedApi';

class CarApi extends TaggedApi {

    show (id) {
        return this.get('/api/cars/' + id);
    }

    index (data = {}) {
        return this.get('/api/cars');
    }

    create (data = {}) {
        return this.post('/api/cars', data);
    }

    update (data = {}) {
        return this.put('/api/cars/' + data.id, data);
    }

    delete (data = {}) {
        return this.delete('/api/cars/' + data.id, data);
    }

}

export { CarApi as default };
