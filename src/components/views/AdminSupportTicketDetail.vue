<template>
    <AdminLayout v-if="ticket">
        <h3>#{{ ticket.id }} - {{ ticket.subject }}</h3>
        <p>
            <span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
            <span class="mleft-10" :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
        </p>

        <label>{{ $t('notaInterna') }}</label>
        <textarea class="form-control" v-model="internalNote"></textarea>
        <button class="btn btn-default mtop-10" @click="saveInternalNote">{{ $t('guardarCambio') }}</button>

        <hr />
        <div class="list-group">
            <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                <p class="reply-meta-row">
                    <strong>
                        <span v-if="reply.is_admin">{{ $t('admin') }}</span>
                        <span v-else>
                            <router-link v-if="canLinkUserProfile()" :to="userAppProfileRoute()">
                                {{ replyAuthorLabel(reply) }}
                            </router-link>
                            <span v-else>{{ replyAuthorLabel(reply) }}</span>
                            (
                            <router-link v-if="canLinkUserProfile()" :to="userAdminProfileRoute()">
                                {{ $t('verPerfilEnAdmin') }}
                            </router-link>
                            <span v-else>{{ $t('verPerfilEnAdmin') }}</span>
                            )
                        </span>
                    </strong>
                    <small class="reply-meta-date" :title="fullDate(reply.created_at)">{{ relativeDate(reply.created_at) }}</small>
                </p>
                <div v-html="markdownToHtml(reply.message_markdown)"></div>
            </div>
        </div>

        <editor ref="replyEditor" :initial-value="''" :options="editorOptions" initial-edit-type="wysiwyg" height="140px" />
        <input class="mtop-10" type="file" accept="image/*" multiple @change="onAttachments" />
        <button class="btn btn-primary mtop-10" @click="sendReply">{{ $t('responder') }}</button>
        <button class="btn btn-default mtop-10 mleft-10" @click="resolveTicket">{{ $t('marcarResuelto') }}</button>
        <button class="btn btn-default mtop-10 mleft-10" @click="closeTicket">{{ $t('cerrarTicket') }}</button>
        <button class="btn btn-default mtop-10 mleft-10" @click="reopenTicket">{{ $t('reabrirTicket') }}</button>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { markdownToHtml } from '../../services/markdown';
import { useTicketsStore } from '../../stores/tickets';
import dayjs from '../../dayjs';

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

export default {
    name: 'admin-support-ticket-detail',
    props: ['id'],
    data() {
        return {
            ticket: null,
            attachments: [],
            internalNote: '',
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    methods: {
        markdownToHtml,
        ...mapActions(useTicketsStore, {
            fetchAdminOne: 'fetchAdminOne',
            adminReply: 'adminReply',
            adminResolve: 'adminResolve',
            adminClose: 'adminClose',
            adminReopen: 'adminReopen',
            adminSetInternalNote: 'adminSetInternalNote'
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
            if (reply.is_admin) return this.$t('admin');
            return (this.ticket && this.ticket.user && this.ticket.user.name) || this.$t('usuario');
        },
        canLinkUserProfile() {
            return Boolean(this.ticket && this.ticket.user && this.ticket.user.id);
        },
        userAppProfileRoute() {
            return { name: 'profile', params: { id: this.ticket.user.id } };
        },
        userAdminProfileRoute() {
            return { name: 'admin-users-user', params: { userId: this.ticket.user.id } };
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
            return this.fetchAdminOne(this.id).then((data) => {
                this.ticket = data;
                this.internalNote = data.internal_note_markdown || '';
            });
        },
        sendReply() {
            const markdown = this.$refs.replyEditor.invoke('getMarkdown');
            return this.adminReply(this.id, { message_markdown: markdown, attachments: this.attachments }).then(() => {
                this.$refs.replyEditor.invoke('setMarkdown', '');
                this.attachments = [];
                return this.refresh();
            });
        },
        resolveTicket() {
            if (!window.confirm(this.$t('confirmarMarcarResuelto'))) return;
            const message = window.prompt(this.$t('mensajeOpcionalResolucion')) || '';
            this.adminResolve(this.id, { message_markdown: message }).then(() => this.refresh());
        },
        closeTicket() {
            if (!window.confirm(this.$t('confirmarCierreTicket'))) return;
            const message = window.prompt(this.$t('mensajeOpcionalCierre')) || '';
            this.adminClose(this.id, { message_markdown: message }).then(() => this.refresh());
        },
        reopenTicket() {
            this.adminReopen(this.id).then(() => this.refresh());
        },
        saveInternalNote() {
            this.adminSetInternalNote(this.id, this.internalNote).then(() => this.refresh());
        }
    },
    mounted() {
        this.refresh();
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
</style>
