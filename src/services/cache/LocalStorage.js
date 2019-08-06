class LocalStorage {
    setItem (key, value) {
        if (typeof value === 'string' || typeof value === 'number') {
            window.localStorage.setItem(key, value);
        } else {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        return Promise.resolve();
    }

    removeItem (key) {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    }

    getItem (key) {
        var temp = window.localStorage.getItem(key);
        if (temp && temp !== 'undefined') {
            try {
                temp = JSON.parse(temp);
                return Promise.resolve(temp);
            } catch (ex) {
                return Promise.resolve(temp);
            }
        } else {
            return Promise.reject(new Error());
        }
    }

    clear () {
        window.localStorage.clear();
        return Promise.resolve();
    }
}

export { LocalStorage as default };
