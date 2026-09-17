<template>
    <AdminLayout>
        <div class="admin-action-logs container">
            <div class="row">
                <div class="col-md-22 col-md-offset-1">
                    <h3>{{ $t('adminNavActionLogs') }}</h3>
                    <form
                        class="form-inline admin-action-logs__filters"
                        @submit.prevent="applyFilters"
                    >
                        <AppInput
                            id="admin-action-logs-admin-user"
                            v-model="filterAdminUserId"
                            type="number"
                            :label="$t('adminActionLogsAdminUser')"
                        />
                        <AppField
                            label-for="admin-action-logs-action"
                            :label="$t('adminActionLogsAction')"
                        >
                            <select
                                id="admin-action-logs-action"
                                v-model="filterAction"
                            >
                                <option value="">{{ $t('adminActionLogsAllActions') }}</option>
                                <option
                                    v-for="action in actionOptions"
                                    :key="action"
                                    :value="action"
                                >
                                    {{ action }}
                                </option>
                            </select>
                        </AppField>
                        <AppInput
                            id="admin-action-logs-from"
                            v-model="filterFrom"
                            type="date"
                            :label="$t('adminActionLogsFrom')"
                        />
                        <AppInput
                            id="admin-action-logs-to"
                            v-model="filterTo"
                            type="date"
                            :label="$t('adminActionLogsTo')"
                        />
                        <AppInput
                            id="admin-action-logs-target-user"
                            v-model="filterTargetUserId"
                            type="number"
                            :label="$t('adminActionLogsTargetUser')"
                        />
                        <AppButton variant="secondary" size="sm" type="submit">
                            {{ $t('buscar') }}
                        </AppButton>
                    </form>
                    <div v-if="listLoading" class="alert alert-info">
                        {{ $t('cargandoNotificaciones') }}
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('id') }}</th>
                                    <th scope="col">{{ $t('adminActionLogsAction') }}</th>
                                    <th scope="col">{{ $t('adminActionLogsAdminUser') }}</th>
                                    <th scope="col">{{ $t('adminActionLogsTargetUser') }}</th>
                                    <th scope="col">{{ $t('adminActionLogsDetails') }}</th>
                                    <th scope="col">{{ $t('creado') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in rows" :key="row.id">
                                    <th scope="row">{{ row.id }}</th>
                                    <td>{{ row.action }}</td>
                                    <td>
                                        <router-link
                                            v-if="row.admin_user_id"
                                            :to="{
                                                name: 'admin-users-user',
                                                params: { userId: String(row.admin_user_id) }
                                            }"
                                        >
                                            {{ row.admin_user_name || row.admin_user_id }}
                                        </router-link>
                                        <span v-else>—</span>
                                    </td>
                                    <td>
                                        <router-link
                                            v-if="row.target_user_id"
                                            :to="{
                                                name: 'admin-users-user',
                                                params: { userId: String(row.target_user_id) }
                                            }"
                                        >
                                            {{ row.target_user_name || row.target_user_id }}
                                        </router-link>
                                        <span v-else>—</span>
                                    </td>
                                    <td>
                                        <pre class="admin-action-logs__details">{{ formatDetails(row.details) }}</pre>
                                    </td>
                                    <td>{{ formatDate(row.created_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!rows.length" class="alert alert-warning">
                            {{ $t('adminActionLogsEmpty') }}
                        </p>
                    </div>
                    <AdminPaginationBar
                        v-if="!listLoading && pagination"
                        :pagination="pagination"
                        :per-page="listPerPage"
                        :loading="listLoading"
                        @prev="goPrevPage"
                        @next="goNextPage"
                        @update:per-page="onPerPageChange"
                    />
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminPaginationBar from '../AdminPaginationBar.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import dayjs from '../../dayjs';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';

export default {
    name: 'admin-action-logs',
    data() {
        return {
            listLoading: false,
            rows: [],
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            filterAdminUserId: '',
            filterAction: '',
            filterFrom: '',
            filterTo: '',
            filterTargetUserId: '',
            adminApi: null,
            actionOptions: [
                'user_update',
                'identity_review',
                'account_delete_request_update',
                'support_ticket_update',
                'user_impersonate_start',
                'user_impersonate_stop',
                'user_migrate',
                'user_delete',
                'user_anonymize',
                'user_ban_and_anonymize',
                'rating_update',
                'reference_update',
                'maintenance_update'
            ]
        };
    },
    computed: {
        pagination() {
            return this.listMeta && this.listMeta.pagination
                ? this.listMeta.pagination
                : null;
        }
    },
    methods: {
        formatDate(iso) {
            if (!iso) return '—';
            return dayjs(iso).format('YYYY-MM-DD HH:mm');
        },
        formatDetails(details) {
            if (!details || (typeof details === 'object' && !Object.keys(details).length)) {
                return '—';
            }
            try {
                return JSON.stringify(details);
            } catch (e) {
                return String(details);
            }
        },
        filterParams() {
            const params = {
                page: this.listPage,
                per_page: this.listPerPage
            };
            if (this.filterAdminUserId) {
                params.admin_user_id = this.filterAdminUserId;
            }
            if (this.filterAction) {
                params.action = this.filterAction;
            }
            if (this.filterFrom) {
                params.from = this.filterFrom;
            }
            if (this.filterTo) {
                params.to = this.filterTo;
            }
            if (this.filterTargetUserId) {
                params.target_user_id = this.filterTargetUserId;
            }
            return params;
        },
        applyFilters() {
            this.fetchList(1);
        },
        async fetchList(page) {
            this.listLoading = true;
            this.listPage = page || 1;
            try {
                const body = await this.adminApi.getActionLogs(this.filterParams());
                this.rows = body.data || [];
                this.listMeta = body.meta || null;
            } catch (e) {
                console.error(e);
                this.rows = [];
                this.listMeta = null;
                dialogs.message(this.$t('errorCargandoListadoUsuarios'), {
                    duration: 5,
                    estado: 'error'
                });
            } finally {
                this.listLoading = false;
            }
        },
        goPrevPage() {
            const p = this.pagination;
            if (!p || p.current_page <= 1) return;
            this.fetchList(p.current_page - 1);
        },
        goNextPage() {
            const p = this.pagination;
            if (!p || p.current_page >= p.total_pages) return;
            this.fetchList(p.current_page + 1);
        },
        onPerPageChange(perPage) {
            this.listPerPage = perPage;
            this.fetchList(1);
        }
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.fetchList(1);
    },
    components: {
        AdminLayout,
        AdminPaginationBar,
        AppButton,
        AppField,
        AppInput
    }
};
</script>

<style scoped>
.admin-action-logs__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 16px;
}

.admin-action-logs__details {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 12px;
}
</style>
