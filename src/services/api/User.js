import TaggedApi from '../../classes/TaggedApi';

class UserApi extends TaggedApi {
    /** USERS API  */

    /**
   * Register an user.
   * @param {Object} data {
   *    @param {String} name
   *    @param {String} email
   *    @param {String} password
   *    @param {String} password_confirmation
   *    @param {Boolean} terms_and_conditions
   *    @param {Date} birthday (Optional)
   *    @param {String} nro_doc (Optional)
   *    @param {String} gender (Masculino / Femenino) (Optional)
   *    @param {String} description (Optional)
   *    @param {String} mobile_phone (Optional)
   *  }
   * @return {}
  */
    register (data) {
        let customHeaders = {
            'Content-Type': 'multipart/form-data'
        };
        return this.post('/api/users', data, customHeaders);
    }

    /**
   * Update an user.
   * @param {Object} data {
   *    @param {String} name
   *    @param {String} email
   *    @param {String} password
   *    @param {String} password_confirmation
   *    @param {Date} birthday (Optional)
   *    @param {String} nro_doc (Optional)
   *    @param {String} gender (Masculino / Femenino) (Optional)
   *    @param {String} description (Optional)
   *    @param {String} mobile_phone (Optional)
   *  }
   * @return {}
  */
    update (data) {
        let customHeaders = {
            'Content-Type': 'multipart/form-data'
        };
        data.append('_method', 'PUT');
        return this.post('/api/users', data, customHeaders);
    }

    /**
   * Update user photo.
   * @param {Object} data {
   *    @param {File} profile (Image)
   *  }
   * @return {}
  */
    updatePhoto (data) {
        return this.put('/api/users/photo', data);
    }

    /**
   * Show an user.
   * @param {Integer} id
   * @return User
  */
    show (id) {
        if (!id) {
            id = 'me';
        }
        return this.get('/api/users/' + id, {});
    }

    list (data) {
        return this.get('/api/users/list', data);
    }

    registerDonation (data) {
        return this.post('/api/users/donation', data);
    }

    getBankData (data) {
        return this.get('/api/users/bank-data', data);
    }

    getTermsText (lang) {
        return this.get('/api/users/terms' + (lang ? ('?lang=' + lang) : ''));
    }

    changeProperty (data) {
        return this.post('/api/users/change/' + data.property + '/' + data.value, null);
    }
}

export { UserApi as default };
