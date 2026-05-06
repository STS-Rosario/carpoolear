<template>
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-heading">{{ $t('soporte') }}</div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">{{ $t('categoriaTicket') }}</label>
                        <select v-model="form.type" class="form-control">
                            <option value="bug_report">{{ $t('ticketTypeBug') }}</option>
                            <option value="contact">{{ $t('ticketTypeContact') }}</option>
                            <option value="feedback">{{ $t('ticketTypeSuggestion') }}</option>
                            <option value="report">{{ $t('ticketTypeReport') }}</option>
                            <option value="account_verification">{{ $t('ticketTypeAccountVerification') }}</option>
                        </select>
                    </div>
                </div>
                <label class="control-label mtop-10">{{ $t('asuntoTicket') }}</label>
                <input v-model="form.subject" class="form-control" :placeholder="$t('asuntoTicketPlaceholder')" />
                <label class="control-label mtop-10">{{ $t('mensajeTicket') }}</label>
                <editor
                    ref="createEditor"
                    :initial-value="''"
                    :options="editorOptions"
                    initial-edit-type="wysiwyg"
                    height="180px"
                    class="mtop-10"
                />
                <label class="control-label mtop-10">{{ $t('adjuntosTicket') }}</label>
                <input class="mtop-10" type="file" accept="image/*" multiple @change="onCreateAttachments" />
                <p class="help-block">{{ $t('maximo3Imagenes') }}</p>
                <button class="btn btn-primary" @click="createTicket">{{ $t('crearTicket') }}</button>
            </div>
        </div>

        <div class="list-group">
            <router-link
                v-for="ticket in tickets"
                :key="ticket.id"
                class="list-group-item"
                :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
            >
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <p>{{ ticket.status }} · {{ ticket.priority }}</p>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import { useTicketsStore } from '../../stores/tickets';
import dialogs from '../../services/dialogs';

export default {
    name: 'tickets',
    data() {
        return {
            form: {
                type: 'bug_report',
                subject: ''
            },
            attachments: [],
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'list'
        })
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchList: 'fetchList',
            createTicketAction: 'createTicket'
        }),
        onCreateAttachments(event) {
            this.attachments = Array.from(event.target.files || []).slice(0, 3);
        },
        createTicket() {
            const markdown = this.$refs.createEditor.invoke('getMarkdown');
            return this.createTicketAction({
                type: this.form.type,
                subject: this.form.subject,
                message_markdown: markdown,
                attachments: this.attachments
            }).then(() => {
                this.form.subject = '';
                this.attachments = [];
                this.$refs.createEditor.invoke('setMarkdown', '');
                return this.fetchList();
            }).catch(() => dialogs.message(this.$t('errorDatos'), { estado: 'error' }));
        },
        setTypeFromUrl() {
            const allowed = ['bug_report', 'contact', 'feedback', 'report', 'account_verification'];
            const category = this.$route.query.category;
            if (allowed.includes(category)) {
                this.form.type = category;
            }
        }
    },
    mounted() {
        this.setTypeFromUrl();
        this.fetchList();
    },
    watch: {
        '$route.query.category': function () {
            this.setTypeFromUrl();
        }
    },
    components: {
        editor: ToastUiEditor
    }
};
</script>
