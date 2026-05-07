<template>
    <AdminLayout v-if="row">
        <p>
            <router-link :to="{ name: 'admin-support-reply-templates' }">{{ $t('volverPlantillasRespuestas') }}</router-link>
        </p>
        <h3>{{ row.name }}</h3>
        <p class="text-muted">{{ row.short_description || '—' }}</p>
        <p class="small">
            {{ $t('tablaColumnaId') }}: {{ row.id }} · {{ capitalizeFirst($t('creado')) }}:
            {{ fullDate(row.created_at) }} · {{ capitalizeFirst($t('actualizado')) }}: {{ fullDate(row.updated_at) }}
            <span v-if="row.creator"> · {{ row.creator.name }}</span>
        </p>
        <hr />
        <div class="template-body-html" v-html="markdownToHtml(row.body_markdown || '')"></div>
        <p class="mtop-10">
            <router-link class="btn btn-default" :to="{ name: 'admin-support-reply-template-edit', params: { templateId: row.id } }">
                {{ $t('accionEditar') }}
            </router-link>
        </p>
    </AdminLayout>
    <AdminLayout v-else-if="error">
        <p class="alert alert-danger">{{ error }}</p>
        <router-link :to="{ name: 'admin-support-reply-templates' }">{{ $t('volverPlantillasRespuestas') }}</router-link>
    </AdminLayout>
    <AdminLayout v-else>
        <p class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { markdownToHtml } from '../../services/markdown';
import { useReplyTemplatesStore } from '../../stores/replyTemplates';
import dayjs from '../../dayjs';

export default {
    name: 'admin-support-reply-template-view',
    props: {
        templateId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            row: null,
            error: ''
        };
    },
    methods: {
        markdownToHtml,
        ...mapActions(useReplyTemplatesStore, {
            fetchAdminOne: 'fetchAdminOne'
        }),
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        fullDate(value) {
            if (!value) return '-';
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        },
        load() {
            this.error = '';
            this.row = null;
            const id = Number(this.templateId);
            return this.fetchAdminOne(id)
                .then((data) => {
                    this.row = data;
                })
                .catch(() => {
                    this.error = this.$t('errorCargandoPlantillasRespuestas');
                });
        }
    },
    watch: {
        templateId() {
            this.load();
        }
    },
    mounted() {
        this.load();
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.template-body-html {
    border: 1px solid #e5e5e5;
    padding: 12px;
    border-radius: 4px;
    background: #fafafa;
}
</style>
