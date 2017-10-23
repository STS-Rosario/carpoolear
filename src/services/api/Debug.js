import TaggedApi from '../../classes/TaggedApi';

class DebugApi extends TaggedApi {

    log (data) {
        return this.post('/api/log', data);
    }

}

export { DebugApi as default };
