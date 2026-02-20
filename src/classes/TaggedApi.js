import network from '../services/network.js';

class TaggedApi {
    constructor() {
        this._pendingRequest = network.pendingRequest;
        this._tags = [];
    }

    tag(tags) {
        tags = tags ? (tags.constructor === Array ? tags : [tags]) : [];
        if (!this._tags) {
            this._tags = [];
        }
        this._pushMany(tags);
        return this;
    }

    _pushMany(tags) {
        tags.forEach((tag) => {
            if (!this._tags.includes(tag)) {
                this._tags.push(tag);
            }
        });
    }

    _addTags(xhr) {
        network.addRequest(xhr, this._tags);
        this._tags = null;
    }

    get(url, params, headers) {
        const xhr = network.get(url, params, headers);
        this._addTags(xhr);

        return xhr;
    }

    post(url, body, headers) {
        const xhr = network.post(url, body, headers);
        this._addTags(xhr);

        return xhr;
    }

    put(url, body, headers) {
        const xhr = network.put(url, body, headers);
        this._addTags(xhr);

        return xhr;
    }

    delete(url, params, headers) {
        const xhr = network.delete(url, params, headers);
        this._addTags(xhr);

        return xhr;
    }
}

export { TaggedApi as default };
