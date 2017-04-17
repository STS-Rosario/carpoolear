import TaggedList from '../classes/TaggedList';

const taggedList = new TaggedList();

export class Thread {
    constructor (fn, tags = []) {
        this.fn = fn;
        this.id = null;
        tags = tags.constructor === Array ? tags : [tags];
        this._tags = tags;
    }

    tag (tags) {
        tags = tags ? (tags.constructor === Array ? tags : [tags]) : [];
        tags.forEach(tag => {
            if (!this._tags.includes(tag)) {
                this._tags.push(tag);
            }
        });
        return this;
    }

    once (interval) {
        if (this._tags.length === 0) this._tags = ['__GLOBAL__'];
        if (!interval) interval = 0;
        this.id = setTimeout(() => {
            this.fn(this);
            this.stop();
        }, interval);
        taggedList.add(this._tags, this);
        this._tag = [];
        return this;
    }

    run (interval, runFirst) {
        if (this._tags.length === 0) this._tags = ['__GLOBAL__'];
        if (!interval) interval = 0;
        if (runFirst) this.fn(this);
        this.id = setInterval(() => this.fn(this), interval);
        taggedList.add(this._tags, this);
        this._tag = [];
        return this;
    }

    stop () {
        clearInterval(this.id);
        taggedList.deleteValue(this);
    }
}

export function stopThreads (tags) {
    if (!tags) {
        tags = taggedList.keys();
    } else {
        tags = tags ? (tags.constructor === Array ? tags : [tags]) : [];
    }

    tags.forEach(tag => {
        let list = taggedList.get(tag);
        if (list) {
            list.forEach(thread => {
                clearTimeout(thread.id);
            });
        }
    });
    taggedList.deleteAll(tags);
}

