import TaggedApi from '../../classes/TaggedApi';

class ReferencesApi extends TaggedApi {
    create(data) {
        return this.post('/api/references', data);
    }

    reply(userId, data) {
        return this.post('/api/references/reply/' + userId, data);
    }
}

export { ReferencesApi as default };
