import TaggedApi from '../../classes/TaggedApi';

class AdminApi extends TaggedApi {
    // modify user data.user with data
    adminUpdate(data) {
        return this.put('/api/users/modify', data);
    }

    // search users by name or email
    searchUsers(data) {
        return this.get('/api/users/search', data);
    }

    getTrips() {
        return this.get('/api/data/trips');
    }

    getSeats() {
        return this.get('/api/data/seats');
    }

    getUserStats() {
        return this.get('/api/data/users');
    }

    getAccountDeleteList() {
        return this.get('/api/admin/users/account-delete-list');
    }

    updateAccountDelete(data) {
        return this.post('/api/admin/users/account-delete-update', data);
    }
}

export { AdminApi as default };
