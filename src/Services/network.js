import Auth from './auth.js'

const API_URL = process.env.API_URL;

module.exports =   {
    Vue: null,
    install (Vue) {
      this.Vue = Vue
    }, 
    get (url, params, headers = {}) {
      let authHeader = Auth.getAuthHeader()  
      Object.assign(headers, authHeader);
      return this.Vue.http.get(
        API_URL + url,
        {
            params : params,
            headers  : headers
        } 
      );
    },

    post (url, body, headers = {}) {
      let authHeader = Auth.getAuthHeader()  
      Object.assign(headers, authHeader);
      return this.Vue.http.post(
        API_URL + url,
        body,
        {
            headers : headers
        } 
      );
    }
 
}