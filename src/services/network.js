/* jshint esversion: 6 */
import store from '../store';
import TaggedList from '../classes/TaggedList';
import axios from 'axios';

const API_URL = process.env.API_URL;

class MyPromise extends Promise {
    constructor (executor) {
        super((resolve, reject) => {
            // before
            return executor(resolve, reject);
        });
        // after
    }

    then (onFulfilled, onRejected) {
        console.log('je');
        // before
        const returnValue = super.then(onFulfilled, onRejected);
        console.log('hola');
        console.log(this);
        returnValue.abort = this.abort;
        // after
        return returnValue;
    }

    catch (onRejected) {
        console.log('je');
        // before
        const returnValue = super.catch(onRejected);
        console.log('je');
        console.log(this);
        returnValue.abort = this.abort;
        // after
        return returnValue;
    }
}

export default {
    pendingRequest: new TaggedList(),

    addRequest (xhr, tags) {
        this.pendingRequest.add(tags, xhr);
    },

    getHeader (headers) {
        let authHeader = store.getters['auth/authHeader'];
        Object.assign(headers, authHeader);
        return headers;
    },

    newCancelToken () {
        let CancelToken = axios.CancelToken;
        return CancelToken.source();
    },

    processResponse (response, source) {
        let promise = new MyPromise((resolve, reject) => {
            response.then((response) => {
                resolve(response.data);
            }).catch((resp) => {
        // Revisar el tipo de error!
                let data = resp.response.data;
                let status = resp.response.status;
                reject({data, status});
            });
        });

        promise.abort = () => {
            source.cancel('Abort by the system');
        };
        console.log(promise);
        return promise;
    },

    get (url, params, headers = {}) {
        let source = this.newCancelToken();
        return this.processResponse(axios.get(
        API_URL + url,
            {
                params: params,
                headers: this.getHeader(headers),
                cancelToken: source.token
            }
      ), source);
    },

    post (url, body, headers = {}) {
        let source = this.newCancelToken();
        return this.processResponse(axios.post(
        API_URL + url,
        body,
            {
                headers: this.getHeader(headers),
                cancelToken: source.token
            }
      )
    , source);
    },

    delete (url, params, headers = {}) {
        let source = this.newCancelToken();
        return this.processResponse(axios.delete(
      API_URL + url,
            {
                params: params,
                headers: this.getHeader(headers),
                cancelToken: source.token
            }
    ), source);
    },

    put (url, body, headers = {}) {
        let source = this.newCancelToken();
        return this.processResponse(axios.put(
      API_URL + url,
      body,
            {
                headers: this.getHeader(headers),
                cancelToken: source.token
            }
    ), source);
    }

};
