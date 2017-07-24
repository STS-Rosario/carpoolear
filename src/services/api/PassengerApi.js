import TaggedApi from '../../classes/TaggedApi';

class PassengerApi extends TaggedApi {

    allRequest () {
        return this.get('/api/users/requests', {});
    }

    tripRequest (id) {
        return this.get('/api/trips/' + id + '/requests', {});
    }

    make (id) {
        return this.post('/api/trips/' + id + '/requests', {});
    }

    takeDesision (id, userId, verb) {
        return this.post('/api/trips/' + id + '/requests/' + userId + '/' + verb, {});
    }

    accept (id, userId) {
        return this.takeDesision(id, userId, 'accept');
    }

    cancel (id, userId) {
        return this.takeDesision(id, userId, 'cancel');
    }

    reject (id, userId) {
        return this.takeDesision(id, userId, 'reject');
    }
}

export { PassengerApi as default };
