import store from '../store'
import Vue from 'vue'
import * as types from '../store/mutation-types'
import TaggedList from '../classes/TaggedList'
import axios from 'axios'

const API_URL = process.env.API_URL

export default {
  pendingRequest: new TaggedList,

  addRequest(xhr, tags) {
      this.pendingRequest.add(tags)
  },

  get(url, params, headers = {}) {
    let authHeader = store.getters['auth/authHeader']
    Object.assign(headers, authHeader)
    return axios.get(
        API_URL + url,
        {
          params: params,
          headers: headers
        }
      )
  },

  post (url, body, headers = {}) {
    let authHeader = store.getters['auth/authHeader']
    Object.assign(headers, authHeader)
    return axios.post(
        API_URL + url,
        body,
        {
          headers: headers
        }
      )
  },

  delete(url, params, headers = {}) {
    let authHeader = store.getters['auth/authHeader']
    Object.assign(headers, authHeader)
    return axios.delete(
      API_URL + url,
      {
        params: params,
        headers: headers
      }
    )
  },

  put(url, body, headers = {}) {
    let authHeader = store.getters['auth/authHeader']
    Object.assign(headers, authHeader)
    return axios.put(
      API_URL + url,
      body,
      {
        headers: headers
      }
    )
  }

}
