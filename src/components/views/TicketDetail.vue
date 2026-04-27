<template>
    <div class="container" v-if="ticket">
        <div class="panel panel-default">
            <div class="panel-heading">
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <span class="pull-right">{{ ticket.status }}</span>
            </div>
            <div class="panel-body">
                <p>{{ $t('prioridad') }}: {{ ticket.priority }}</p>
                <p>{{ $t('sinLeer') }}: {{ ticket.unread_for_user }}</p>
            </div>
        </div>

        <div class="list-group">
            <div class="list-group-item" v-for="reply in ticket.replies || []" :key="reply.id">
                <p><strong>{{ reply.is_admin ? $t('admin') : $t('usuario') }}</strong></p>
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
        ...mapActions(useTicketsStore, {
            fetchOne: 'fetchOne',
            replyTicket: 'replyTicket',
            closeTicketAction: 'closeTicket'
        }),
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
