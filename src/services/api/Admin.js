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

    /** Paginated admin user list (newest first). Params: page, per_page, name (optional) */
    getUsersList(params = {}) {
        return this.get('/api/admin/users', params);
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

    clearIdentityValidation(userId) {
        return this.post(
            '/api/admin/users/' + userId + '/clear-identity-validation',
            {}
        );
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

    updateManualIdentityValidationPrivateNote(id, privateAdminNote) {
        return this.post(
            '/api/admin/manual-identity-validations/' + id + '/private-note',
            { private_admin_note: privateAdminNote }
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

    reviewMercadoPagoRejectedValidation(id, action, note) {
        return this.post(
            '/api/admin/mercado-pago-rejected-validations/' + id + '/review',
            { action, note }
        );
    }

    updateMercadoPagoRejectedValidationPrivateNote(id, privateAdminNote) {
        return this.post(
            '/api/admin/mercado-pago-rejected-validations/' + id + '/private-note',
            { private_admin_note: privateAdminNote }
        );
    }

    approveMercadoPagoRejectedValidation(id) {
        return this.post(
            '/api/admin/mercado-pago-rejected-validations/' + id + '/approve',
            {}
        );
    }

    getUserMigrations(params = {}) {
        return this.get('/api/admin/user-migrations', params);
    }

    createUserMigration(data) {
        return this.post('/api/admin/user-migrations', data);
    }

    getMaintenanceSchedules() {
        return this.get('/api/admin/maintenance/schedules');
    }

    createMaintenanceSchedule(body) {
        return this.post('/api/admin/maintenance/schedules', body);
    }

    patchMaintenanceSchedule(id, body) {
        return this.patch('/api/admin/maintenance/schedules/' + id, body);
    }

    cancelMaintenanceSchedule(id) {
        return this.delete('/api/admin/maintenance/schedules/' + id);
    }

    getMaintenanceState() {
        return this.get('/api/admin/maintenance/state');
    }

    putMaintenanceState(body) {
        return this.put('/api/admin/maintenance/state', body);
    }

    getMaintenanceAuditLogs() {
        return this.get('/api/admin/maintenance/audit-logs');
    }

    updateRating(ratingId, data) {
        return this.patch('/api/admin/ratings/' + ratingId, data);
    }

    updateReference(referenceId, data) {
        return this.patch('/api/admin/references/' + referenceId, data);
    }
}

export { AdminApi as default };
