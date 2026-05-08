<template>
    <AdminLayout>
        <p>
            <router-link :to="{ name: 'admin-support-reply-templates' }">{{ $t('volverPlantillasRespuestas') }}</router-link>
        </p>
        <h3>{{ isEdit ? $t('editarPlantillaRespuesta') : $t('nuevaPlantillaRespuesta') }}</h3>
        <p class="help-block">{{ $t('plantillaVariablesAyuda') }}</p>
        <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>
        <div v-else-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</div>
        <div v-else class="reply-template-form-content">
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
import { log343bb5 } from '../../debug/session343bb5Log';

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
            log343bb5('H-B,H-D', 'AdminSupportReplyTemplateForm:bumpBodyEditor', 'editor-key-increment', {
                bodyEditorKey: this.bodyEditorKey
            });
        },
        async load() {
            log343bb5('H-D,H-B', 'AdminSupportReplyTemplateForm:load:entry', 'load-started', {
                isEdit: this.isEdit,
                routeName: this.$route.name,
                templateId: this.templateId
            });
            if (!this.isEdit) {
                this.form = { name: '', short_description: '', body_markdown: '' };
                this.loading = false;
                this.loadError = '';
                log343bb5('H-B', 'AdminSupportReplyTemplateForm:load:new-branch', 'load-new-done-skip-bump', {
                    loading: this.loading,
                    loadError: this.loadError,
                    routeKey: `${this.$route.name}-${this.templateId ?? 'new'}`
                });
                // #region agent log
                this.$nextTick(() => {
                    const doc = typeof document !== 'undefined' ? document : null;
                    const mainById = doc ? doc.getElementById('main') : null;
                    const mainInApp = doc ? doc.querySelector('#app main') : null;
                    const mainPick = mainInApp || mainById;
                    const appRoot = doc ? doc.getElementById('app') : null;
                    const inMain =
                        mainPick && mainPick.querySelectorAll
                            ? mainPick.querySelectorAll('.toast-ui-editor-mount').length
                            : -1;
                    const rootElType =
                        this.$el && typeof this.$el.nodeType === 'number' ? this.$el.nodeType : -1;
                    const inSelf =
                        this.$el && typeof this.$el.querySelectorAll === 'function'
                            ? this.$el.querySelectorAll('.toast-ui-editor-mount').length
                            : -1;
                    const subTree = this.$ && this.$.subTree ? this.$.subTree : null;
                    const fragmentAnchor =
                        subTree && Object.prototype.hasOwnProperty.call(subTree, 'anchor')
                            ? subTree.anchor
                            : null;
                    const fragmentAnchorType =
                        fragmentAnchor && typeof fragmentAnchor.nodeType === 'number'
                            ? fragmentAnchor.nodeType
                            : -1;
                    const fragmentParentType =
                        this.$el && this.$el.parentNode && typeof this.$el.parentNode.nodeType === 'number'
                            ? this.$el.parentNode.nodeType
                            : -1;
                    const fragmentParentChildCount =
                        this.$el && this.$el.parentNode && this.$el.parentNode.childNodes
                            ? this.$el.parentNode.childNodes.length
                            : -1;
                    log343bb5('H8,H9', 'AdminSupportReplyTemplateForm:load:new-branch+tick', 'post-new-load-dom', {
                        inMainToastMountCountScoped: inMain,
                        mainPickSameAsIdMain: !!(mainById && mainInApp && mainById === mainInApp),
                        idMainToastCount: mainById?.querySelectorAll?.('.toast-ui-editor-mount').length ?? -1,
                        appMainToastCount: mainInApp?.querySelectorAll?.('.toast-ui-editor-mount').length ?? -1,
                        appFormContentCount: appRoot?.querySelectorAll?.('.reply-template-form-content').length ?? -1,
                        appInfoCount: appRoot?.querySelectorAll?.('.alert-info').length ?? -1,
                        appDangerCount: appRoot?.querySelectorAll?.('.alert-danger').length ?? -1,
                        appInnerLen: appRoot ? appRoot.innerHTML.length : -1,
                        hasNavInApp: !!(appRoot && appRoot.querySelector('.admin-nav-sidebar')),
                        rootElNodeType: rootElType,
                        fragmentAnchorNodeType: fragmentAnchorType,
                        fragmentParentNodeType: fragmentParentType,
                        fragmentParentChildCount,
                        inSelfToastMountCount: inSelf,
                        refsBodyEditor: !!this.$refs.bodyEditor,
                        routeName: this.$route.name,
                        fullPath: this.$route.fullPath
                    });
                });
                // #endregion
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
                log343bb5('H-D', 'AdminSupportReplyTemplateForm:load:finally', 'load-edit-finally', {
                    loadError: this.loadError,
                    bodyLen: (this.form.body_markdown || '').length
                });
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
        loading(value) {
            // #region agent log
            log343bb5('H10', 'AdminSupportReplyTemplateForm:watch:loading', 'loading-changed', {
                value
            });
            // #endregion
        },
        loadError(value) {
            // #region agent log
            log343bb5('H10', 'AdminSupportReplyTemplateForm:watch:loadError', 'loadError-changed', {
                hasError: !!value,
                len: value ? String(value).length : 0
            });
            // #endregion
        },
        '$route.name'() {
            this.load();
        },
        templateId() {
            this.load();
        }
    },
    mounted() {
        log343bb5('H-B,H-D', 'AdminSupportReplyTemplateForm:mounted', 'form-mounted', {
            routeName: this.$route.name,
            isEdit: this.isEdit,
            loading: this.loading,
            loadError: this.loadError,
            bodyEditorKey: this.bodyEditorKey
        });
        this.load();
        this.$nextTick(() =>
            log343bb5('H-D', 'AdminSupportReplyTemplateForm:mounted+tick', 'after-first-tick', {
                loading: this.loading,
                loadError: this.loadError
            })
        );
    },
    beforeUnmount() {
        // #region agent log
        log343bb5('H11', 'AdminSupportReplyTemplateForm:beforeUnmount', 'form-before-unmount', {
            routeName: this.$route.name
        });
        // #endregion
    },
    components: {
        editor: ToastUiEditor,
        AdminLayout
    }
};
</script>
