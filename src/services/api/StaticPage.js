import TaggedApi from '../../classes/TaggedApi';

class StaticPageApi extends TaggedApi {
    getPage(page) {
        return this.get('/api/static-pages/' + page, {});
    }
}

export default StaticPageApi;
