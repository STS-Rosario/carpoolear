/* jshint esversion: 6 */
import { useAuthStore } from '../stores/auth';
import TaggedList from '../classes/TaggedList';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const API_URL = import.meta.env.VITE_API_URL;

class MyPromise {
    constructor(resolve, reject, promise = null) {
        if (!promise) {
            this.promise = new Promise(resolve, reject);
        } else {
            this.promise = promise;
        }
    }

    then(callback, onError) {
        const tempPromise = this.promise.then(callback, onError);
        const myTempPromise = new MyPromise(null, null, tempPromise);
        myTempPromise.abort = this.abort;
        return myTempPromise;
    }

    catch(func) {
        const tempPromise = this.promise.catch(func);
        const myTempPromise = new MyPromise(null, null, tempPromise);
        myTempPromise.abort = this.abort;
        return myTempPromise;
    }

    finally(func) {
        const tempPromise = this.promise.finally(func);
        const myTempPromise = new MyPromise(null, null, tempPromise);
        myTempPromise.abort = this.abort;
        return myTempPromise;
    }
}

export default {
    pendingRequest: new TaggedList(),

    getBaseURL() {
        return API_URL;
    },

    addRequest(xhr, tags) {
        this.pendingRequest.add(tags, xhr);
    },

    getHeader(headers) {
        const authStore = useAuthStore();
        Object.assign(headers, authStore.authHeader);

        // Add Capacitor platform header when running on native platform
        if (Capacitor.isNativePlatform()) {
            headers['X-App-Platform'] = 'capacitor';
        }

        // Add ngrok bypass header for ngrok domains
        if (API_URL && API_URL.includes('ngrok')) {
            headers['ngrok-skip-browser-warning'] = 'any';
        }

        return headers;
    },

    newCancelToken() {
        const CancelToken = axios.CancelToken;
        return CancelToken.source();
    },

    processResponse(response, source) {
        const promise = new MyPromise((resolve, reject) => {
            response
                .then((response) => {
                    resolve(response.data);
                })
                .catch((resp) => {
                    // Revisar el tipo de error!
                    if (resp.response) {
                        const data = resp.response.data;
                        const status = resp.response.status;
                        reject({ data, status });
                    } else {
                        reject(resp);
                    }
                });
        });
        promise.abort = () => {
            source.cancel('Abort by the system');
        };
        return promise;
    },

    get(url, params, headers = {}) {
        const source = this.newCancelToken();
        return this.processResponse(
            axios.get(API_URL + url, {
                params: params,
                headers: this.getHeader(headers),
                cancelToken: source.token
            }),
            source
        );
    },

    post(url, body, headers = {}) {
        const source = this.newCancelToken();
        return this.processResponse(
            axios.post(API_URL + url, body, {
                headers: this.getHeader(headers),
                cancelToken: source.token
            }),
            source
        );
    },

    delete(url, params, headers = {}) {
        const source = this.newCancelToken();
        return this.processResponse(
            axios.delete(API_URL + url, {
                params: params,
                headers: this.getHeader(headers),
                cancelToken: source.token
            }),
            source
        );
    },

    put(url, body, headers = {}) {
        const source = this.newCancelToken();
        return this.processResponse(
            axios.put(API_URL + url, body, {
                headers: this.getHeader(headers),
                cancelToken: source.token
            }),
            source
        );
    }
};
