export function makePaginationState(name) {
    const obj = {};
    obj[name] = null;
    obj[name + 'SearchParam'] = {
        page: 1,
        pageSize: 20,
        lastPage: false,
        data: {}
    };
    obj[name + 'CurrentPage'] = 1;
    return obj;
}

export function makePaginationGetters(name) {
    const getters = {};
    // name and name+'SearchParam' are accessed via mapState directly from state.
    // Only name+'MorePage' is a computed getter (not a simple state mirror).
    getters[name + 'MorePage'] = (state) =>
        !state[name + 'SearchParam'].lastPage;
    return getters;
}

export function makePaginationActions(name, requestGeneration, callback) {
    const actions = {};
    actions[name + 'Search'] = function (data = {}) {
        let params = null;
        if (data.next) {
            if (this[name + 'SearchParam'].lastPage) {
                return;
            }
            // NEXT_PAGE
            this[name + 'SearchParam'].page++;
            params = Object.assign({}, this[name + 'SearchParam'].data);
            params.page = this[name + 'SearchParam'].page;
            params.page_size = this[name + 'SearchParam'].pageSize;
        } else {
            // RESTORE_PAGE
            this[name + 'SearchParam'].page = 1;
            this[name + 'SearchParam'].lastPage = false;
            // SET_FILTER
            this[name + 'SearchParam'].data = data;
            // SET null
            this[name] = null;
            params = Object.assign({}, data);
            params.page = this[name + 'SearchParam'].page;
            params.page_size = this[name + 'SearchParam'].pageSize;
        }
        const promises = requestGeneration({ store: this, data: params });
        promises
            .then((response) => {
                if (
                    response.meta.pagination.total_pages ===
                    response.meta.pagination.current_page
                ) {
                    // SET_LASTPAGE
                    this[name + 'SearchParam'].lastPage = true;
                }
                if (data.next) {
                    if (
                        response.meta.pagination.current_page ===
                        this[name + 'SearchParam'].page
                    ) {
                        // intentionally empty (matches original)
                    }
                    // ADD
                    if (this[name] && response.data) {
                        this[name] = [...this[name], ...response.data];
                    } else {
                        console.error(this[name], response.data);
                    }
                } else {
                    // SET (with dedup logic)
                    if (response.data) {
                        if (this[name] && this[name].length) {
                            response.data.forEach((item) => {
                                const foundItem = this[name].find(
                                    (i) =>
                                        i.id.toString() === item.id.toString()
                                );
                                if (!foundItem) {
                                    this[name].push(item);
                                }
                            });
                        } else {
                            this[name] = response.data;
                        }
                    } else {
                        this[name] = response.data;
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                if (error) {
                    // intentionally empty (matches original)
                }
                return Promise.reject(error);
            });
        if (callback) {
            callback(this, promises); // eslint-disable-line node/no-callback-literal
        }
        return promises;
    };
    return actions;
}
