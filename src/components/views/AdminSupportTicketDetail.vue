<template>
    <AdminLayout v-if="ticket">
        <h3>#{{ ticket.id }} - {{ ticket.subject }}</h3>
        <p>{{ ticket.status }} · {{ ticket.priority }}</p>

                <label>{{ $t('notaInterna') }}</label>
                <textarea class="form-control" v-model="internalNote"></textarea>
                <button class="btn btn-default mtop-10" @click="saveInternalNote">{{ $t('guardarCambio') }}</button>

                <hr />
                <div class="list-group">
                    <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                        <p><strong>{{ reply.is_admin ? $t('admin') : $t('usuario') }}</strong></p>
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
