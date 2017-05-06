import TaggedApi from '../../classes/TaggedApi';

class AuthApi extends TaggedApi {

    /** AUTH API **/

    /**
     * User login
     * @param {Object} creds {
     *    @param {String} email
     *    @param {String} password
     *    @param {String} device_id
     *    @param {String} device_type
     *    @param {Integer} app_version
     *  }
     * @return {} token
    */
    login (creds) {
        return this.post('/api/login', creds);
    }

    /**
     * User logout.
     * @return {}
    */
    logout () {
        return this.post('/api//logout');
    }

    /**
     * Retoken.
     * @param {Object} data {
     *    @param {Integer} app_version
     *  }
     * @return {} token
    */
    retoken (data) {
        return this.post('/api/retoken', data);
    }

    /**
     * Activate.
     * @param {Object} data {
     *    @param {String} device_id
     *    @param {String} device_type
     *    @param {Integer} app_version
     *  }
     * @param {String} activationToken
     * @return {} token
    */
    activate (activationToken, data) {
        return this.post('/api/activate/' + activationToken, data);
    }

    /**
     * Reset password by email.
     * @param {Object} data {
     *    @param {String} email
     *  }
     * @return {}
    */
    resetPassword (data) {
        return this.post('/api/reset-password', data);
    }

    /**
     * Change password by email.
     * @param {Object} data {
     *    @param {String} password
     *    @param {String} password_confirmation
     *  }
     * @return {}
    */
    changePassword (token, data) {
        return this.post('/api/change-password/' + token, data);
    }
}

export { AuthApi as default };
