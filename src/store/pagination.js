
export function makeState (name) {
    let obj = {};
    obj[name] = null;
    obj[name + 'SearchParam'] = {
        page: 1,
        pageSize: 20,
        lastPage: false,
        data: {}
    };
    return obj;
}

export function makeGetters (name) {
    let getters = {};
    getters[name] = state => state[name];
    getters[name + 'MorePage'] = state => !state[name + 'SearchParam'].lastPage;
    getters[name + 'SearchParam'] = state => state[name + 'SearchParam'];
    return getters;
}

export function makeMutations (name) {
    let mutations = {};
    mutations[name.toUpperCase() + '_SET'] = (state, items) => {
        state[name] = items;
    };

    mutations[name.toUpperCase() + '_ADD'] = (state, items) => {
        state[name] = [...state[name], ...items];
    };

    mutations[name.toUpperCase() + '_NEXT_PAGE'] = (state) => {
        state[name + 'SearchParam'].page++;
    };

    mutations[name.toUpperCase() + '_RESTORE_PAGE'] = (state) => {
        state[name + 'SearchParam'].page = 1;
        state[name + 'SearchParam'].lastPage = false;
    };

    mutations[name.toUpperCase() + '_SET_FILTER'] = (state, filters) => {
        state[name + 'SearchParam'].data = filters;
    };

    mutations[name.toUpperCase() + '_SET_LASTPAGE'] = (state) => {
        state[name + 'SearchParam'].lastPage = true;
    };
    return mutations;
}

export function makeActions (name, requestGeneration, callback) {
    let actions = {};
    actions[name + 'Search'] = (store, data = {}, next = false) => {
        let params = null;
        if (data.next) {
            if (store.state[name + 'SearchParam'].lastPage) {
                return;
            }
            store.commit(name.toUpperCase() + '_NEXT_PAGE');
            params = Object.assign({}, store.state[name + 'SearchParam'].data);
            params.page = store.state[name + 'SearchParam'].page;
            params.page_size = store.state[name + 'SearchParam'].pageSize;
        } else {
            store.commit(name.toUpperCase() + '_RESTORE_PAGE');
            store.commit(name.toUpperCase() + '_SET_FILTER', data);
            store.commit(name.toUpperCase() + '_SET', null);
            params = Object.assign({}, data);
            params.page = store.state[name + 'SearchParam'].page;
            params.page_size = store.state[name + 'SearchParam'].pageSize;
        }
        let promises = requestGeneration({store, data: params});
        promises.then(response => {
            if (response.meta.pagination.total_pages === response.meta.pagination.current_page) {
                store.commit(name.toUpperCase() + '_SET_LASTPAGE');
            }
            if (data.next) {
                store.commit(name.toUpperCase() + '_ADD', response.data);
            } else {
                store.commit(name.toUpperCase() + '_SET', response.data);
            }
            return Promise.resolve(response.data);
        }).catch(error => {
            if (error) {

            }
            return Promise.reject(error);
        });
        if (callback) {
            callback(store, promises);
        }
    };
    return actions;
}
