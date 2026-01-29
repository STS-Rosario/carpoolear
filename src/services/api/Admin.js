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

    getBannedUsersList(params = {}) {
        return this.get('/api/admin/banned-users', params);
    }

    deleteUser(userId) {
        return this.post(`/api/admin/users/${userId}/delete`, {});
    }

    anonymizeUser(userId) {
        return this.post(`/api/admin/users/${userId}/anonymize`, {});
    }

    banAndAnonymizeUser(userId, note = '') {
        return this.post(`/api/admin/users/${userId}/ban-and-anonymize`, { note });
    }

    getManualIdentityValidations() {
        return this.get('/api/admin/manual-identity-validations', {});
    }

    getManualIdentityValidation(id) {
        return this.get('/api/admin/manual-identity-validations/' + id, {});
    }

    reviewManualIdentityValidation(id, action, note) {
        return this.post(
            '/api/admin/manual-identity-validations/' + id + '/review',
            {
                action,
                note
            }
        );
    }

    purgeManualIdentityValidation(id) {
        return this.post(
            '/api/admin/manual-identity-validations/' + id + '/purge',
            {}
        );
    }

    getMercadoPagoRejectedValidations() {
        return this.get('/api/admin/mercado-pago-rejected-validations', {});
    }

    getMercadoPagoRejectedValidation(id) {
        return this.get(
            '/api/admin/mercado-pago-rejected-validations/' + id,
            {}
        );
    }

    approveMercadoPagoRejectedValidation(id) {
        return this.post(
            '/api/admin/mercado-pago-rejected-validations/' + id + '/approve',
            {}
        );
    }
}

export { AdminApi as default };
