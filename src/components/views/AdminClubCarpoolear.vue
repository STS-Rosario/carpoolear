<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('adminClubCarpoolear') }}</h2>
                <AppSegmentToggle
                    class="admin-club-status-toggle"
                    :model-value="status"
                    :options="membershipStatusOptions"
                    @update:modelValue="setStatus"
                />
                <form class="admin-club-filters" @submit.prevent="applyFilters">
                    <AppInput
                        id="admin-club-search"
                        v-model="q"
                        type="search"
                        :label="$t('buscar')"
                    />
                    <AppField label-for="admin-club-tier" :label="$t('plan')">
                        <select
                            id="admin-club-tier"
                            v-model="tier"
                            class="admin-club-filters__select"
                            @change="applyFilters"
                        >
                            <option value="">{{ $t('todos') }}</option>
                            <option value="cafe">{{ $t('donationTierCafe') }}</option>
                            <option value="beer">{{ $t('donationTierBeer') }}</option>
                            <option value="food">{{ $t('donationTierFood') }}</option>
                        </select>
                    </AppField>
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
                                        v-for="column in visibleColumns"
                                        :key="column.key"
                                        scope="col"
                                        class="admin-club-th-sort"
                                        @click="toggleSort(column.key)"
                                    >
                                        {{ $t(column.labelKey) }}
                                        <span
                                            v-if="sortKey === column.key"
                                            class="admin-club-sort-hint"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item.user_id">
                                    <td>
                                        <router-link
                                            v-if="item.user_id"
                                            :to="getAdminUserProfileRoute(item.user_id)"
                                        >
                                            {{ item.user_name || $t('usuarioAnonimo') }}
                                        </router-link>
                                        <span v-else>{{ item.user_name || $t('usuarioAnonimo') }}</span>
                                    </td>
                                    <td>{{ item.joined_at || $t('na') }}</td>
                                    <td>{{ item.last_paid_at || $t('na') }}</td>
                                    <td>{{ item.tier_slug || $t('na') }}</td>
                                    <td>{{ formatAmountCents(item.total_donated_cents) }}</td>
                                    <td v-if="status === 'former'">{{ item.left_at || $t('na') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <template #no-data>
                        <div class="text-center" style="margin-top: 20px;">
                            <div class="alert alert-info">{{ $t('noHayMiembrosClub') }}</div>
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
import AppSegmentToggle from '../ui/AppSegmentToggle.vue';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    ADMIN_CLUB_MEMBERS_SORT_COLUMNS,
    buildClubMembersListParams,
    getNextClubMembersSortState,
    parseClubMembersListFromRoute
} from '../../utils/adminClubCarpoolearMembersList';

export default {
    name: 'AdminClubCarpoolear',
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            status: 'current',
            q: '',
            tier: '',
            sortKey: 'joined_at',
            sortDir: 'desc'
        };
    },
    computed: {
        membershipStatusOptions() {
            return [
                {
                    value: 'current',
                    label: this.$t('miembrosActuales')
                },
                {
                    value: 'former',
                    label: this.$t('miembrosAnteriores')
                }
            ];
        },
        visibleColumns() {
            if (this.status === 'former') {
                return ADMIN_CLUB_MEMBERS_SORT_COLUMNS;
            }
            return ADMIN_CLUB_MEMBERS_SORT_COLUMNS.filter((column) => column.key !== 'left_at');
        }
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
        formatAmountCents(amountCents) {
            const pesos = Math.round(Number(amountCents || 0) / 100);
            return `$ ${pesos.toLocaleString('es-AR')}`;
        },
        initFromRouteQuery() {
            const parsed = parseClubMembersListFromRoute(this.$route.query || {});
            this.status = parsed.status;
            this.q = parsed.q;
            this.tier = parsed.tier;
            this.sortKey = parsed.sortKey || 'joined_at';
            this.sortDir = parsed.sortDir;
            this.listPage = parsed.page;
            this.listPerPage = parsed.perPage;
        },
        syncRouteQuery() {
            const query = this.status === 'former'
                ? { status: 'former' }
                : {};
            if (this.q) {
                query.q = this.q;
            }
            if (this.tier) {
                query.tier = this.tier;
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
        setStatus(nextStatus) {
            this.status = nextStatus === 'former' ? 'former' : 'current';
            this.listPage = 1;
            this.syncRouteQuery();
        },
        applyFilters() {
            this.listPage = 1;
            this.syncRouteQuery();
        },
        toggleSort(column) {
            const next = getNextClubMembersSortState(
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
            const params = buildClubMembersListParams({
                status: this.status,
                q: this.q,
                tier: this.tier,
                sortKey: this.sortKey,
                sortDir: this.sortDir,
                page: this.listPage,
                perPage: this.listPerPage
            });

            return api
                .getClubCarpoolearMembers(params)
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
        AppSegmentToggle,
        Loading
    }
};
</script>
<style scoped>
.admin-club-status-toggle {
    margin-bottom: 16px;
}

.admin-club-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 16px;
}

.admin-club-filters :deep(.app-field),
.admin-club-filters :deep(.app-input) {
    flex: 1 1 160px;
    max-width: 220px;
    margin-bottom: 0;
}

.admin-club-filters__select {
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

.admin-club-filters__select:focus {
    outline: none;
}

.admin-club-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-club-th-sort:hover {
    background: #f5f5f5;
}

.admin-club-sort-hint {
    color: #666;
    margin-left: 4px;
    font-size: 12px;
}
</style>
