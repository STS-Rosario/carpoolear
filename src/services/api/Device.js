import TaggedApi from '../../classes/TaggedApi';

class DeviceApi extends TaggedApi {

    index () {
        return this.get('/api/devices');
    }

    update (id, data) {
        return this.put('/api/devices/' + id, data);
    }

    delete (id) {
        return this.delete('/api/devices/' + id);
    }

    create (data) {
        return this.post('/api/devices', data);
    }
}

export { DeviceApi as default };
