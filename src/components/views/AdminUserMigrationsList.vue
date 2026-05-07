<template>
    <AdminLayout>
        <div class="admin-user-migrations container">
            <div class="row">
                <div class="col-md-22 col-md-offset-1">
                    <div class="admin-user-migrations__header">
                        <h3 class="admin-user-migrations__title">{{ $t('migrarUsuarios') }}</h3>
                        <router-link
                            class="btn btn-primary"
                            :to="{ name: 'admin-user-migration-new' }"
                        >
                            {{ $t('nuevaMigracionDeUsuario') }}
                        </router-link>
                    </div>
                    <div v-if="listLoading" class="alert alert-info">
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoUsuarios') }}
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('migracionId') }}</th>
                                    <th scope="col">{{ $t('usuarioMantenido') }}</th>
                                    <th scope="col">{{ $t('usuarioBorrado') }}</th>
                                    <th scope="col">{{ $t('adminQueLoHizo') }}</th>
                                    <th scope="col">{{ $t('fechaDeMigracion') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in rows" :key="row.id">
                                    <th scope="row">{{ row.id }}</th>
                                    <td>
                                        <router-link
                                            :to="{
                                                name: 'admin-users-user',
                                                params: { userId: String(row.user_id_kept) }
                                            }"
                                        >{{ row.user_id_kept }}</router-link>
                                    </td>
                                    <td>
                                        <router-link
                                            :to="{
                                                name: 'admin-users-user',
                                                params: { userId: String(row.user_id_removed) }
                                            }"
                                        >{{ row.user_id_removed }}</router-link>
                                    </td>
                                    <td>{{ adminLabel(row) }}</td>
                                    <td>{{ formatDate(row.created_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="!rows.length" class="alert alert-warning">
                            {{ $t('noSeEncontroNingunUsuario') }}
                        </p>
                    </div>
                    <div
                        v-if="!listLoading && pagination && pagination.total_pages > 1"
                        class="admin-user-migrations__pager"
                    >
                        <button
                            type="button"
                            class="btn btn-default btn-sm"
                            :disabled="pagination.current_page <= 1"
                            @click="goPrevPage"
                        >
                            {{ $t('anterior') }}
                        </button>
                        <span class="text-muted admin-user-migrations__pager-label">
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
                            :disabled="pagination.current_page >= pagination.total_pages"
                            @click="goNextPage"
                        >
                            {{ $t('siguiente') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import dayjs from '../../dayjs';

export default {
    name: 'admin-user-migrations-list',
    data() {
        return {
            listLoading: false,
            rows: [],
            listMeta: null,
            listPage: 1,
            adminApi: null
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
        adminLabel(row) {
            if (row.admin && row.admin.name) {
                return `${row.admin.name} (#${row.admin.id})`;
            }
            return row.admin_user_id ? `#${row.admin_user_id}` : '—';
        },
        formatDate(iso) {
            if (!iso) return '—';
            return dayjs(iso).format('YYYY-MM-DD HH:mm');
        },
        async fetchList(page) {
            this.listLoading = true;
            this.listPage = page || 1;
            try {
                const body = await this.adminApi.getUserMigrations({
                    page: this.listPage,
                    per_page: 20
                });
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
        }
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.fetchList(1);
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.admin-user-migrations__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.admin-user-migrations__title {
    margin: 0;
}

.admin-user-migrations__pager {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 12px;
}

.admin-user-migrations__pager-label {
    flex: 1;
    text-align: center;
    font-size: 12px;
}
</style>
