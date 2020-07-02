class NativeStorage {
    setItem (key, value) {
        return new Promise((resolve, reject) => {
            window.NativeStorage.setItem(key, value, resolve, reject);
        });
    }

    removeItem (key) {
        return new Promise((resolve, reject) => {
            window.NativeStorage.remove(key, resolve, reject);
        });
    }

    getItem (key) {
        return new Promise((resolve, reject) => {
            window.NativeStorage.getItem(key, resolve, reject);
        });
    }

    clear () {
        return new Promise((resolve, reject) => {
            window.NativeStorage.clear(resolve, reject);
        });
    }
}

export { NativeStorage as default };
