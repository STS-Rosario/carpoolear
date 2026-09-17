<template>
    <modal v-if="visible" @close="onClose">
        <template #header>
            <h3>{{ $t('feedbackTabTitulo') }}</h3>
        </template>
        <template #body>
            <p class="support-feedback-modal__subtitle">
                {{ $t('feedbackTabSubtitulo') }}
            </p>

            <form class="support-feedback-modal__form" @submit.prevent="submitTicket">
                <AppField :label="$t('categoriaTicket')" label-for="support-feedback-type">
                    <select
                        id="support-feedback-type"
                        v-model="form.type"
                        class="support-feedback-modal__select"
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
                    :label="$t('feedbackTabAsunto')"
                    :placeholder="$t('feedbackTabAsuntoPlaceholder')"
                />

                <AppTextarea
                    v-model="form.message"
                    :label="$t('mensajeTicket')"
                    :placeholder="$t('mensajeTicketPlaceholder')"
                    :rows="6"
                />

                <AppField
                    :label="$t('adjuntosTicket')"
                    :hint="$t('maximo3Imagenes')"
                >
                    <input
                        type="file"
                        class="support-feedback-modal__file"
                        :accept="imageUploadAccept"
                        multiple
                        @change="onAttachments"
                    />
                </AppField>
            </form>
        </template>
        <template #footer>
            <AppButton
                variant="primary"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                @click="submitTicket"
            >
                {{ $t('feedbackTabEnviar') }}
            </AppButton>
        </template>
    </modal>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useTicketsStore } from '../stores/tickets';
import modal from './Modal.vue';
import AppButton from './ui/AppButton.vue';
import AppField from './ui/AppField.vue';
import AppInput from './ui/AppInput.vue';
import AppTextarea from './ui/AppTextarea.vue';
import dialogs from '../services/dialogs';
import {
    DEFAULT_FEEDBACK_TAB_TICKET_TYPE,
    isSupportFeedbackFormValid
} from '../utils/supportFeedbackTab';
import {
    USER_TICKET_TYPE_OPTIONS,
    USER_TICKET_TYPE_VALUES
} from '../utils/supportTicketTypeOptions';
import { TICKET_SOURCE_FEEDBACK_TAB } from '../utils/supportTicketSources';
import { IMAGE_UPLOAD_ACCEPT } from '../utils/imageUpload';
import { applyImageUploadSelection } from '../utils/imageUploadSelection';
import { compressImageFilesForUpload } from '../utils/imageUploadCompress';
import {
    appendSupportInfoToMessage,
    fetchSupportInfoSnapshot
} from '../utils/supportInfo';
import { handleGenericApiError } from '../utils/genericApiErrorHandling.js';
import { isEnabledAsync } from '../services/debug';

export default {
    name: 'support-feedback-modal',
    components: {
        modal,
        AppButton,
        AppField,
        AppInput,
        AppTextarea
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close'],
    data() {
        return {
            form: {
                type: DEFAULT_FEEDBACK_TAB_TICKET_TYPE,
                subject: '',
                message: ''
            },
            attachments: [],
            imageUploadAccept: IMAGE_UPLOAD_ACCEPT,
            ticketTypeOptions: USER_TICKET_TYPE_OPTIONS,
            isSubmitting: false
        };
    },
    watch: {
        visible(open) {
            if (open) {
                this.resetForm();
            }
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            createTicket: 'createTicket'
        }),
        resetForm() {
            this.form = {
                type: DEFAULT_FEEDBACK_TAB_TICKET_TYPE,
                subject: '',
                message: ''
            };
            this.attachments = [];
            this.isSubmitting = false;
        },
        onClose() {
            this.resetForm();
            this.$emit('close');
        },
        onAttachments(event) {
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
        async submitTicket() {
            if (this.isSubmitting) {
                return;
            }

            if (!isSupportFeedbackFormValid(this.form, USER_TICKET_TYPE_VALUES)) {
                dialogs.message(this.$t('errorTicketMensajeRequerido'), { estado: 'error' });
                return;
            }

            this.isSubmitting = true;
            try {
                const snapshot = await fetchSupportInfoSnapshot();
                const messageMarkdown = appendSupportInfoToMessage(
                    this.form.message.trim(),
                    snapshot
                );
                let attachments = this.attachments;
                try {
                    attachments = await compressImageFilesForUpload(
                        this.attachments,
                        useAuthStore().appConfig
                    );
                } catch (err) {
                    dialogs.message(this.$t('feedbackTabError'), { estado: 'error' });
                    return;
                }

                await this.createTicket({
                    type: this.form.type,
                    subject: this.form.subject.trim(),
                    message_markdown: messageMarkdown,
                    attachments,
                    source: TICKET_SOURCE_FEEDBACK_TAB
                });

                dialogs.message(this.$t('feedbackTabExito'), { estado: 'success' });
                this.onClose();
            } catch (error) {
                await handleGenericApiError(error, {
                    source: 'support_feedback_tab_create',
                    fallbackMessageKey: 'feedbackTabError',
                    t: (key, params) => this.$t(key, params),
                    dialogs,
                    isDebugEnabled: isEnabledAsync
                });
            } finally {
                this.isSubmitting = false;
            }
        }
    }
};
</script>

<style scoped>
.support-feedback-modal__subtitle {
    margin: 0 0 1rem;
    color: #555;
}

.support-feedback-modal__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.support-feedback-modal__select {
    width: 100%;
    min-height: 2.5rem;
}

.support-feedback-modal__file {
    width: 100%;
}
</style>
