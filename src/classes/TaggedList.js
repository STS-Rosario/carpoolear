class TaggedList {
    constructor () {
        this.map = {};
    }

    add (tags, value) {
        tags = tags ? (tags.constructor === Array ? tags : [tags]) : [];
        tags.forEach(tag => {
            if (!this.map[tag]) {
                this.map[tag] = [];
            }
            this.map[tag].push(value);
        });
    }

    deleteAll (tag) {
        this.map[tag] = undefined;
    }

    _delete (tag, value) {
        if (!this.map[tag]) {
            return;
        }
        let i = this.map[tag].indexOf(value);
        if (i !== -1) {
            this.map[tag].splice(i, 1);
        }
    }

    delete (tags, value) {
        tags = tags ? (tags.constructor === Array ? tags : [tags]) : [];
        if (tags) {
            tags.forEach(tag => this._delete(tag, value));
        }
    }

    deleteValue (value) {
        this.delete(this.keys, value);
    }

    get (tag) {
        return this.map[tag];
    }

    keys () {
        let temp = [];
        for (let i in this.map) {
            if (this.map[i] && this.map[i].length > 0) {
                temp.push(i);
            }
        }
        return temp;
    }

}

export { TaggedList as default };
