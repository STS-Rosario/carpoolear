<template>
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-heading">{{ $t('soporte') }}</div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <label class="control-label">{{ $t('categoriaTicket') }}</label>
                        <select v-model="form.type" class="form-control">
                            <option
                                v-for="option in ticketTypeOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ $t(option.labelKey) }}
                            </option>
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
                <input class="mtop-10" type="file" :accept="imageUploadAccept" multiple @change="onCreateAttachments" />
                <p class="help-block">{{ $t('maximo3Imagenes') }}</p>
                <button class="btn btn-primary" @click="createTicket">{{ $t('crearTicket') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import { useTicketsStore } from '../../stores/tickets';
import dialogs from '../../services/dialogs';
import {
    DEFAULT_USER_TICKET_TYPE,
    USER_TICKET_TYPE_OPTIONS,
    USER_TICKET_TYPE_VALUES
} from '../../utils/supportTicketTypeOptions';
import {
    IMAGE_UPLOAD_ACCEPT,
    filterAllowedImageUploads
} from '../../utils/imageUpload';

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
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol']]
            }
        };
    },
    methods: {
        ...mapActions(useTicketsStore, {
            createTicketAction: 'createTicket'
        }),
        onCreateAttachments(event) {
            this.attachments = filterAllowedImageUploads(event.target.files, 3);
        },
        createTicket() {
            const markdown = this.$refs.createEditor.invoke('getMarkdown');
            return this.createTicketAction({
                type: this.form.type,
                subject: this.form.subject,
                message_markdown: markdown,
                attachments: this.attachments
            }).then((ticket) => {
                this.$router.push({ name: 'ticket-detail', params: { id: ticket.id } });
            }).catch(() => dialogs.message(this.$t('errorDatos'), { estado: 'error' }));
        },
        setTypeFromUrl() {
            const allowed = USER_TICKET_TYPE_VALUES;
            const category = this.$route.query.category;
            if (allowed.includes(category)) {
                this.form.type = category;
            }
        }
    },
    mounted() {
        this.setTypeFromUrl();
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
