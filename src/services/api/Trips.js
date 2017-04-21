import TaggedApi from '../../classes/TaggedApi';

class TripApi extends TaggedApi {

    search (data) {
        return this.get('/api/trips', data);
    }

    create (data) {
        return this.post('/api/trips', data);
    }

    update (data) {
        return this.put('/api/trips/' + data.id, data);
    }

    delete (data) {
        return this.delete('/api/trips/' + data.id);
    }

}

export { TripApi as default };
