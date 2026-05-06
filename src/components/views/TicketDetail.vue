<template>
    <div class="container" v-if="ticket">
        <p>
            <router-link :to="{ name: 'tickets' }">
                {{ $t('volverListaTicketsSoporte') }}
            </router-link>
        </p>
        <div class="panel panel-default">
            <div class="panel-heading">
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
            </div>
            <div class="panel-body">
                <p>
                    {{ $t('prioridad') }}:
                    <span :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
                </p>
                <p>
                    {{ $t('estado') }}:
                    <span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                </p>
            </div>
        </div>

        <div class="list-group">
            <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                <p><strong>{{ replyAuthorLabel(reply) }}</strong></p>
                <p><small :title="fullDate(reply.created_at)">{{ relativeDate(reply.created_at) }}</small></p>
                <div v-html="markdownToHtml(reply.message_markdown)"></div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-body">
                <editor
                    ref="replyEditor"
                    :initial-value="''"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    height="140px"
                />
                <label class="control-label mtop-10">{{ $t('adjuntarImagenes') }}</label>
                <input class="mtop-10" type="file" accept="image/*" multiple @change="onAttachments" />
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

const STATUS_LABEL_KEYS = {
    Open: 'estadoPendiente',
    'Esperando respuesta': 'esperaUsuarioResponda',
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
    methods: {
        markdownToHtml,
        dayjs,
        ...mapActions(useTicketsStore, {
            fetchOne: 'fetchOne',
            replyTicket: 'replyTicket',
            closeTicketAction: 'closeTicket'
        }),
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
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
        statusLabel(status) {
            if (STATUS_LABEL_KEYS[status]) return this.$t(STATUS_LABEL_KEYS[status]);
            return this.capitalizeFirst(status || '');
        },
        statusClass(status) {
            return STATUS_CLASS_MAP[status] || 'label label-primary';
        },
        replyAuthorLabel(reply) {
            if (reply.is_admin) return this.$t('admin');
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
            }).then(() => {
                this.attachments = [];
                this.$refs.replyEditor.invoke('setMarkdown', '');
                return this.refresh();
            }).catch(() => dialogs.message(this.$t('errorDatos'), { estado: 'error' }));
        },
        closeTicket() {
            const message = window.prompt(this.$t('mensajeOpcionalCierre')) || '';
            if (!window.confirm(this.$t('confirmarCierreTicket'))) {
                return;
            }
            this.closeTicketAction(this.id, { message_markdown: message }).then(() => this.refresh());
        }
    },
    mounted() {
        this.refresh();
    }
};
</script>
