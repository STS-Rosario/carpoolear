import TaggedApi from '../../classes/TaggedApi';

class RateApi extends TaggedApi {

    index (data) {
        return this.get('/api/users/ratings', data);
    }

    pending (data) {
        return this.get('/api/users/ratings/pending', data);
    }

    rate (tripId, userId, data) {
        return this.post('/api/trips/' + tripId + '/rate/' + userId, data);
    }

    replay (tripId, userId, data) {
        return this.post('/api/trips/' + tripId + '/rate/' + userId, data);
    }

}

export { RateApi as default };
