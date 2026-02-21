import { ref, computed } from 'vue';

export function usePagination(name, requestGeneration, callback) {
    const items = ref(null);
    const searchParam = ref({
        page: 1,
        pageSize: 20,
        lastPage: false,
        data: {}
    });

    const morePage = computed(() => !searchParam.value.lastPage);

    function setItems(newItems) {
        if (newItems) {
            if (items.value && items.value.length) {
                newItems.forEach((item) => {
                    const found = items.value.find(
                        (i) => i.id.toString() === item.id.toString()
                    );
                    if (!found) {
                        items.value.push(item);
                    }
                });
            } else {
                items.value = newItems;
            }
        } else {
            items.value = newItems;
        }
    }

    function addItems(newItems) {
        if (items.value && newItems) {
            items.value = [...items.value, ...newItems];
        }
    }

    function search(data = {}) {
        let params = null;
        if (data.next) {
            if (searchParam.value.lastPage) {
                return;
            }
            searchParam.value.page++;
            params = Object.assign({}, searchParam.value.data);
            params.page = searchParam.value.page;
            params.page_size = searchParam.value.pageSize;
        } else {
            searchParam.value.page = 1;
            searchParam.value.lastPage = false;
            searchParam.value.data = data;
            items.value = null;
            params = Object.assign({}, data);
            params.page = searchParam.value.page;
            params.page_size = searchParam.value.pageSize;
        }
        const promise = requestGeneration({ data: params });
        promise
            .then((response) => {
                if (
                    response.meta.pagination.total_pages ===
                    response.meta.pagination.current_page
                ) {
                    searchParam.value.lastPage = true;
                }
                if (data.next) {
                    addItems(response.data);
                } else {
                    setItems(response.data);
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
        if (callback) {
            callback(promise);
        }
        return promise;
    }

    return {
        items,
        searchParam,
        morePage,
        search,
        setItems,
        addItems
    };
}
