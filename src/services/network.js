/*jshint esversion: 6 */
import store from '../store';
import Vue from 'vue';
import * as types from '../store/mutation-types';
import TaggedList from '../classes/TaggedList';
import axios from 'axios';

const API_URL = process.env.API_URL;

export default {
  pendingRequest: new TaggedList,

  addRequest(xhr, tags) {
      this.pendingRequest.add(tags)
  },

  getHeader (headers) {
    let authHeader = store.getters['auth/authHeader'];
    Object.assign(headers, authHeader);
    return headers;
  },

  get(url, params, headers = {}) {  
    return axios.get(
        API_URL + url,
        {
          params: params,
          headers: this.getHeader(headers)
        }
      );
  },

  post (url, body, headers = {}) { 
    return axios.post(
        API_URL + url,
        body,
        {
          headers: this.getHeader(headers)
        }
      );
  },

  delete(url, params, headers = {}) { 
    return axios.delete(
      API_URL + url,
      {
        params: params,
        headers: this.getHeader(headers)
      }
    );
  },

  put(url, body, headers = {}) { 
    return axios.put(
      API_URL + url,
      body,
      {
        headers: this.getHeader(headers)
      }
    );
  }

}
