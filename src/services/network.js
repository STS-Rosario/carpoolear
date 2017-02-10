import Auth from './auth.js'
import Vue from 'vue'

const API_URL = process.env.API_URL

module.exports = {
  get (url, params, headers = {}) {
    let authHeader = Auth.getAuthHeader()
    Object.assign(headers, authHeader)
    return Vue.http.get(
        API_URL + url,
      {
        params: params,
        headers: headers
      }
      )
  },

  post (url, body, headers = {}) {
    let authHeader = Auth.getAuthHeader()
    Object.assign(headers, authHeader)
    return Vue.http.post(
        API_URL + url,
        body,
      {
        headers: headers
      }
      )
  }

}
