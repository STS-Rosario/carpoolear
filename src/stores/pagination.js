/**
 * Read pagination fields from API bodies. Supports:
 * - Legacy wrapper: { data, meta: { pagination: { current_page, total_pages } } }
 * - Laravel LengthAwarePaginator JSON: { data, current_page, last_page, ... }
 */
function readPagination(response) {
    if (!response || typeof response !== 'object') {
        return { currentPage: undefined, totalPages: undefined };
    }
    const meta = response.meta;
    if (meta && typeof meta === 'object') {
        if (meta.pagination) {
            return {
                currentPage: meta.pagination.current_page,
                totalPages: meta.pagination.total_pages
            };
        }
        if (meta.current_page != null || meta.last_page != null) {
            return {
                currentPage: meta.current_page,
                totalPages: meta.last_page ?? meta.total_pages
            };
        }
    }
    return {
        currentPage: response.current_page,
        totalPages: response.last_page
    };
}

function extractPaginatedList(response) {
    if (!response || typeof response !== 'object') {
        return [];
    }
    if (Array.isArray(response)) {
        return response;
    }
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (
        response.data &&
        typeof response.data === 'object' &&
        Array.isArray(response.data.data)
    ) {
        return response.data.data;
    }
    return [];
}

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
                const { currentPage, totalPages } = readPagination(response);
                const items = extractPaginatedList(response);
                if (
                    totalPages != null &&
                    currentPage != null &&
                    totalPages === currentPage
                ) {
                    // SET_LASTPAGE
                    this[name + 'SearchParam'].lastPage = true;
                }
                if (data.next) {
                    if (currentPage === this[name + 'SearchParam'].page) {
                        // intentionally empty (matches original)
                    }
                    // ADD
                    if (this[name]) {
                        this[name] = [...this[name], ...items];
                    } else {
                        console.error(this[name], items);
                    }
                } else {
                    // SET (with dedup logic)
                    if (this[name] && this[name].length) {
                        items.forEach((item) => {
                            const foundItem = this[name].find(
                                (i) =>
                                    i.id.toString() === item.id.toString()
                            );
                            if (!foundItem) {
                                this[name].push(item);
                            }
                        });
                    } else {
                        this[name] = items;
                    }
                }
                return Promise.resolve(items);
            })
            .catch((error) => {
                console.error(`[${name}Search] request failed:`, error);
                if (!data.next) {
                    this[name] = [];
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
