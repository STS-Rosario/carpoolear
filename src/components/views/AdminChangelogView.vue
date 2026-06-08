<template>
    <AdminLayout v-if="row">
        <p>
            <router-link :to="{ name: 'admin-changelogs' }">{{ $t('volverChangelogs') }}</router-link>
        </p>
        <h3>{{ $t('detalleChangelog') }} {{ row.version }}</h3>
        <p class="small">
            {{ $t('tablaColumnaId') }}: {{ row.id }} · {{ capitalizeFirst($t('creado')) }}:
            {{ fullDate(row.created_at) }} · {{ capitalizeFirst($t('actualizado')) }}: {{ fullDate(row.updated_at) }}
            <span v-if="row.creator"> · {{ row.creator.name }}</span>
        </p>
        <hr />
        <MarkdownPreview class="changelog-body-html" :source="row.body_markdown || ''" />
        <p class="mtop-10">
            <router-link class="btn btn-default" :to="{ name: 'admin-changelog-edit', params: { changelogId: row.id } }">
                {{ $t('accionEditar') }}
            </router-link>
        </p>
    </AdminLayout>
    <AdminLayout v-else-if="error">
        <p class="alert alert-danger">{{ error }}</p>
        <router-link :to="{ name: 'admin-changelogs' }">{{ $t('volverChangelogs') }}</router-link>
    </AdminLayout>
    <AdminLayout v-else>
        <p class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import MarkdownPreview from '../elements/MarkdownPreview.vue';
import { useChangelogStore } from '../../stores/changelog';
import dayjs from '../../dayjs';

export default {
    name: 'admin-changelog-view',
    props: {
        changelogId: {
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
        ...mapActions(useChangelogStore, {
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
            const id = Number(this.changelogId);
            return this.fetchAdminOne(id)
                .then((data) => {
                    this.row = data;
                })
                .catch(() => {
                    this.error = this.$t('errorCargandoChangelogs');
                });
        }
    },
    watch: {
        changelogId() {
            this.load();
        }
    },
    mounted() {
        this.load();
    },
    components: {
        AdminLayout,
        MarkdownPreview
    }
};
</script>

<style scoped>
.changelog-body-html {
    border: 1px solid #e5e5e5;
    padding: 12px;
    border-radius: 4px;
    background: #fafafa;
}
</style>
