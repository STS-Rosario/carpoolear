<template>
    <AccountSettingsLayout>
        <div class="ticket-new-page">
            <div class="ticket-new-page__card">
                <h1 class="ticket-new-page__heading">{{ $t('soporte') }}</h1>

                <AppField :label="$t('categoriaTicket')" label-for="ticket-new-type">
                    <select
                        id="ticket-new-type"
                        v-model="form.type"
                        class="ticket-new-page__select"
                    >
                        <option
                            v-for="option in ticketTypeOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ $t(option.labelKey) }}
                        </option>
                    </select>
                </AppField>

                <AppInput
                    v-model="form.subject"
                    :label="$t('asuntoTicket')"
                    :placeholder="$t('asuntoTicketPlaceholder')"
                />

                <AppField
                    class="ticket-new-page__editor-field"
                    :label="$t('mensajeTicket')"
                >
                    <editor
                        v-if="showCreateEditor"
                        :key="createEditorKey"
                        ref="createEditor"
                        :initial-value="editorInitialValue"
                        :options="editorOptionsWithPlaceholder"
                        initial-edit-type="wysiwyg"
                        height="180px"
                        class="ticket-new-page__editor"
                        @load="onCreateEditorLoad"
                    />
                </AppField>

                <AppField
                    class="ticket-new-page__attachments-field"
                    :label="$t('adjuntosTicket')"
                    :hint="$t('maximo3Imagenes')"
                >
                    <input
                        type="file"
                        class="ticket-new-page__file"
                        :accept="imageUploadAccept"
                        multiple
                        @change="onCreateAttachments"
                    />
                </AppField>

                <AppButton variant="primary" @click="createTicket">
                    {{ $t('crearTicket') }}
                </AppButton>
            </div>
        </div>
    </AccountSettingsLayout>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import { useTicketsStore } from '../../stores/tickets';
import dialogs from '../../services/dialogs';
import {
    DEFAULT_USER_TICKET_TYPE,
    USER_TICKET_TYPE_OPTIONS,
    USER_TICKET_TYPE_VALUES
} from '../../utils/supportTicketTypeOptions';
import {
    IMAGE_UPLOAD_ACCEPT
} from '../../utils/imageUpload';
import { applyImageUploadSelection } from '../../utils/imageUploadSelection';
import { compressImageFilesForUpload } from '../../utils/imageUploadCompress';
import {
    appendSupportInfoToMessage,
    fetchSupportInfoSnapshot,
    isEmptyUserTicketMessage
} from '../../utils/supportInfo';
import {
    buildPrefilledTicketEditorMarkdown,
    focusPrefilledTicketEditorAtStart
} from '../../utils/ticketMessagePrefill.js';
import { handleGenericApiError } from '../../utils/genericApiErrorHandling.js';
import { isEnabledAsync } from '../../services/debug';

export default {
    name: 'ticket-new',
    data() {
        return {
            form: {
                type: DEFAULT_USER_TICKET_TYPE,
                subject: ''
            },
            attachments: [],
            imageUploadAccept: IMAGE_UPLOAD_ACCEPT,
            ticketTypeOptions: USER_TICKET_TYPE_OPTIONS,
            showCreateEditor: false,
            createEditorKey: 0,
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    computed: {
        prefillMessage() {
            const message = this.$route.query.message;
            return message ? String(message) : '';
        },
        editorInitialValue() {
            return buildPrefilledTicketEditorMarkdown(this.prefillMessage);
        },
        editorOptionsWithPlaceholder() {
            return {
                ...this.editorOptions,
                placeholder: this.$t('mensajeTicketPlaceholder')
            };
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            createTicketAction: 'createTicket'
        }),
        onCreateAttachments(event) {
            const { files, rejected } = applyImageUploadSelection(
                this,
                event,
                event.target.files,
                {
                    limit: 3,
                    config: useAuthStore().appConfig
                }
            );
            if (!rejected) {
                this.attachments = files;
            }
        },
        async createTicket() {
            const markdown = this.$refs.createEditor.invoke('getMarkdown');
            if (isEmptyUserTicketMessage(markdown)) {
                dialogs.message(this.$t('errorTicketMensajeRequerido'), { estado: 'error' });
                return;
            }
            const snapshot = await fetchSupportInfoSnapshot();
            const messageMarkdown = appendSupportInfoToMessage(markdown, snapshot);
            let attachments = this.attachments;
            try {
                attachments = await compressImageFilesForUpload(
                    this.attachments,
                    useAuthStore().appConfig
                );
            } catch (err) {
                dialogs.message(this.$t('errorDatos'), { estado: 'error' });
                return;
            }
            return this.createTicketAction({
                type: this.form.type,
                subject: this.form.subject,
                message_markdown: messageMarkdown,
                attachments
            }).then((ticket) => {
                this.$router.push({ name: 'ticket-detail', params: { id: ticket.id } });
            }).catch(async (error) => {
                await handleGenericApiError(error, {
                    source: 'support_ticket_create',
                    fallbackMessageKey: 'errorDatos',
                    t: (key, params) => this.$t(key, params),
                    dialogs,
                    isDebugEnabled: isEnabledAsync
                });
            });
        },
        setTypeFromUrl() {
            const allowed = USER_TICKET_TYPE_VALUES;
            const category = this.$route.query.category;
            if (allowed.includes(category)) {
                this.form.type = category;
            }
        },
        onCreateEditorLoad() {
            if (!this.prefillMessage) {
                return;
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    focusPrefilledTicketEditorAtStart(this.$refs.createEditor);
                }, 50);
            });
        },
        mountCreateEditor() {
            this.showCreateEditor = true;
            this.createEditorKey += 1;
        }
    },
    mounted() {
        this.setTypeFromUrl();
        this.mountCreateEditor();
    },
    watch: {
        '$route.query.category': function () {
            this.setTypeFromUrl();
        }
    },
    components: {
        AccountSettingsLayout,
        AppButton,
        AppField,
        AppInput,
        editor: ToastUiEditor
    }
};
</script>

<style scoped>
.ticket-new-page__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

.ticket-new-page__card {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--profile-card-bg, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.ticket-new-page__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.ticket-new-page__select:focus {
    outline: none;
}

.ticket-new-page__editor-field :deep(.app-field__control-wrap) {
    border: 0;
    box-shadow: none;
    background: transparent;
}

.ticket-new-page__attachments-field :deep(.app-field__control-wrap) {
    border: 0;
    box-shadow: none;
    background: transparent;
}

.ticket-new-page__file {
    width: 100%;
    font-size: var(--ds-input-font-size, 1rem);
    color: var(--ds-input-text, #22211f);
}

.ticket-new-page__editor {
    width: 100%;
}

@media only screen and (max-width: 768px) {
    .ticket-new-page {
        padding: 1em;
    }
}
</style>
