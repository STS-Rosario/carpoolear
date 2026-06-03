<template>
    <div class="container" v-if="ticket">
        <h3>{{ $t('ticketDeSoporte') }}</h3>
        <p>
            <router-link :to="backToTicketsRoute">
                {{ $t('volverListaTicketsSoporte') }}
            </router-link>
        </p>
        <div class="panel panel-default">
            <div class="panel-heading">
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <span class="ticket-status-label" :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
            </div>
        </div>

        <div class="list-group">
            <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                <p class="reply-meta-row">
                    <strong>{{ replyAuthorLabel(reply) }}</strong>
                    <small class="reply-meta-date" :title="fullDate(reply.created_at)">{{ relativeDate(reply.created_at) }}</small>
                </p>
                <div v-html="markdownToHtml(reply.message_markdown)"></div>
                <div v-if="reply.attachments && reply.attachments.length" class="reply-attachments">
                    <img
                        v-for="attachment in reply.attachments"
                        v-show="attachmentBlobUrls[attachment.id]"
                        :key="attachment.id"
                        :src="attachmentBlobUrls[attachment.id]"
                        class="img-thumbnail ticket-attachment-thumb"
                        :alt="attachment.original_name"
                    />
                </div>
            </div>
        </div>

        <div v-if="showReplyForm" class="panel panel-default">
            <div class="panel-body">
                <h4 class="reply-to-ticket-title">{{ $t('responderAlTicketDeSoporte') }}</h4>
                <editor
                    :key="replyEditorKey"
                    ref="replyEditor"
                    :initial-value="''"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    :height="supportTicketReplyEditorHeight"
                    resizable
                    :class="supportTicketReplyEditorClass"
                />
                <label class="control-label mtop-10">{{ $t('adjuntarImagenes') }}</label>
                <input ref="attachmentInput" class="mtop-10" type="file" accept="image/*" multiple @change="onAttachments" />
                <p class="help-block">{{ $t('maximo3Imagenes') }}</p>
                <button type="button" class="btn btn-primary" :disabled="replySubmitting" @click="sendReply">
                    {{ replySubmitting ? $t('enviando') : $t('responder') }}
                </button>
                <button
                    v-if="showUserCloseButton"
                    class="btn btn-default mleft-10"
                    @click="closeTicket"
                >
                    {{ $t('cerrarTicket') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import { useTicketsStore } from '../../stores/tickets';
import { ticketReplyBodyAlreadyUsed, isDuplicateReplyApiError } from '../../utils/supportTicketReplyDuplicate';
import { markdownToHtml } from '../../services/markdown';
import { fetchSupportTicketAttachmentBlob } from '../../utils/supportTicketAttachmentImage';
import dialogs from '../../services/dialogs';
import dayjs from '../../dayjs';
import {
    TICKET_STATUS_CLASS_MAP as STATUS_CLASS_MAP,
    USER_TICKET_STATUS_LABEL_KEYS as STATUS_LABEL_KEYS
} from '../../utils/supportTicketStatusLabels';
import {
    SUPPORT_TICKET_REPLY_EDITOR_HEIGHT,
    SUPPORT_TICKET_REPLY_EDITOR_CLASS
} from '../../utils/supportTicketReplyEditor';

const SUCCESS_TOAST_OPTIONS = { estado: 'success', duration: 2 };
const ERROR_TOAST_OPTIONS = { estado: 'error', duration: 3 };

export default {
    name: 'ticket-detail',
    props: ['id'],
    data() {
        return {
            ticket: null,
            attachmentBlobUrls: {},
            attachments: [],
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            },
            supportTicketReplyEditorHeight: SUPPORT_TICKET_REPLY_EDITOR_HEIGHT,
            supportTicketReplyEditorClass: SUPPORT_TICKET_REPLY_EDITOR_CLASS,
            replyEditorKey: 0,
            replySubmitting: false
        };
    },
    computed: {
        backToTicketsRoute() {
            return { name: 'tickets' };
        },
        showReplyForm() {
            return this.ticket
                && !['Resuelto', 'Cerrado'].includes(this.ticket.status);
        },
        showUserCloseButton() {
            return this.ticket && this.ticket.status === 'En revision';
        }
    },
    methods: {
        markdownToHtml,
        ...mapActions(useTicketsStore, {
            fetchOne: 'fetchOne',
            replyTicket: 'replyTicket',
            closeTicketAction: 'closeTicket'
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
        replyAuthorLabel(reply) {
            if (reply.is_admin) return this.$t('equipoCarpoolear');
            return (this.ticket && this.ticket.user && this.ticket.user.name) || this.$t('usuario');
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
            this.attachments = Array.from(event.target.files || []).slice(0, 3);
        },
        refresh() {
            return this.fetchOne(this.id).then((data) => {
                this.ticket = data;
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
                    fetchSupportTicketAttachmentBlob(ticketId, attachment.id, { admin: false })
                        .then((blob) => {
                            this.attachmentBlobUrls[attachment.id] = URL.createObjectURL(blob);
                        })
                        .catch(() => {});
                });
            });
        },
        sendReply() {
            if (this.replySubmitting) {
                return undefined;
            }
            const markdown = this.$refs.replyEditor.invoke('getMarkdown');
            if (ticketReplyBodyAlreadyUsed(this.ticket?.replies, markdown)) {
                dialogs.message(this.$t('ticketRespuestaDuplicada'), { estado: 'error', duration: 3 });
                return undefined;
            }
            this.replySubmitting = true;
            return this.replyTicket(this.id, {
                message_markdown: markdown,
                attachments: this.attachments
            })
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
                        this.replyEditorKey += 1;
                        this.attachments = [];
                        const input = this.$refs.attachmentInput;
                        if (input) input.value = '';
                    } catch (e) {
                        console.warn('TicketDetail: could not reset reply form', e);
                    }
                });
        },
        closeTicket() {
            const message = window.prompt(this.$t('mensajeOpcionalCierre')) || '';
            if (!window.confirm(this.$t('confirmarCierreTicket'))) {
                return;
            }
            this.closeTicketAction(this.id, { message_markdown: message })
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('ticketCerrado'), SUCCESS_TOAST_OPTIONS);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorCerrandoTicket'), ERROR_TOAST_OPTIONS);
                });
        }
    },
    components: {
        editor: ToastUiEditor
    },
    mounted() {
        this.refresh();
    },
    beforeUnmount() {
        this.revokeAttachmentBlobUrls();
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

.ticket-status-label {
    display: inline-block;
    margin-left: 12px;
}

.reply-to-ticket-title {
    margin-top: 0;
    margin-bottom: 12px;
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
</style>
