import TaggedApi from '../../classes/TaggedApi';

class ChangelogApi extends TaggedApi {
    fetchForVersion(version) {
        return this.get('/api/changelog', { version });
    }

    adminList() {
        return this.get('/api/admin/changelogs');
    }

    adminShow(id) {
        return this.get('/api/admin/changelogs/' + id);
    }

    adminCreate(data) {
        return this.post('/api/admin/changelogs', data);
    }

    adminUpdate(id, data) {
        return this.put('/api/admin/changelogs/' + id, data);
    }

    adminDelete(id) {
        return this.delete('/api/admin/changelogs/' + id);
    }
}

export default ChangelogApi;
