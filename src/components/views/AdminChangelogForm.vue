<template>
    <AdminLayout>
        <p>
            <router-link :to="{ name: 'admin-changelogs' }">{{ $t('volverChangelogs') }}</router-link>
        </p>
        <h3>{{ isEdit ? $t('editarChangelog') : $t('nuevoChangelog') }}</h3>
        <p class="help-block">{{ $t('changelogVersionAyuda') }}</p>
        <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>
        <div v-else-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</div>
        <div v-else>
            <div class="form-group">
                <label>{{ $t('changelogVersion') }} *</label>
                <input v-model="form.version" class="form-control" type="text" placeholder="3.2.3" />
            </div>
            <div class="form-group">
                <label>{{ $t('changelogContenido') }} *</label>
                <editor
                    :key="`${$route.name}-${changelogId ?? 'new'}-${bodyEditorKey}`"
                    ref="bodyEditor"
                    :initial-value="form.body_markdown"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    height="240px"
                />
            </div>
            <button class="btn btn-primary" :disabled="saving" @click="save">
                {{ saving ? $t('guardando') : $t('guardarChangelog') }}
            </button>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useChangelogStore } from '../../stores/changelog';
import dialogs from '../../services/dialogs';

export default {
    name: 'admin-changelog-form',
    props: {
        changelogId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            loading: false,
            loadError: '',
            saving: false,
            form: {
                version: '',
                body_markdown: ''
            },
            bodyEditorKey: 0,
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    computed: {
        isEdit() {
            return this.$route.name === 'admin-changelog-edit';
        }
    },
    methods: {
        ...mapActions(useChangelogStore, {
            fetchAdminOne: 'fetchAdminOne',
            adminCreate: 'adminCreate',
            adminUpdate: 'adminUpdate'
        }),
        bumpBodyEditor() {
            this.bodyEditorKey += 1;
        },
        async load() {
            if (!this.isEdit) {
                this.form = { version: '', body_markdown: '' };
                this.loading = false;
                this.loadError = '';
                return;
            }
            this.loading = true;
            this.loadError = '';
            const id = Number(this.changelogId);
            try {
                const data = await this.fetchAdminOne(id);
                this.form = {
                    version: data.version || '',
                    body_markdown: data.body_markdown || ''
                };
            } catch (e) {
                this.loadError = this.$t('errorCargandoChangelogs');
            } finally {
                this.loading = false;
                this.$nextTick(() => this.bumpBodyEditor());
            }
        },
        save() {
            const ed = this.$refs.bodyEditor;
            const body =
                ed && typeof ed.invoke === 'function'
                    ? ed.invoke('getHTML') || ed.invoke('getMarkdown')
                    : this.form.body_markdown;
            const version = (this.form.version || '').trim();
            if (!version) {
                dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 2 });
                return;
            }
            if (!body || !String(body).trim()) {
                dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 2 });
                return;
            }
            const payload = {
                version,
                body_markdown: body
            };
            this.saving = true;
            const p = this.isEdit
                ? this.adminUpdate(Number(this.changelogId), payload)
                : this.adminCreate(payload);
            return p
                .then((data) => {
                    dialogs.message(this.$t('guardarCambio'), { estado: 'success', duration: 2 });
                    this.$router.replace({ name: 'admin-changelog-view', params: { changelogId: data.id } });
                })
                .catch(() => {
                    dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 3 });
                })
                .finally(() => {
                    this.saving = false;
                });
        }
    },
    watch: {
        '$route.name'() {
            this.load();
        },
        changelogId() {
            this.load();
        }
    },
    mounted() {
        this.load();
    },
    components: {
        editor: ToastUiEditor,
        AdminLayout
    }
};
</script>
