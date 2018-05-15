import TaggedApi from '../../classes/TaggedApi';

class ConversationApi extends TaggedApi {

    list (data = {}) {
        return this.get('/api/conversations', data);
    }

    show (id) {
        return this.get('/api/conversations/show/' + id);
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

    sendToAll (data) {
        return this.post('/api/conversations/multi-send', data);
    }

    unread (data = {}) {
        return this.get('/api/conversations/unread', data);
    }

}

export { ConversationApi as default };
