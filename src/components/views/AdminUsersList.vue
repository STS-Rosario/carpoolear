<template>
    <AdminLayout>
        <div class="admin-users-list container">
            <div class="row">
                <div class="col-md-22 col-md-offset-1">
                    <h3 class="admin-users-list__title">{{ $t('adminUsers') }}</h3>
                    <div class="form-group">
                        <label for="admin-users-search">{{ $t('buscar') }}</label>
                        <input
                            id="admin-users-search"
                            v-model="textSearch"
                            type="text"
                            class="form-control"
                            :placeholder="$t('escribeUnNombreYPresionaBuscar')"
                            @keyup="onSearchKeyup"
                        />
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
                        <table
                            class="table table-hover table-bordered admin-users-table"
                        >
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        class="admin-users-th-sort"
                                        @click="toggleSort('id')"
                                    >
                                        {{ $t('id') }}
                                        <span
                                            class="admin-users-sort-hint"
                                            v-if="sortKey === 'id'"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="admin-users-th-sort"
                                        @click="toggleSort('name')"
                                    >
                                        {{ $t('nombre') }}
                                        <span
                                            class="admin-users-sort-hint"
                                            v-if="sortKey === 'name'"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="admin-users-th-sort"
                                        @click="toggleSort('email')"
                                    >
                                        {{ $t('eMail') }}
                                        <span
                                            class="admin-users-sort-hint"
                                            v-if="sortKey === 'email'"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                    <th scope="col">
                                        {{ $t('numeroDeDocumento') }}
                                    </th>
                                    <th scope="col">
                                        {{ $t('numeroDeTelefono') }}
                                    </th>
                                    <th
                                        scope="col"
                                        class="admin-users-th-sort"
                                        @click="toggleSort('last_connection')"
                                    >
                                        {{ $t('ultimaConexion') }}
                                        <span
                                            class="admin-users-sort-hint"
                                            v-if="sortKey === 'last_connection'"
                                        >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="u in userList"
                                    :key="u.id"
                                    class="admin-users-row"
                                >
                                    <th scope="row">{{ u.id }}</th>
                                    <td>
                                        <router-link :to="{ name: 'admin-users-user', params: { userId: String(u.id) } }">
                                            {{ displayOrDash(u.name) }}
                                        </router-link>
                                    </td>
                                    <td>{{ displayOrDash(u.email) }}</td>
                                    <td>{{ displayDniOrDash(u.nro_doc) }}</td>
                                    <td>{{ displayOrDash(u.mobile_phone) }}</td>
                                    <td>{{ displayOrDash(u.last_connection) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p
                            v-if="!userList.length"
                            class="alert alert-warning"
                        >
                            {{ $t('noSeEncontroNingunUsuario') }}
                        </p>
                    </div>
                    <div
                        v-if="!listLoading && listMeta && listMeta.pagination && listMeta.pagination.total_pages > 1"
                        class="admin-users-pager-bar"
                    >
                        <button
                            type="button"
                            class="btn btn-default btn-sm"
                            :disabled="!listMeta.pagination || listMeta.pagination.current_page <= 1"
                            @click="goPrevPage"
                        >
                            {{ $t('anterior') }}
                        </button>
                        <span class="user-admin-pager-label text-muted">
                            {{
                                $t('adminUsuariosPagina', {
                                    current: listMeta.pagination.current_page,
                                    total: listMeta.pagination.total_pages
                                })
                            }}
                        </span>
                        <button
                            type="button"
                            class="btn btn-default btn-sm"
                            :disabled="!listMeta.pagination || listMeta.pagination.current_page >= listMeta.pagination.total_pages"
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
import { mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useAuthStore } from '../../stores/auth';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import { displayDniOrDash as formatDisplayDniOrDash } from '../../utils/formatDisplayDni';

const DEFAULT_SORT = { key: 'id', dir: 'desc' };

export default {
    name: 'admin-users-list',
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        })
    },
    data() {
        return {
            textSearch: '',
            userList: [],
            listLoading: false,
            listMeta: null,
            listPage: 1,
            sortKey: DEFAULT_SORT.key,
            sortDir: DEFAULT_SORT.dir,
            keyUpTimerId: 0,
            adminApi: null
        };
    },
    methods: {
        displayOrDash(value) {
            return value === null || value === undefined || value === '' ? '—' : value;
        },
        displayDniOrDash(value) {
            return formatDisplayDniOrDash(
                value,
                this.config && this.config.profile_id_format
            );
        },
        normalizedSearchQuery() {
            return (this.textSearch && this.textSearch.trim()) || '';
        },
        toggleSort(column) {
            if (this.sortKey === column) {
                this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = column;
                this.sortDir = column === 'id' ? 'desc' : 'asc';
            }
            this.fetchList(1);
        },
        onSearchKeyup() {
            if (this.keyUpTimerId) {
                clearTimeout(this.keyUpTimerId);
            }
            this.keyUpTimerId = setTimeout(() => {
                this.fetchList(1);
            }, 500);
        },
        syncRouteQuery() {
            const query = {
                page: String(this.listPage || 1),
                sort: this.sortKey,
                direction: this.sortDir
            };
            const q = this.normalizedSearchQuery();
            if (q) {
                query.name = q;
            }
            this.$router.replace({ query });
        },
        initFromRouteQuery() {
            const query = this.$route.query || {};
            const page = parseInt(query.page, 10);
            if (!Number.isNaN(page) && page > 0) {
                this.listPage = page;
            }
            if (query.sort) {
                this.sortKey = String(query.sort);
            }
            if (query.direction) {
                this.sortDir = String(query.direction) === 'asc' ? 'asc' : 'desc';
            }
            if (query.name) {
                this.textSearch = String(query.name);
            }
        },
        async fetchList(page) {
            this.listLoading = true;
            this.listPage = page || 1;
            const params = {
                page: this.listPage,
                per_page: 30,
                sort: this.sortKey,
                direction: this.sortDir
            };
            const q = this.normalizedSearchQuery();
            if (q) {
                params.name = q;
            }
            this.syncRouteQuery();
            try {
                const body = await this.adminApi.getUsersList(params);
                this.userList = body.data || [];
                this.listMeta = body.meta || null;
            } catch (e) {
                console.error(e);
                this.userList = [];
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
            const p = this.listMeta && this.listMeta.pagination;
            if (!p || p.current_page <= 1) return;
            this.fetchList(p.current_page - 1);
        },
        goNextPage() {
            const p = this.listMeta && this.listMeta.pagination;
            if (!p || p.current_page >= p.total_pages) return;
            this.fetchList(p.current_page + 1);
        },
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.initFromRouteQuery();
        this.fetchList(this.listPage || 1);
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.admin-users-list__title {
    margin-top: 0;
    margin-bottom: 16px;
}

.admin-users-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-users-th-sort:hover {
    background: #f5f5f5;
}

.admin-users-sort-hint {
    margin-left: 4px;
    font-size: 12px;
    color: #666;
}

.admin-users-pager-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 12px;
}

.user-admin-pager-label {
    flex: 1;
    text-align: center;
    font-size: 12px;
}
</style>
