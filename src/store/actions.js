import * as types from './mutation-types';
import cache, {keys} from '../services/cache';

export const init = (store) => {
    console.log('starting application');

    let promises = [];
    let loadStateMap = [
        {
            key: keys.TOKEN_KEY,
            mutation: 'auth/' + types.AUTH_SET_TOKEN
        },
        {
            key: keys.USER_KEY,
            mutation: 'auth/' + types.AUTH_SET_USER
        },
        {
            key: keys.DEVICE_KEY,
            mutation: 'device/' + types.DEVICE_SET_CURRENT_DEVICE
        }
    ];

    loadStateMap.forEach(obj => {
        var p = new Promise((resolve, reject) => {
            cache.getItem(obj.key).then((value) => {
                store.commit(obj.mutation, value);
                resolve();
            }).catch(() => {
                resolve();
            });
        });
        promises.push(p);
    });

    return Promise.all(promises).then(() => startApp(store));
};

function startApp (store) {
    console.log('State loaded from cache', store);
    if (store.state.auth.token) {
        store.dispatch('auth/retoken');
    }
};
