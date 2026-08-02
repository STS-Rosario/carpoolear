<template>
    <div
        v-if="pagination"
        class="admin-pagination-bar"
    >
        <div
            v-if="pagination.total_pages > 1"
            class="admin-pagination-bar__pager"
        >
            <AppButton
                variant="secondary"
                size="sm"
                :disabled="loading || pagination.current_page <= 1"
                @click="$emit('prev')"
            >
                {{ $t('anterior') }}
            </AppButton>
            <span class="admin-pagination-bar__pager-label text-muted">
                {{
                    $t('adminUsuariosPagina', {
                        current: pagination.current_page,
                        total: pagination.total_pages
                    })
                }}
            </span>
            <AppButton
                variant="secondary"
                size="sm"
                :disabled="loading || pagination.current_page >= pagination.total_pages"
                @click="$emit('next')"
            >
                {{ $t('siguiente') }}
            </AppButton>
        </div>
        <AppField
            :label="$t('adminItemsPerPage')"
            :label-for="perPageSelectId"
            class="admin-pagination-bar__per-page"
        >
            <select
                :id="perPageSelectId"
                class="admin-pagination-bar__per-page-select"
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
        </AppField>
    </div>
</template>

<script>
import AppButton from './ui/AppButton.vue';
import AppField from './ui/AppField.vue';
import { ADMIN_PER_PAGE_OPTIONS } from '../utils/adminPagination';

let nextPerPageSelectId = 0;

export default {
    name: 'AdminPaginationBar',
    components: {
        AppButton,
        AppField
    },
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
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 12px;
    width: fit-content;
    max-width: 100%;
}

.admin-pagination-bar__per-page {
    width: fit-content;
    max-width: 100%;
    margin-bottom: 0;
}

.admin-pagination-bar__per-page :deep(.app-field__control-wrap) {
    width: auto;
}

.admin-pagination-bar__per-page-select {
    width: auto;
    min-width: 72px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.admin-pagination-bar__per-page-select:focus {
    outline: none;
}

.admin-pagination-bar__pager {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.admin-pagination-bar__pager-label {
    flex: 0 1 auto;
    text-align: center;
    font-size: 12px;
    white-space: nowrap;
}
</style>
