<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('adminDonaciones') }}</h2>
                <form class="admin-donaciones-filters" @submit.prevent="applyFilters">
                    <AppField label-for="admin-donaciones-kind" :label="$t('tipo')">
                        <select
                            id="admin-donaciones-kind"
                            v-model="kind"
                            class="admin-donaciones-filters__select"
                            @change="applyFilters"
                        >
                            <option value="">{{ $t('todos') }}</option>
                            <option value="unica_vez">{{ $t('unicaVez') }}</option>
                            <option value="club">{{ $t('adminNavClubCarpoolear') }}</option>
                        </select>
                    </AppField>
                    <AppField label-for="admin-donaciones-status" :label="$t('estado')">
                        <select
                            id="admin-donaciones-status"
                            v-model="status"
                            class="admin-donaciones-filters__select"
                            @change="applyFilters"
                        >
                            <option value="">{{ $t('todos') }}</option>
                            <option value="approved">{{ $t('aprobado') }}</option>
                            <option value="pending">{{ $t('pendiente') }}</option>
                        </select>
                    </AppField>
                    <AppInput
                        id="admin-donaciones-search"
                        v-model="q"
                        type="search"
                        :label="$t('buscar')"
                    />
                    <AppButton variant="secondary" size="sm" type="submit">
                        {{ $t('buscar') }}
                    </AppButton>
                </form>
                <Loading :data="list">
                    <div class="table-responsive">
                        <table class="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th
                                        v-for="column in sortableColumns"
                                        :key="column.key"
                                        scope="col"
                                        class="admin-donaciones-th-sort"
                                        @click="toggleSort(column.key)"
                                    >
                                        {{ $t(column.labelKey) }}
                                        <span
                                            v-if="sortKey === column.key"
                                            class="admin-donaciones-sort-hint"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item.kind + '-' + item.mp_payment_id">
                                    <td>{{ formatPaidAt(item.paid_at) }}</td>
                                    <td>
                                        <router-link
                                            v-if="item.user_id"
                                            :to="getAdminUserProfileRoute(item.user_id)"
                                        >
                                            {{ item.user_name || $t('usuarioAnonimo') }}
                                        </router-link>
                                        <span v-else>{{ item.user_name || $t('usuarioAnonimo') }}</span>
                                    </td>
                                    <td>{{ formatAmountCents(item.amount_cents) }}</td>
                                    <td>{{ kindLabel(item.kind) }}</td>
                                    <td>{{ statusLabel(item.status) }}</td>
                                    <td>{{ item.tier_slug || $t('na') }}</td>
                                    <td>{{ item.source || $t('na') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <template #no-data>
                        <div class="text-center" style="margin-top: 20px;">
                            <div class="alert alert-info">{{ $t('noHayDonaciones') }}</div>
                        </div>
                    </template>
                    <template #loading>
                        <div class="text-center" style="margin-top: 20px;">
                            <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                            <p>{{ $t('cargando') }}</p>
                        </div>
                    </template>
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
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    ADMIN_DONATION_LEDGER_SORT_COLUMNS,
    buildDonationLedgerListParams,
    getNextDonationLedgerSortState,
    parseDonationLedgerListFromRoute
} from '../../utils/adminDonationLedgerList';

export default {
    name: 'AdminDonaciones',
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            kind: '',
            status: '',
            q: '',
            sortKey: 'paid_at',
            sortDir: 'desc',
            sortableColumns: ADMIN_DONATION_LEDGER_SORT_COLUMNS
        };
    },
    watch: {
        '$route.query': {
            deep: true,
            handler() {
                this.initFromRouteQuery();
                this.fetchList();
            }
        }
    },
    methods: {
        getAdminUserProfileRoute,
        formatPaidAt(value) {
            return value || this.$t('na');
        },
        formatAmountCents(amountCents) {
            const pesos = Math.round(Number(amountCents || 0) / 100);
            return `$ ${pesos.toLocaleString('es-AR')}`;
        },
        kindLabel(kind) {
            if (kind === 'club') {
                return this.$t('adminNavClubCarpoolear');
            }
            return this.$t('unicaVez');
        },
        statusLabel(status) {
            if (status === 'approved') {
                return this.$t('aprobado');
            }
            if (status === 'pending') {
                return this.$t('pendiente');
            }
            return status || this.$t('na');
        },
        initFromRouteQuery() {
            const parsed = parseDonationLedgerListFromRoute(this.$route.query || {});
            this.kind = parsed.kind;
            this.status = parsed.status;
            this.q = parsed.q;
            this.sortKey = parsed.sortKey || 'paid_at';
            this.sortDir = parsed.sortDir;
            this.listPage = parsed.page;
            this.listPerPage = parsed.perPage;
        },
        syncRouteQuery() {
            const query = {};
            if (this.kind) {
                query.kind = this.kind;
            }
            if (this.status) {
                query.status = this.status;
            }
            if (this.q) {
                query.q = this.q;
            }
            if (this.listPage > 1) {
                query.page = String(this.listPage);
            }
            if (this.listPerPage !== DEFAULT_ADMIN_PER_PAGE) {
                query.per_page = String(this.listPerPage);
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
        toggleSort(column) {
            const next = getNextDonationLedgerSortState(
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
            const params = buildDonationLedgerListParams({
                kind: this.kind,
                status: this.status,
                q: this.q,
                sortKey: this.sortKey,
                sortDir: this.sortDir,
                page: this.listPage,
                perPage: this.listPerPage
            });

            return api
                .getDonationPayments(params)
                .then((res) => {
                    this.list = res.data || [];
                    this.listMeta = res.meta || null;
                })
                .catch(() => {
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
        AppButton,
        AppField,
        AppInput,
        Loading
    }
};
</script>
<style scoped>
.admin-donaciones-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 16px;
}

.admin-donaciones-filters :deep(.app-field),
.admin-donaciones-filters :deep(.app-input) {
    flex: 1 1 160px;
    max-width: 220px;
    margin-bottom: 0;
}

.admin-donaciones-filters__select {
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

.admin-donaciones-filters__select:focus {
    outline: none;
}

.admin-donaciones-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-donaciones-th-sort:hover {
    background: #f5f5f5;
}

.admin-donaciones-sort-hint {
    color: #666;
    margin-left: 4px;
    font-size: 12px;
}
</style>
