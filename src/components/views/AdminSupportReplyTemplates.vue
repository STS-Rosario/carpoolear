<template>
    <AdminLayout>
        <p>
            <router-link :to="{ name: 'admin-support-tickets' }">{{ $t('volverListaTickets') }}</router-link>
        </p>
        <h3>{{ $t('plantillasRespuestas') }}</h3>
        <p class="mb-2">
            <router-link class="btn btn-primary" :to="{ name: 'admin-support-reply-template-new' }">
                {{ $t('nuevaPlantillaRespuesta') }}
            </router-link>
        </p>
        <p v-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
        <p v-else-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-else-if="!safeRows.length" class="alert alert-warning">{{ $t('sinPlantillasRespuestas') }}</p>
        <div v-else class="table-responsive">
            <table class="table table-hover support-reply-templates-table">
                <thead>
                    <tr>
                        <th>{{ capitalizeFirst($t('tablaColumnaId')) }}</th>
                        <th>{{ capitalizeFirst($t('nombrePlantilla')) }}</th>
                        <th>{{ capitalizeFirst($t('descripcionCortaPlantilla')) }}</th>
                        <th>{{ capitalizeFirst($t('creado')) }}</th>
                        <th>{{ capitalizeFirst($t('actualizado')) }}</th>
                        <th>{{ capitalizeFirst($t('plantillaAcciones')) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in safeRows" :key="row.id">
                        <td>{{ row.id }}</td>
                        <td>{{ row.name }}</td>
                        <td>{{ row.short_description || '—' }}</td>
                        <td :title="fullDate(row.created_at)">{{ relativeDate(row.created_at) }}</td>
                        <td :title="fullDate(row.updated_at)">{{ relativeDate(row.updated_at) }}</td>
                        <td class="reply-template-actions">
                            <router-link
                                class="btn btn-xs btn-default"
                                :to="{ name: 'admin-support-reply-template-view', params: { templateId: row.id } }"
                            >
                                {{ $t('accionVer') }}
                            </router-link>
                            <router-link
                                class="btn btn-xs btn-default"
                                :to="{ name: 'admin-support-reply-template-edit', params: { templateId: row.id } }"
                            >
                                {{ $t('accionEditar') }}
                            </router-link>
                            <button type="button" class="btn btn-xs btn-default" @click="duplicate(row.id)">
                                {{ $t('accionDuplicar') }}
                            </button>
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
import { useReplyTemplatesStore } from '../../stores/replyTemplates';
import dayjs from '../../dayjs';

export default {
    name: 'admin-support-reply-templates',
    data() {
        return {
            loading: false,
            error: ''
        };
    },
    computed: {
        ...mapState(useReplyTemplatesStore, {
            rows: 'adminList'
        }),
        safeRows() {
            return Array.isArray(this.rows) ? this.rows : [];
        }
    },
    methods: {
        ...mapActions(useReplyTemplatesStore, {
            fetchAdminList: 'fetchAdminList',
            adminDuplicateTemplate: 'adminDuplicateTemplate',
            adminDeleteTemplate: 'adminDeleteTemplate'
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
                    this.error = this.$t('errorCargandoPlantillasRespuestas');
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        duplicate(id) {
            this.adminDuplicateTemplate(id).then(() => this.reload());
        },
        remove(id) {
            if (!window.confirm(this.$t('eliminarPlantillaConfirm'))) return;
            this.adminDeleteTemplate(id).then(() => this.reload());
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
.support-reply-templates-table {
    border: 1px solid #dcdcdc;
}

.support-reply-templates-table thead th {
    background-color: #f3f6fa;
    border: 1px solid #dcdcdc;
}

.support-reply-templates-table tbody td {
    border: 1px solid #e5e5e5;
}

.reply-template-actions .btn {
    margin-right: 4px;
    margin-bottom: 4px;
}
</style>
