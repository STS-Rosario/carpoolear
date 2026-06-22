<template>
    <AdminLayout v-if="ticket">
        <p>
            <router-link :to="backToTicketsRoute()">
                {{ $t('volverListaTickets') }}
            </router-link>
        </p>
        <h3>#{{ ticket.id }} - {{ ticket.subject }}</h3>
        <p class="ticket-meta-row">
            <span class="ticket-status-label" :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
            <span class="ticket-priority-label" :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
        </p>

        <label>{{ $t('categoriaTicket') }}</label>
        <select v-model="ticketType" class="form-control ticket-category-select">
            <option
                v-for="option in ticketTypeOptions"
                :key="option.value"
                :value="option.value"
            >
                {{ $t(option.labelKey) }}
            </option>
        </select>
        <button class="btn btn-default mtop-10" @click="saveTicketCategory">{{ $t('guardarCambio') }}</button>

        <hr />
        <label>{{ $t('notaInterna') }}</label>
        <textarea class="form-control" v-model="internalNote"></textarea>
        <button class="btn btn-default mtop-10" @click="saveInternalNote">{{ $t('guardarCambio') }}</button>
        <button
            v-if="ticketHasAttachments"
            type="button"
            class="btn btn-danger mtop-10 mleft-10"
            @click="purgeAllAttachments"
        >
            {{ $t('eliminarTodasLasImagenes') }}
        </button>

        <hr />
        <div class="list-group">
            <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                <p class="reply-meta-row">
                    <strong>
                        <span v-if="reply.is_admin">{{ adminReplyAuthorLabel(reply) }}</span>
                        <span v-else>
                            <router-link v-if="canLinkUserProfile()" :to="userAdminProfileRoute()">
                                {{ replyAuthorLabel(reply) }}
                            </router-link>
                            <span v-else>{{ replyAuthorLabel(reply) }}</span>
                        </span>
                    </strong>
                    <small class="reply-meta-date" :title="fullDate(reply.created_at)">{{ relativeDate(reply.created_at) }}</small>
                </p>
                <div v-html="markdownToHtml(reply.message_markdown)"></div>
                <div v-if="reply.attachments && reply.attachments.length" class="reply-attachments">
                    <img
                        v-for="attachment in reply.attachments"
                        v-show="attachmentBlobUrls[attachment.id]"
                        :key="attachment.id"
                        :src="attachmentBlobUrls[attachment.id]"
                        class="img-thumbnail ticket-attachment-thumb clickable-img"
                        :alt="attachment.original_name"
                        @click="openBlobImageInNewTab(attachmentBlobUrls[attachment.id])"
                    />
                </div>
            </div>
        </div>

        <div v-if="showReplyForm" class="admin-reply-box">
            <div class="admin-reply-header">
                <label class="control-label">{{ $t('respuestaCarpoolear') }}</label>
                <button type="button" class="btn btn-default btn-sm" @click="openReplyTemplateModal">
                    {{ $t('responderConPlantilla') }}
                </button>
            </div>
            <editor
                :key="replyEditorKey"
                ref="replyEditor"
                :initial-value="replyEditorInitialValue"
                :options="editorOptions"
                initial-edit-type="wysiwyg"
                :height="supportTicketReplyEditorHeight"
                resizable
                :class="supportTicketReplyEditorClass"
            />
            <input ref="attachmentInput" class="mtop-10" type="file" :accept="imageUploadAccept" multiple @change="onAttachments" />
            <div class="reply-actions">
                <div class="reply-actions-left">
                    <button
                        type="button"
                        class="btn btn-primary reply-action-btn"
                        :disabled="replySubmitting"
                        @click="sendReply"
                    >
                        {{ replySubmitting ? $t('enviando') : $t('responder') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="admin-ticket-actions reply-actions mtop-10">
            <div class="reply-actions-right">
                <button
                    v-if="showMarkNeedsReviewButton"
                    class="btn btn-default reply-action-btn"
                    @click="markNeedsReviewTicket"
                >
                    {{ $t('marcarNecesitaRevision') }}
                </button>
                <button
                    v-if="showResolveTicketButton"
                    class="btn btn-default reply-action-btn"
                    @click="resolveTicket"
                >
                    {{ $t('marcarResuelto') }}
                </button>
                <button
                    v-if="showUnresolveTicketButton"
                    class="btn btn-default reply-action-btn"
                    @click="unresolveTicket"
                >
                    {{ $t('marcarComoNoResuelto') }}
                </button>
                <button v-if="showCloseTicketButton" class="btn btn-default reply-action-btn" @click="closeTicket">{{ $t('cerrarTicket') }}</button>
                <button v-if="showReopenTicketButton" class="btn btn-default reply-action-btn" @click="reopenTicket">{{ $t('reabrirTicket') }}</button>
            </div>
        </div>

        <div
            v-if="replyTemplateModalOpen"
            class="reply-template-modal-backdrop"
            @click.self="closeReplyTemplateModal"
        >
            <div class="reply-template-modal-dialog" @click.stop>
                <div class="reply-template-modal-header">
                    <strong class="reply-template-modal-title">{{ $t('plantillasModalTitulo') }}</strong>
                    <button type="button" class="close reply-template-modal-close" @click="closeReplyTemplateModal">
                        &times;
                    </button>
                </div>
                <input
                    v-model="replyTemplateSearch"
                    class="form-control mtop-10"
                    type="search"
                    :placeholder="$t('buscarPlantillasPlaceholder')"
                />
                <p v-if="replyTemplatesLoading" class="mtop-10">{{ $t('cargandoNotificaciones') }}</p>
                <p v-else-if="replyTemplatesLoadError" class="alert alert-danger mtop-10">{{ replyTemplatesLoadError }}</p>
                <ul v-else class="list-group reply-template-modal-list mtop-10">
                    <template v-if="!filteredReplyTemplates.length">
                        <li class="list-group-item">{{ $t('sinPlantillasRespuestas') }}</li>
                    </template>
                    <template v-else>
                        <li
                            v-for="t in filteredReplyTemplates"
                            :key="t.id"
                            class="list-group-item reply-template-modal-item"
                        >
                            <button
                                type="button"
                                class="reply-template-modal-pick"
                                @click="pickReplyTemplate(t)"
                            >
                                <span class="reply-template-modal-name">{{ t.name }}</span>
                            </button>
                            <div v-if="t.short_description" class="small text-muted">{{ t.short_description }}</div>
                        </li>
                    </template>
                </ul>
                <button type="button" class="btn btn-default mtop-10" @click="closeReplyTemplateModal">
                    {{ $t('cerrarModal') }}
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { markdownToHtml } from '../../services/markdown';
import { interpolateSupportTemplateVariables } from '../../utils/supportTemplateInterpolation';
import { ticketReplyBodyAlreadyUsed, isDuplicateReplyApiError } from '../../utils/supportTicketReplyDuplicate';
import {
    fetchSupportTicketAttachmentBlob,
    openBlobImageInNewTab
} from '../../utils/supportTicketAttachmentImage';
import { useTicketsStore } from '../../stores/tickets';
import { useReplyTemplatesStore } from '../../stores/replyTemplates';
import dialogs from '../../services/dialogs.js';
import dayjs from '../../dayjs';
import {
    TICKET_STATUS_CLASS_MAP as STATUS_CLASS_MAP,
    TICKET_STATUS_LABEL_KEYS as STATUS_LABEL_KEYS
} from '../../utils/supportTicketStatusLabels';
import { USER_TICKET_TYPE_OPTIONS } from '../../utils/supportTicketTypeOptions';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import {
    SUPPORT_TICKET_REPLY_EDITOR_HEIGHT,
    SUPPORT_TICKET_REPLY_EDITOR_CLASS
} from '../../utils/supportTicketReplyEditor';
import {
    IMAGE_UPLOAD_ACCEPT
} from '../../utils/imageUpload';
import { applyImageUploadSelection } from '../../utils/imageUploadSelection';
import { compressImageFilesForUpload } from '../../utils/imageUploadCompress';
import { useAuthStore } from '../../stores/auth';

const PRIORITY_LABEL_KEYS = {
    low: 'prioridadBaja',
    normal: 'prioridadNormal',
    high: 'prioridadAlta'
};

const PRIORITY_CLASS_MAP = {
    high: 'label label-danger',
    normal: 'label label-info',
    low: 'label label-default'
};

const SUCCESS_TOAST_OPTIONS = { estado: 'success', duration: 2 };
const ERROR_TOAST_OPTIONS = { estado: 'error', duration: 3 };
const ticketTypeOptions = USER_TICKET_TYPE_OPTIONS;

export default {
    name: 'admin-support-ticket-detail',
    props: ['id'],
    data() {
        return {
            ticket: null,
            attachmentBlobUrls: {},
            attachments: [],
            imageUploadAccept: IMAGE_UPLOAD_ACCEPT,
            internalNote: '',
            ticketType: '',
            ticketTypeOptions,
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            },
            supportTicketReplyEditorHeight: SUPPORT_TICKET_REPLY_EDITOR_HEIGHT,
            supportTicketReplyEditorClass: SUPPORT_TICKET_REPLY_EDITOR_CLASS,
            replyTemplateModalOpen: false,
            replyTemplateSearch: '',
            replyTemplatesLoading: false,
            replyTemplatesLoadError: '',
            replyEditorInitialValue: '',
            replyEditorKey: 0,
            replySubmitting: false
        };
    },
    computed: {
        ticketUserForTemplates() {
            return this.ticket && this.ticket.user ? this.ticket.user : null;
        },
        ...mapState(useReplyTemplatesStore, {
            replyTemplatesAdminList: 'adminList'
        }),
        filteredReplyTemplates() {
            const list = Array.isArray(this.replyTemplatesAdminList) ? this.replyTemplatesAdminList : [];
            const q = (this.replyTemplateSearch || '').trim().toLowerCase();
            if (!q) {
                return list;
            }
            return list.filter((t) => {
                const blob = [t.name, t.short_description, t.body_markdown]
                    .map((x) => String(x || '').toLowerCase())
                    .join('\n');
                return blob.includes(q);
            });
        },
        isTicketClosed() {
            return this.ticket && this.ticket.status === 'Cerrado';
        },
        isTicketResolved() {
            return this.ticket && this.ticket.status === 'Resuelto';
        },
        showReplyForm() {
            return this.ticket && !this.isTicketClosed && !this.isTicketResolved;
        },
        showReopenTicketButton() {
            return this.isTicketClosed;
        },
        showCloseTicketButton() {
            return this.ticket && !this.isTicketClosed;
        },
        showResolveTicketButton() {
            return this.ticket && !this.isTicketClosed && !this.isTicketResolved;
        },
        showUnresolveTicketButton() {
            return this.isTicketResolved;
        },
        showMarkNeedsReviewButton() {
            return this.ticket
                && !this.isTicketClosed
                && !this.isTicketResolved
                && this.ticket.status !== 'Necesita revisión';
        },
        ticketHasAttachments() {
            return (this.ticket?.replies || []).some(
                (reply) => Array.isArray(reply.attachments) && reply.attachments.length > 0
            );
        }
    },
    methods: {
        openBlobImageInNewTab,
        markdownToHtml,
        ...mapActions(useTicketsStore, {
            fetchAdminOne: 'fetchAdminOne',
            adminReply: 'adminReply',
            adminResolve: 'adminResolve',
            adminUnresolve: 'adminUnresolve',
            adminClose: 'adminClose',
            adminReopen: 'adminReopen',
            adminMarkNeedsReview: 'adminMarkNeedsReview',
            adminPurgeAttachments: 'adminPurgeAttachments',
            adminSetInternalNote: 'adminSetInternalNote',
            adminSetType: 'adminSetType'
        }),
        ...mapActions(useReplyTemplatesStore, {
            fetchReplyTemplatesAdminList: 'fetchAdminList'
        }),
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        statusLabel(status) {
            if (STATUS_LABEL_KEYS[status]) return this.$t(STATUS_LABEL_KEYS[status]);
            return this.capitalizeFirst(status || '');
        },
        statusClass(status) {
            return STATUS_CLASS_MAP[status] || 'label label-primary';
        },
        priorityLabel(priority) {
            const key = (priority || '').toLowerCase();
            if (PRIORITY_LABEL_KEYS[key]) return this.$t(PRIORITY_LABEL_KEYS[key]);
            return this.capitalizeFirst(priority || '');
        },
        priorityClass(priority) {
            const key = (priority || '').toLowerCase();
            return PRIORITY_CLASS_MAP[key] || 'label label-default';
        },
        replyAuthorLabel(reply) {
            return (this.ticket && this.ticket.user && this.ticket.user.name) || this.$t('usuario');
        },
        adminReplyAuthorLabel(reply) {
            const name = reply.user?.name != null ? String(reply.user.name).trim() : '';
            if (!name) {
                return this.$t('equipoCarpoolear');
            }
            return this.$t('equipoCarpoolearAutorAdmin', {
                name,
                id: reply.user?.id ?? ''
            });
        },
        canLinkUserProfile() {
            return Boolean(this.ticket && this.ticket.user && this.ticket.user.id);
        },
        userAdminProfileRoute() {
            return getAdminUserProfileRoute(this.ticket.user.id);
        },
        backToTicketsRoute() {
            return { name: 'admin-support-tickets' };
        },
        relativeDate(value) {
            if (!value) return '-';
            return dayjs(value).fromNow();
        },
        fullDate(value) {
            if (!value) return '-';
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
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
        refresh() {
            return this.fetchAdminOne(this.id).then((data) => {
                this.ticket = data;
                this.internalNote = data.internal_note_markdown || '';
                this.ticketType = data.type || '';
                this.loadReplyAttachmentUrls();
            });
        },
        revokeAttachmentBlobUrls() {
            Object.values(this.attachmentBlobUrls).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
            this.attachmentBlobUrls = {};
        },
        loadReplyAttachmentUrls() {
            if (!this.ticket || !this.ticket.id) return;
            this.revokeAttachmentBlobUrls();
            const ticketId = this.ticket.id;
            (this.ticket.replies || []).forEach((reply) => {
                (reply.attachments || []).forEach((attachment) => {
                    fetchSupportTicketAttachmentBlob(ticketId, attachment.id, { admin: true })
                        .then((blob) => {
                            this.attachmentBlobUrls[attachment.id] = URL.createObjectURL(blob);
                        })
                        .catch(() => {});
                });
            });
        },
        openReplyTemplateModal() {
            this.replyTemplateModalOpen = true;
            this.replyTemplateSearch = '';
            this.replyTemplatesLoadError = '';
            this.replyTemplatesLoading = true;
            this.fetchReplyTemplatesAdminList()
                .catch(() => {
                    this.replyTemplatesLoadError = this.$t('errorCargandoPlantillasRespuestas');
                })
                .finally(() => {
                    this.replyTemplatesLoading = false;
                });
        },
        closeReplyTemplateModal() {
            this.replyTemplateModalOpen = false;
        },
        pickReplyTemplate(row) {
            this.closeReplyTemplateModal();
            this.$nextTick(() => {
                this.appendInterpolatedTemplateToReply(row.body_markdown);
            });
        },
        appendInterpolatedTemplateToReply(templateMarkdown) {
            if (templateMarkdown == null || String(templateMarkdown).trim() === '') return;
            const editor = this.$refs.replyEditor;
            if (!editor || typeof editor.invoke !== 'function') return;
            const chunk = interpolateSupportTemplateVariables(templateMarkdown, this.ticketUserForTemplates);
            const current = editor.invoke('getMarkdown') || '';
            const sep = current.trim() ? '\n\n' : '';
            this.replyEditorInitialValue = current + sep + chunk;
            this.replyEditorKey += 1;
        },
        async sendReply() {
            if (this.replySubmitting) {
                return undefined;
            }
            const markdown = this.$refs.replyEditor.invoke('getMarkdown');
            const messageMarkdown = interpolateSupportTemplateVariables(markdown, this.ticketUserForTemplates);
            if (ticketReplyBodyAlreadyUsed(this.ticket?.replies, messageMarkdown)) {
                dialogs.message(this.$t('ticketRespuestaDuplicada'), { estado: 'error', duration: 3 });
                return undefined;
            }
            this.replySubmitting = true;
            let attachments = this.attachments;
            try {
                attachments = await compressImageFilesForUpload(
                    this.attachments,
                    useAuthStore().appConfig
                );
            } catch (err) {
                this.replySubmitting = false;
                dialogs.message(this.$t('errorDatos'), ERROR_TOAST_OPTIONS);
                return undefined;
            }
            return this.adminReply(this.id, { message_markdown: messageMarkdown, attachments })
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('respuestaEnviada'), SUCCESS_TOAST_OPTIONS);
                })
                .catch((err) => {
                    if (isDuplicateReplyApiError(err)) {
                        dialogs.message(this.$t('ticketRespuestaDuplicada'), ERROR_TOAST_OPTIONS);
                    } else {
                        dialogs.message(this.$t('errorDatos'), ERROR_TOAST_OPTIONS);
                    }
                })
                .finally(() => {
                    this.replySubmitting = false;
                    try {
                        this.replyEditorInitialValue = '';
                        this.replyEditorKey += 1;
                        this.attachments = [];
                        const input = this.$refs.attachmentInput;
                        if (input) input.value = '';
                    } catch (e) {
                        console.warn('AdminSupportTicketDetail: could not reset reply form', e);
                    }
                });
        },
        resolveTicket() {
            if (!window.confirm(this.$t('confirmarMarcarResuelto'))) return;
            const message = window.prompt(this.$t('mensajeOpcionalResolucion')) || '';
            this.adminResolve(this.id, { message_markdown: message })
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketMarcadoResuelto'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorMarcandoResuelto'), ERROR_TOAST_OPTIONS);
                });
        },
        unresolveTicket() {
            if (!window.confirm(this.$t('confirmarMarcarNoResuelto'))) {
                return;
            }
            this.adminUnresolve(this.id)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketMarcadoNoResuelto'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorMarcandoNoResuelto'), ERROR_TOAST_OPTIONS);
                });
        },
        closeTicket() {
            if (!window.confirm(this.$t('confirmarCierreTicket'))) return;
            const message = window.prompt(this.$t('mensajeOpcionalCierre')) || '';
            this.adminClose(this.id, { message_markdown: message })
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketCerrado'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorCerrandoTicket'), ERROR_TOAST_OPTIONS);
                });
        },
        reopenTicket() {
            this.adminReopen(this.id)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketReabierto'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorReabriendoTicket'), ERROR_TOAST_OPTIONS);
                });
        },
        markNeedsReviewTicket() {
            if (!window.confirm(this.$t('confirmarMarcarNecesitaRevision'))) {
                return;
            }
            const markdown = this.$refs.replyEditor.invoke('getMarkdown');
            const messageMarkdown = interpolateSupportTemplateVariables(markdown, this.ticketUserForTemplates);
            const payload = messageMarkdown.trim()
                ? { message_markdown: messageMarkdown }
                : {};
            this.adminMarkNeedsReview(this.id, payload)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketMarcadoNecesitaRevision'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorMarcandoNecesitaRevision'), ERROR_TOAST_OPTIONS);
                });
        },
        purgeAllAttachments() {
            if (!window.confirm(this.$t('confirmarEliminarTodasLasImagenes'))) {
                return;
            }
            this.adminPurgeAttachments(this.id)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('imagenesTicketEliminadas'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorEliminandoImagenesTicket'), ERROR_TOAST_OPTIONS);
                });
        },
        saveInternalNote() {
            this.adminSetInternalNote(this.id, this.internalNote)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('notaInternaGuardada'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorGuardandoNotaInterna'), ERROR_TOAST_OPTIONS);
                });
        },
        saveTicketCategory() {
            this.adminSetType(this.id, this.ticketType)
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('categoriaTicketGuardada'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorGuardandoCategoriaTicket'), ERROR_TOAST_OPTIONS);
                });
        }
    },
    mounted() {
        this.refresh();
    },
    beforeUnmount() {
        this.revokeAttachmentBlobUrls();
    },
    components: {
        editor: ToastUiEditor,
        AdminLayout
    }
};
</script>

<style scoped>
.reply-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.reply-meta-date {
    color: #777;
}

.reply-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.ticket-attachment-thumb {
    max-width: 160px;
    max-height: 160px;
}

.clickable-img {
    cursor: pointer;
}

.ticket-meta-row {
    display: flex;
    align-items: center;
}

.ticket-priority-label {
    margin-left: 10px;
}

.admin-reply-box {
    margin-top: 16px;
    margin-bottom: 16px;
}

.admin-reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.reply-actions {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.reply-actions-left,
.reply-actions-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.reply-action-btn {
    margin-right: 8px;
    margin-bottom: 8px;
}

.reply-template-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1050;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px;
    overflow-y: auto;
}

.reply-template-modal-dialog {
    background: #fff;
    border-radius: 4px;
    max-width: 520px;
    width: 100%;
    padding: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.reply-template-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}

.reply-template-modal-title {
    font-size: 20px;
    line-height: 1.2;
    color: #222;
}

.reply-template-modal-close {
    background: transparent;
    border: none;
    font-size: 22px;
    line-height: 1;
    padding: 0 6px;
}

.reply-template-modal-list {
    max-height: 320px;
    overflow-y: auto;
}

.reply-template-modal-item {
    cursor: pointer;
}

.reply-template-modal-item:hover {
    background-color: #f5f5f5;
}

.reply-template-modal-name {
    font-weight: 600;
    color: #222;
}

.reply-template-modal-pick {
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    padding: 0;
    text-align: left;
}
</style>
