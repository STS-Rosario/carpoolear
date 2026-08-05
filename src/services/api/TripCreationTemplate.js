import TaggedApi from '../../classes/TaggedApi';

class TripCreationTemplateApi extends TaggedApi {
    index() {
        return this.get('/api/trip-creation-templates');
    }

    store(data = {}) {
        return this.post('/api/trip-creation-templates', data);
    }

    show(name) {
        return this.get('/api/trip-creation-templates/' + encodeURIComponent(name));
    }
}

export { TripCreationTemplateApi as default };
