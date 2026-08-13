<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('excesoContribucion') }}</h2>
                <div class="requires-action-toggle">
                    <label>
                        <input v-model="requiresActionOnly" type="checkbox" />
                        {{ $t('soloRequierenAccion') }}
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
                                        class="admin-exceso-th-sort"
                                        @click="toggleSort(column.key)"
                                    >
                                        {{ $t(column.labelKey) }}
                                        <span
                                            v-if="sortKey === column.key"
                                            class="admin-exceso-sort-hint"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                    <th scope="col">{{ $t('acciones') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item.id">
                                    <th scope="row">
                                        <router-link :to="adminExcessContributionDetailRoute(item.id)">
                                            {{ item.id }}
                                        </router-link>
                                    </th>
                                    <td>{{ item.user_name || $t('na') }}</td>
                                    <td>{{ item.from_town }}</td>
                                    <td>{{ item.to_town }}</td>
                                    <td>{{ formatTripContributionPesosLabel(item.seat_price_cents) }}</td>
                                    <td>{{ formatTripContributionPesosLabel(item.potential_seat_price_cents) }}</td>
                                    <td>{{ item.has_private_note ? $t('si') : $t('no') }}</td>
                                    <td>
                                        <router-link
                                            v-if="
                                                item.user_id &&
                                                Number(item.excess_contribution_support_tickets_count) > 0
                                            "
                                            :to="excessContributionSupportTicketsRoute(item.user_id)"
                                            class="btn btn-link btn-sm"
                                        >
                                            {{ item.excess_contribution_support_tickets_count }}
                                        </router-link>
                                        <span v-else>-</span>
                                    </td>
                                    <td>
                                        <span :class="excessContributionStatusClass(item.exceso_contribucion_status)">
                                            {{
                                                excessContributionStatusLabel(
                                                    item.exceso_contribucion_status,
                                                    (key) => $t(key)
                                                )
                                            }}
                                        </span>
                                    </td>
                                    <td>
                                        <AppButton
                                            variant="primary"
                                            size="sm"
                                            :to="adminExcessContributionDetailRoute(item.id)"
                                        >
                                            {{ $t('verDetalle') }}
                                        </AppButton>
                                        <router-link
                                            v-if="item.user_id"
                                            :to="getAdminUserProfileRoute(item.user_id)"
                                            class="btn btn-link btn-sm"
                                        >
                                            {{ $t('verPerfil') }}
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <template #no-data>
                        <div class="text-center" style="margin-top: 20px;">
                            <div class="alert alert-info">{{ $t('noHayExcesoContribucion') }}</div>
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
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    adminExcessContributionDetailRoute,
    buildTripExcessContributionListParams,
    excessContributionStatusClass,
    excessContributionStatusLabel,
    excessContributionSupportTicketsRoute,
    formatTripContributionPesosLabel,
    getNextTripExcessContributionSortState,
    getRequiresActionOnlyExcessContributions,
    parseTripExcessContributionListFromRoute,
    saveRequiresActionOnlyExcessContributions,
    TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS
} from '../../utils/adminTripExcessContributionList';

export default {
    name: 'AdminExcesoContribucion',
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            requiresActionOnly: getRequiresActionOnlyExcessContributions(),
            sortKey: null,
            sortDir: 'asc',
            sortableColumns: TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS
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
        requiresActionOnly(value) {
            saveRequiresActionOnlyExcessContributions(value);
            this.listPage = 1;
            this.syncRouteQuery();
        }
    },
    methods: {
        formatTripContributionPesosLabel,
        excessContributionStatusLabel,
        excessContributionStatusClass,
        adminExcessContributionDetailRoute,
        excessContributionSupportTicketsRoute,
        getAdminUserProfileRoute,
        initFromRouteQuery() {
            const parsed = parseTripExcessContributionListFromRoute(this.$route.query || {});
            this.listPage = parsed.page;
            this.listPerPage = parsed.perPage;
            this.sortKey = parsed.sortKey;
            this.sortDir = parsed.sortDir;
            if (this.$route.query.requires_action_only != null) {
                this.requiresActionOnly = parsed.requiresActionOnly;
                saveRequiresActionOnlyExcessContributions(parsed.requiresActionOnly);
            }
        },
        syncRouteQuery() {
            const query = {};
            if (this.listPage > 1) {
                query.page = String(this.listPage);
            }
            if (this.listPerPage !== DEFAULT_ADMIN_PER_PAGE) {
                query.per_page = String(this.listPerPage);
            }
            if (this.requiresActionOnly) {
                query.requires_action_only = '1';
            }
            if (this.sortKey) {
                query.sort = this.sortKey;
                query.direction = this.sortDir;
            }
            this.$router.replace({ query });
        },
        toggleSort(column) {
            const next = getNextTripExcessContributionSortState(
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
            const params = buildTripExcessContributionListParams({
                page: this.listPage,
                perPage: this.listPerPage,
                requiresActionOnly: this.requiresActionOnly,
                sortKey: this.sortKey,
                sortDir: this.sortDir
            });

            return api
                .getTripExcessContributions(params)
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
        saveRequiresActionOnlyExcessContributions(this.requiresActionOnly);
        this.fetchList();
    },
    components: {
        AdminLayout,
        AdminPaginationBar,
        Loading,
        AppButton
    }
};
</script>
<style scoped>
.requires-action-toggle {
    margin-bottom: 16px;
}

.admin-exceso-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-exceso-th-sort:hover {
    background: #f5f5f5;
}

.admin-exceso-sort-hint {
    color: #666;
    margin-left: 4px;
    font-size: 12px;
}
</style>
