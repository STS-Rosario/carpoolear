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

    changeSeats (data) {
        // data.increment = +1 / -1
        return this.post('/api/trips/' + data.id + '/changeSeats', data);
    }

    remove (id) {
        return this.delete('/api/trips/' + id);
    }

    show (id) {
        return this.get('/api/trips/' + id);
    }

    myTrips (asDriver) {
        return this.get('/api/users/get-trips', { 'as_driver': asDriver });
    }

    myOldTrips (asDriver) {
        return this.get('/api/users/get-old-trips', { 'as_driver': asDriver });
    }

    getTrips (id, asDriver) {
        return this.get('/api/users/get-trips', { 'as_driver': asDriver, 'user_id': id });
    }

    getOldTrips (id, asDriver) {
        return this.get('/api/users/get-old-trips', { 'as_driver': asDriver, 'user_id': id });
    }

    userTrips (id, asDriver) {
        return this.get('/api/trips', { 'user_id': id, 'as_driver': asDriver });
    }

    autocomplete (name, country, multicountry) {
        return this.get('/api/trips/autocomplete', { 'name': name, 'country': country, 'multicountry': multicountry });
    }

    price (data) {
        return this.post('/api/trips/price', data);
    }

    changeVisibility (data) {
        return this.post('/api/trips/' + data.id + '/change-visibility', data);
    }
}

export { TripApi as default };
