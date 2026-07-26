<template>
    <div
        v-if="pagination"
        class="admin-pagination-bar"
    >
        <div class="admin-pagination-bar__per-page">
            <label :for="perPageSelectId" class="admin-pagination-bar__per-page-label">
                {{ $t('adminItemsPerPage') }}
            </label>
            <select
                :id="perPageSelectId"
                class="form-control input-sm admin-pagination-bar__per-page-select"
                :value="perPage"
                :disabled="loading"
                @change="onPerPageChange"
            >
                <option
                    v-for="option in perPageOptions"
                    :key="option"
                    :value="option"
                >
                    {{ option }}
                </option>
            </select>
        </div>
        <div
            v-if="pagination.total_pages > 1"
            class="admin-pagination-bar__pager"
        >
            <button
                type="button"
                class="btn btn-default btn-sm"
                :disabled="loading || pagination.current_page <= 1"
                @click="$emit('prev')"
            >
                {{ $t('anterior') }}
            </button>
            <span class="admin-pagination-bar__pager-label text-muted">
                {{
                    $t('adminUsuariosPagina', {
                        current: pagination.current_page,
                        total: pagination.total_pages
                    })
                }}
            </span>
            <button
                type="button"
                class="btn btn-default btn-sm"
                :disabled="loading || pagination.current_page >= pagination.total_pages"
                @click="$emit('next')"
            >
                {{ $t('siguiente') }}
            </button>
        </div>
    </div>
</template>

<script>
import { ADMIN_PER_PAGE_OPTIONS } from '../utils/adminPagination';

let nextPerPageSelectId = 0;

export default {
    name: 'AdminPaginationBar',
    props: {
        pagination: {
            type: Object,
            default: null
        },
        perPage: {
            type: Number,
            default: 20
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['prev', 'next', 'update:perPage'],
    data() {
        nextPerPageSelectId += 1;

        return {
            perPageOptions: ADMIN_PER_PAGE_OPTIONS,
            perPageSelectId: `admin-per-page-${nextPerPageSelectId}`
        };
    },
    methods: {
        onPerPageChange(event) {
            const value = parseInt(event.target.value, 10);
            this.$emit('update:perPage', value);
        }
    }
};
</script>

<style scoped>
.admin-pagination-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
}

.admin-pagination-bar__per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.admin-pagination-bar__per-page-label {
    margin: 0;
    font-size: 12px;
    font-weight: normal;
}

.admin-pagination-bar__per-page-select {
    width: auto;
    min-width: 72px;
}

.admin-pagination-bar__pager {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.admin-pagination-bar__pager-label {
    flex: 1;
    text-align: center;
    font-size: 12px;
}
</style>
