import TaggedApi from '../../classes/TaggedApi';

class HealthApi extends TaggedApi {
    check() {
        return this.get('/api/health');
    }
}

export default HealthApi;
