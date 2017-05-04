import TaggedApi from '../../classes/TaggedApi';

class ConversationApi extends TaggedApi {

    list (data = {}) {
        return this.get('/api/conversations', data);
    }

    userList (data) {
        return this.get('/api/conversations/user-list', data);
    }

    create (userId) {
        return this.post('/api/conversations', {to: userId});
    }

    getMessages (id, data) {
        return this.get('/api/conversations/' + id, data);
    }

    getUsers (id) {
        return this.get('/api/conversations/' + id + '/users', {});
    }

    send (id, text) {
        return this.post('/api/conversations/' + id + '/send', {message: text});
    }

}

export { ConversationApi as default };
