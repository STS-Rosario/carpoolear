import TaggedApi from '../../classes/TaggedApi';

class FriendApi extends TaggedApi {
    index (data = {}) {
        return this.get('/api/friends', data);
    }

    pending (data = {}) {
        return this.get('/api/friends/pedings', data);
    }

    make (verb, userId) {
        return this.post('/api/friends/' + verb + '/' + userId, {});
    }

    accept (userId) {
        return this.make('accept', userId);
    }

    delete (userId) {
        return this.make('delete', userId);
    }

    reject (userId) {
        return this.make('reject', userId);
    }

    request (userId) {
        return this.make('request', userId);
    }
}

export { FriendApi as default };
