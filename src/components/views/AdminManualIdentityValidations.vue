<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('validacionesManuales') }}</h2>
                <form class="admin-manual-filters" @submit.prevent="applyFilters">
                    <AppField label-for="admin-manual-status" :label="$t('estado')">
                        <select
                            id="admin-manual-status"
                            v-model="status"
                            class="admin-manual-filters__select"
                            @change="applyFilters"
                        >
                            <option value="">{{ $t('todos') }}</option>
                            <option value="pending">{{ $t('pendiente') }}</option>
                            <option value="approved">{{ $t('aprobado') }}</option>
                            <option value="rejected">{{ $t('rechazado') }}</option>
                            <option value="closed">{{ $t('estadoCerrado') }}</option>
                        </select>
                    </AppField>
                    <AppInput
                        id="admin-manual-search"
                        v-model="q"
                        type="search"
                        :label="$t('buscar')"
                    />
                    <AppButton variant="secondary" size="sm" type="submit">
                        {{ $t('buscar') }}
                    </AppButton>
                    <AppButton
                        v-if="hasActiveFilters"
                        variant="tertiary"
                        size="sm"
                        type="button"
                        @click="clearFilters"
                    >
                        {{ $t('limpiarFiltros') }}
                    </AppButton>
                </form>
                <div class="show-resolved-toggle">
                    <label>
                        <input v-model="showResolved" type="checkbox" />
                        {{ $t('mostrarResueltos') }}
                    </label>
                </div>
                <Loading :data="list">
                    <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th
                                    v-for="column in sortableColumns"
                                    :key="column.key"
                                    scope="col"
                                    class="admin-manual-th-sort"
                                    @click="toggleSort(column.key)"
                                >
                                    {{ $t(column.labelKey) }}
                                    <span
                                        v-if="sortKey === column.key"
                                        class="admin-manual-sort-hint"
                                    >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                </th>
                                <th scope="col">{{ $t('acciones') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user_name || $t('na') }}</td>
                                <td>{{ item.paid_at ? formatDate(item.paid_at) : '-' }}</td>
                                <td>{{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</td>
                                <td>{{ formatWaitingTime(item) }}</td>
                                <td>{{ item.paid ? $t('si') : $t('no') }}</td>
                                <td>{{ getVerifiedLabel(item) }}</td>
                                <td>
                                    <span :class="getStatusBadgeClass(item)">
                                        {{ getStatusLabel(item) }}
                                    </span>
                                    <span
                                        v-if="isApprovedWithImagesPending(item)"
                                        class="label label-danger pending-images-pill"
                                        :title="$t('faltaBorrarImagenes')"
                                    >
                                        {{ $t('faltaBorrarImagenes') }}
                                    </span>
                                </td>
                                <td>
                                    <router-link
                                        v-if="
                                            item.user_id &&
                                            Number(
                                                item.open_account_verification_tickets_count
                                            ) > 0
                                        "
                                        :to="
                                            accountVerificationTicketsRoute(
                                                item.user_id
                                            )
                                        "
                                        class="btn btn-link btn-sm"
                                    >
                                        {{
                                            item.open_account_verification_tickets_count
                                        }}
                                    </router-link>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <router-link
                                        v-if="item.user_id"
                                        :to="getAdminUserProfileRoute(item.user_id)"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ $t('verPerfil') }}
                                    </router-link>
                                    <AppPrimaryLink
                                        :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                    >
                                        {{ $t('revisarSolicitud') }}
                                    </AppPrimaryLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <template #no-data><div class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayValidacionesManuales') }}</div>
                    </div></template>
                    <template #loading><div class="text-center" style="margin-top: 20px;">
                        <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                        <p>{{ $t('cargando') }}</p>
                    </div></template>
                </Loading>
                <AdminPaginationBar
                    v-if="listMeta && listMeta.pagination"
                    :pagination="listMeta.pagination"
                    :per-page="listPerPage"
                    :loading="list === null"
                    @prev="goPrevPage"
                    @next="goNextPage"
                    @update:per-page="onPerPageChange"
                />
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminPaginationBar from '../AdminPaginationBar.vue';
import Loading from '../Loading';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import AppPrimaryLink from '../ui/AppPrimaryLink.vue';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { adminUserSupportTicketsRoute } from '../../utils/adminUserSupportTicketsLink';
import { isApprovedWithImagesPending } from '../../utils/adminManualIdentityValidationImages';
import {
    buildManualIdentityValidationListParams,
    getNextManualIdentityValidationSortState,
    getShowResolvedManualIdentityValidations,
    MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS,
    parseManualIdentityValidationListFromRoute,
    saveShowResolvedManualIdentityValidations
} from '../../utils/adminManualIdentityValidationsList';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel,
    getManualIdentityValidationVerifiedLabel
} from '../../utils/adminManualIdentityValidationDisplay';

export default {
    name: 'AdminManualIdentityValidations',
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            showResolved: getShowResolvedManualIdentityValidations(),
            status: '',
            q: '',
            sortKey: null,
            sortDir: 'asc',
            sortableColumns: MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS
        };
    },
    watch: {
        '$route.query': {
            deep: true,
            handler() {
                this.initFromRouteQuery();
                this.fetchList();
            }
        },
        showResolved(value) {
            saveShowResolvedManualIdentityValidations(value);
            this.listPage = 1;
            this.syncRouteQuery();
        }
    },
    computed: {
        hasActiveFilters() {
            return Boolean(this.status || this.q || this.showResolved);
        }
    },
    methods: {
        getAdminUserProfileRoute,
        accountVerificationTicketsRoute(userId) {
            return adminUserSupportTicketsRoute(userId, {
                type: 'account_verification',
                open: true,
                createdByAdmin: true
            });
        },
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        formatWaitingTime(item) {
            return formatManualIdentityValidationWaitingTime(item, (key) => this.$t(key));
        },
        getStatusLabel(item) {
            return getManualIdentityValidationStatusLabel(item, (key) => this.$t(key));
        },
        getStatusBadgeClass(item) {
            return getManualIdentityValidationStatusBadgeClass(item);
        },
        getVerifiedLabel(item) {
            return getManualIdentityValidationVerifiedLabel(item, (key) => this.$t(key));
        },
        isApprovedWithImagesPending,
        initFromRouteQuery() {
            const parsed = parseManualIdentityValidationListFromRoute(this.$route.query || {});
            this.listPage = parsed.page;
            this.listPerPage = parsed.perPage;
            this.sortKey = parsed.sortKey;
            this.sortDir = parsed.sortDir;
            if (this.$route.query.show_resolved != null) {
                this.showResolved = parsed.showResolved;
            }
            this.status = parsed.status;
            this.q = parsed.q;
        },
        syncRouteQuery() {
            const query = {};
            if (this.listPage > 1) {
                query.page = String(this.listPage);
            }
            if (this.listPerPage !== DEFAULT_ADMIN_PER_PAGE) {
                query.per_page = String(this.listPerPage);
            }
            if (this.showResolved) {
                query.show_resolved = '1';
            }
            if (this.status) {
                query.status = this.status;
            }
            if (this.q) {
                query.q = this.q;
            }
            if (this.sortKey) {
                query.sort = this.sortKey;
                query.direction = this.sortDir;
            }
            this.$router.replace({ query });
        },
        applyFilters() {
            this.listPage = 1;
            this.syncRouteQuery();
        },
        clearFilters() {
            this.status = '';
            this.q = '';
            this.showResolved = false;
            this.listPage = 1;
            this.syncRouteQuery();
        },
        toggleSort(column) {
            const next = getNextManualIdentityValidationSortState(
                this.sortKey,
                this.sortDir,
                column
            );

            this.sortKey = next.sortKey;
            this.sortDir = next.sortDir;
            this.listPage = 1;
            this.syncRouteQuery();
        },
        fetchList() {
            const api = new AdminApi();
            const params = buildManualIdentityValidationListParams({
                page: this.listPage,
                perPage: this.listPerPage,
                showResolved: this.showResolved,
                status: this.status,
                q: this.q,
                sortKey: this.sortKey,
                sortDir: this.sortDir
            });

            return api.getManualIdentityValidations(params).then((res) => {
                this.list = res.data || [];
                this.listMeta = res.meta || null;
            }).catch(() => {
                this.list = [];
                this.listMeta = null;
            });
        },
        goPrevPage() {
            const pagination = this.listMeta && this.listMeta.pagination;
            if (!pagination || pagination.current_page <= 1) {
                return;
            }
            this.listPage = pagination.current_page - 1;
            this.syncRouteQuery();
        },
        goNextPage() {
            const pagination = this.listMeta && this.listMeta.pagination;
            if (!pagination || pagination.current_page >= pagination.total_pages) {
                return;
            }
            this.listPage = pagination.current_page + 1;
            this.syncRouteQuery();
        },
        onPerPageChange(perPage) {
            this.listPerPage = perPage;
            this.listPage = 1;
            this.syncRouteQuery();
        }
    },
    mounted() {
        this.initFromRouteQuery();
        this.fetchList();
    },
    components: {
        AdminLayout,
        AdminPaginationBar,
        Loading,
        AppButton,
        AppField,
        AppInput,
        AppPrimaryLink
    }
};
</script>
<style scoped>
.admin-manual-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 16px;
}

.admin-manual-filters :deep(.app-field),
.admin-manual-filters :deep(.app-input) {
    flex: 1 1 160px;
    max-width: 220px;
    margin-bottom: 0;
}

.admin-manual-filters__select {
    width: 100%;
    border: 0;
    border-radius: var(--ds-radius-input);
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

.admin-manual-filters__select:focus {
    outline: none;
}

.show-resolved-toggle {
    margin-bottom: 16px;
}

.pending-images-pill {
    margin-left: 6px;
}

.admin-manual-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-manual-th-sort:hover {
    background: #f5f5f5;
}

.admin-manual-sort-hint {
    color: #666;
    margin-left: 4px;
    font-size: 12px;
}
</style>
