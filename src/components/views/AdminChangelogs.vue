<template>
    <AdminLayout>
        <h3>{{ $t('adminNavChangelog') }}</h3>
        <p class="mb-2">
            <router-link class="btn btn-primary" :to="{ name: 'admin-changelog-new' }">
                {{ $t('nuevoChangelog') }}
            </router-link>
        </p>
        <p v-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
        <p v-else-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-else-if="!safeRows.length" class="alert alert-warning">{{ $t('sinChangelogs') }}</p>
        <div v-else class="table-responsive">
            <table class="table table-hover admin-changelogs-table">
                <thead>
                    <tr>
                        <th>{{ capitalizeFirst($t('tablaColumnaId')) }}</th>
                        <th>{{ capitalizeFirst($t('changelogVersion')) }}</th>
                        <th>{{ capitalizeFirst($t('creado')) }}</th>
                        <th>{{ capitalizeFirst($t('actualizado')) }}</th>
                        <th>{{ capitalizeFirst($t('plantillaAcciones')) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in safeRows" :key="row.id">
                        <td>{{ row.id }}</td>
                        <td>{{ row.version }}</td>
                        <td :title="fullDate(row.created_at)">{{ relativeDate(row.created_at) }}</td>
                        <td :title="fullDate(row.updated_at)">{{ relativeDate(row.updated_at) }}</td>
                        <td class="changelog-actions">
                            <router-link
                                class="btn btn-xs btn-default"
                                :to="{ name: 'admin-changelog-view', params: { changelogId: row.id } }"
                            >
                                {{ $t('accionVer') }}
                            </router-link>
                            <router-link
                                class="btn btn-xs btn-default"
                                :to="{ name: 'admin-changelog-edit', params: { changelogId: row.id } }"
                            >
                                {{ $t('accionEditar') }}
                            </router-link>
                            <button type="button" class="btn btn-xs btn-danger" @click="remove(row.id)">
                                {{ $t('accionEliminar') }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useChangelogStore } from '../../stores/changelog';
import dayjs from '../../dayjs';

export default {
    name: 'admin-changelogs',
    data() {
        return {
            loading: false,
            error: ''
        };
    },
    computed: {
        ...mapState(useChangelogStore, {
            rows: 'adminList'
        }),
        safeRows() {
            return Array.isArray(this.rows) ? this.rows : [];
        }
    },
    methods: {
        ...mapActions(useChangelogStore, {
            fetchAdminList: 'fetchAdminList',
            adminDelete: 'adminDelete'
        }),
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        fullDate(value) {
            if (!value) return '-';
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        },
        relativeDate(value) {
            if (!value) return '-';
            return dayjs(value).fromNow();
        },
        reload() {
            this.loading = true;
            this.error = '';
            return this.fetchAdminList()
                .catch(() => {
                    this.error = this.$t('errorCargandoChangelogs');
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        remove(id) {
            if (!window.confirm(this.$t('eliminarChangelogConfirm'))) return;
            this.adminDelete(id).then(() => this.reload());
        }
    },
    mounted() {
        this.reload();
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.admin-changelogs-table {
    border: 1px solid #dcdcdc;
}

.admin-changelogs-table thead th {
    background-color: #f3f6fa;
    border: 1px solid #dcdcdc;
}

.admin-changelogs-table tbody td {
    border: 1px solid #e5e5e5;
}

.changelog-actions .btn {
    margin-right: 4px;
    margin-bottom: 4px;
}
</style>
