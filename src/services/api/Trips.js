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

    remove (id) {
        return this.delete('/api/trips/' + id);
    }

    show (id) {
        return this.get('/api/trips/' + id);
    }

    myTrips (asDriver) {
        return this.get('/api/users/my-trips', { 'as_driver': asDriver });
    }

    userTrips (id, asDriver) {
        return this.get('/api/trips', { 'user_id': id, 'as_driver': asDriver });
    }

}

export { TripApi as default };
