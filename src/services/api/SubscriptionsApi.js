import TaggedApi from '../../classes/TaggedApi';

class SubscriptionsApi extends TaggedApi {

    show (id) {
        return this.get('/api/subscriptions/' + id);
    }

    index (data = {}) {
        return this.get('/api/subscriptions');
    }

    create (data = {}) {
        return this.post('/api/subscriptions', data);
    }

    update (data = {}) {
        return this.put('/api/subscriptions/' + data.id, data);
    }

    delete (data = {}) {
        return this.delete('/api/subscriptions/' + data.id, data);
    }

}

export { SubscriptionsApi as default };
