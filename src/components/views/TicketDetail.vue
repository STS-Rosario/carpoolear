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
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-body">
                <h4 class="reply-to-ticket-title">{{ $t('responderAlTicketDeSoporte') }}</h4>
                <editor
                    ref="replyEditor"
                    :initial-value="''"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    height="140px"
                />
                <label class="control-label mtop-10">{{ $t('adjuntarImagenes') }}</label>
                <input ref="attachmentInput" class="mtop-10" type="file" accept="image/*" multiple @change="onAttachments" />
                <p class="help-block">{{ $t('maximo3Imagenes') }}</p>
                <button class="btn btn-primary" @click="sendReply">{{ $t('responder') }}</button>
                <button
                    v-if="['Resuelto', 'En revision'].includes(ticket.status)"
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
import { markdownToHtml } from '../../services/markdown';
import dialogs from '../../services/dialogs';
import dayjs from '../../dayjs';

const STATUS_LABEL_KEYS = {
    Open: 'estadoPendiente',
    'Esperando respuesta': 'ticketEstadoEsperandoTuRespuesta',
    'En revision': 'estadoPendienteRevision',
    Resuelto: 'estadoAprobado',
    Cerrado: 'estadoCerrado'
};

const STATUS_CLASS_MAP = {
    Cerrado: 'label label-default',
    Resuelto: 'label label-success',
    'Esperando respuesta': 'label label-warning',
    'En revision': 'label label-info'
};

export default {
    name: 'ticket-detail',
    props: ['id'],
    data() {
        return {
            ticket: null,
            attachments: [],
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    computed: {
        backToTicketsRoute() {
            return { name: 'tickets' };
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
            });
        },
        sendReply() {
            const markdown = this.$refs.replyEditor.invoke('getMarkdown');
            return this.replyTicket(this.id, {
                message_markdown: markdown,
                attachments: this.attachments
            })
                .then(() => this.refresh())
                .then(() => {
                    dialogs.message(this.$t('respuestaEnviada'), { estado: 'success', duration: 2 });
                })
                .catch(() => {
                    dialogs.message(this.$t('errorDatos'), { estado: 'error', duration: 3 });
                })
                .finally(() => {
                    try {
                        const editor = this.$refs.replyEditor;
                        if (editor && typeof editor.invoke === 'function') {
                            editor.invoke('setMarkdown', '');
                        }
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
            this.closeTicketAction(this.id, { message_markdown: message }).then(() => this.refresh());
        }
    },
    components: {
        editor: ToastUiEditor
    },
    mounted() {
        this.refresh();
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
</style>
