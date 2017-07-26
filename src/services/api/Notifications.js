import TaggedApi from '../../classes/TaggedApi';

class NotificationApi extends TaggedApi {

    index (data = {}) {
        return this.get('/api/notifications', data);
    }

    count () {
        return this.get('/api/notifications/count');
    }

    delete (id) {
        return this.delete('/api/notifications/' + id);
    }

}

export { NotificationApi as default };
