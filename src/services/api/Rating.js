import TaggedApi from '../../classes/TaggedApi';

class RateApi extends TaggedApi {

    index (id, data = {}) {
        console.log(data);
        if (id) {
            return this.get('/api/users/' + id + '/ratings', data);
        } else {
            return this.get('/api/users/ratings', data);
        }
    }

    pending (data) {
        return this.get('/api/users/ratings/pending', data);
    }

    // data = {comment, rating, hash = null }
    rate (tripId, userId, data) {
        return this.post('/api/trips/' + tripId + '/rate/' + userId, data);
    }

    reply (tripId, userId, data) {
        return this.post('/api/trips/' + tripId + '/reply/' + userId, data);
    }

}

export { RateApi as default };
