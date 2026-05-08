<template>
    <AdminLayout>
        <p>
            <router-link :to="{ name: 'admin-support-reply-templates' }">{{ $t('volverPlantillasRespuestas') }}</router-link>
        </p>
        <h3>{{ isEdit ? $t('editarPlantillaRespuesta') : $t('nuevaPlantillaRespuesta') }}</h3>
        <p class="help-block">
            {{ $t('plantillaVariablesAyudaIntro') }}
            <code v-pre>{{nombre}}</code>
            {{ $t('plantillaVariablesAyudaConector') }}
            <code v-pre>{{nombreCompleto}}</code>
            {{ $t('plantillaVariablesAyudaSuffix') }}
        </p>
        <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>
        <div v-else-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</div>
        <div v-else>
            <div class="form-group">
                <label>{{ $t('nombrePlantilla') }} *</label>
                <input v-model="form.name" class="form-control" type="text" />
            </div>
            <div class="form-group">
                <label>{{ $t('descripcionCortaPlantilla') }}</label>
                <input v-model="form.short_description" class="form-control" type="text" />
            </div>
            <div class="form-group">
                <label>{{ $t('cuerpoPlantillaMensaje') }} *</label>
                <editor
                    :key="`${$route.name}-${templateId ?? 'new'}-${bodyEditorKey}`"
                    ref="bodyEditor"
                    :initial-value="form.body_markdown"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    height="200px"
                />
            </div>
            <button class="btn btn-primary" :disabled="saving" @click="save">
                {{ saving ? $t('guardando') : $t('guardarPlantilla') }}
            </button>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useReplyTemplatesStore } from '../../stores/replyTemplates';
import dialogs from '../../services/dialogs';

export default {
    name: 'admin-support-reply-template-form',
    props: {
        templateId: {
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
                name: '',
                short_description: '',
                body_markdown: ''
            },
            /** Remount Toast UI editor so content comes from initial-value only (avoids setMarkdown vs ProseMirror race). */
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
            return this.$route.name === 'admin-support-reply-template-edit';
        }
    },
    methods: {
        ...mapActions(useReplyTemplatesStore, {
            fetchAdminOne: 'fetchAdminOne',
            adminCreateTemplate: 'adminCreateTemplate',
            adminUpdateTemplate: 'adminUpdateTemplate'
        }),
        bumpBodyEditor() {
            this.bodyEditorKey += 1;
        },
        async load() {
            if (!this.isEdit) {
                this.form = { name: '', short_description: '', body_markdown: '' };
                this.loading = false;
                this.loadError = '';
                return;
            }
            this.loading = true;
            this.loadError = '';
            const id = Number(this.templateId);
            try {
                const data = await this.fetchAdminOne(id);
                this.form = {
                    name: data.name || '',
                    short_description: data.short_description || '',
                    body_markdown: data.body_markdown || ''
                };
            } catch (e) {
                this.loadError = this.$t('errorCargandoPlantillasRespuestas');
            } finally {
                this.loading = false;
                this.$nextTick(() => this.bumpBodyEditor());
            }
        },
        save() {
            const ed = this.$refs.bodyEditor;
            const body = ed && typeof ed.invoke === 'function' ? ed.invoke('getMarkdown') : this.form.body_markdown;
            const name = (this.form.name || '').trim();
            if (!name) {
                dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 2 });
                return;
            }
            if (!body || !String(body).trim()) {
                dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 2 });
                return;
            }
            const payload = {
                name,
                short_description: (this.form.short_description || '').trim() || null,
                body_markdown: body
            };
            this.saving = true;
            const p = this.isEdit
                ? this.adminUpdateTemplate(Number(this.templateId), payload)
                : this.adminCreateTemplate(payload);
            return p
                .then((data) => {
                    dialogs.message(this.$t('guardarCambio'), { estado: 'success', duration: 2 });
                    this.$router.replace({ name: 'admin-support-reply-template-view', params: { templateId: data.id } });
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
        templateId() {
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
