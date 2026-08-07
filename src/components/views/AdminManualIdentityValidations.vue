<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('validacionesManuales') }}</h2>
                <div class="show-resolved-toggle">
                    <label>
                        <input v-model="showResolved" type="checkbox" />
                        {{ $t('mostrarResueltos') }}
                    </label>
                </div>
                <Loading :data="displayedList">
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
                            <tr v-for="item in displayedList" :key="item.id">
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user_name || $t('na') }}</td>
                                <td>{{ item.paid_at ? formatDate(item.paid_at) : '-' }}</td>
                                <td>{{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</td>
                                <td>{{ formatWaitingTime(item) }}</td>
                                <td>{{ item.paid ? $t('si') : $t('no') }}</td>
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
                                    <AppButton
                                        variant="primary"
                                        size="sm"
                                        :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                    >
                                        {{ $t('revisarSolicitud') }}
                                    </AppButton>
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
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { adminUserSupportTicketsRoute } from '../../utils/adminUserSupportTicketsLink';
import {
    getNextManualIdentityValidationSortState,
    getShowResolvedManualIdentityValidations,
    MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS,
    saveShowResolvedManualIdentityValidations,
    sortManualIdentityValidationsList
} from '../../utils/adminManualIdentityValidationsList';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel
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
            sortKey: null,
            sortDir: 'asc',
            sortableColumns: MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS
        };
    },
    computed: {
        displayedList() {
            if (!Array.isArray(this.list)) {
                return this.list;
            }

            return sortManualIdentityValidationsList(this.list, this.sortKey, this.sortDir);
        }
    },
    watch: {
        showResolved(value) {
            saveShowResolvedManualIdentityValidations(value);
            this.listPage = 1;
            this.fetchList();
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
        isApprovedWithImagesPending(item) {
            const status = item.review_status;
            const approved = status === 'approved' || status === 'approve';
            return approved && item.has_images === true;
        },
        toggleSort(column) {
            const next = getNextManualIdentityValidationSortState(
                this.sortKey,
                this.sortDir,
                column
            );

            this.sortKey = next.sortKey;
            this.sortDir = next.sortDir;
        },
        fetchList() {
            const api = new AdminApi();
            const params = {
                page: this.listPage,
                per_page: this.listPerPage
            };
            if (this.showResolved) {
                params.show_resolved = '1';
            }
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
            this.fetchList();
        },
        goNextPage() {
            const pagination = this.listMeta && this.listMeta.pagination;
            if (!pagination || pagination.current_page >= pagination.total_pages) {
                return;
            }
            this.listPage = pagination.current_page + 1;
            this.fetchList();
        },
        onPerPageChange(perPage) {
            this.listPerPage = perPage;
            this.listPage = 1;
            this.fetchList();
        }
    },
    mounted() {
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
