import TaggedApi from '../../classes/TaggedApi';

class ReferencesApi extends TaggedApi {
    create (data) {
        return this.post('/api/references', data);
    }
}

export { ReferencesApi as default };
