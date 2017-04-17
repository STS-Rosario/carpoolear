
import NativeStorage from './NativeStorage.js';
import LocalStorage from './LocalStorage.js';

let cache = null;
if (window.NativeStorage) {
    cache = new NativeStorage();
} else {
    cache = new LocalStorage();
}

export default cache;

export const keys = {
    'TOKEN_KEY': 'TOKEN'
};
