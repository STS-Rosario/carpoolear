import TaggedApi from '../../classes/TaggedApi';

class RateApi extends TaggedApi {

    pending (data) {
        return this.get('/api/users/ratings/pending', data);
    }

}

export { RateApi as default };
