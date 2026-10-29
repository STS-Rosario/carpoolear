<template>
    <AdminLayout>
        <h3>{{ $t('crearTicket') }}</h3>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="form-group">
                    <label>{{ $t('usuario') }}</label>
                    <UserSearchAutocomplete
                        v-model="selectedUser"
                        :placeholder="$t('escribeUnNombreYPresionaBuscar')"
                        :max-results="8"
                    />
                </div>

                <div class="form-group">
                    <label>{{ $t('usuario') }}</label>
                    <p
                        class="selected-user-value"
                        v-if="selectedUser && selectedUser.id"
                    >
                        {{ selectedUser.id }} - {{ selectedUser.name || '' }}
                    </p>
                    <p class="text-danger" v-else>{{ $t('errorDatos') }}</p>
                </div>

                <AppField :label="$t('categoriaTicket')" label-for="admin-support-ticket-new-type">
                    <select
                        id="admin-support-ticket-new-type"
                        v-model="createForm.type"
                        class="admin-support-ticket-new__type-select"
                    >
                        <option value="account_recovery">{{ $t('ticketTypeAccountRecovery') }}</option>
                        <option value="account_verification">{{ $t('ticketTypeAccountVerification') }}</option>
                        <option value="bug_report">{{ $t('ticketTypeBug') }}</option>
                        <option value="contact">{{ $t('ticketTypeContact') }}</option>
                        <option value="feedback">{{ $t('ticketTypeSuggestion') }}</option>
                        <option value="report">{{ $t('ticketTypeReport') }}</option>
                        <option value="excess_contribution">{{ $t('ticketTypeExcessContribution') }}</option>
                    </select>
                </AppField>
                <AppInput v-model="createForm.subject" :label="$t('asuntoTicket')" />
                <AppField
                    class="admin-support-ticket-new__editor-field"
                    :label="$t('mensajeTicket')"
                >
                    <editor
                        v-if="showMessageEditor"
                        ref="messageEditor"
                        :initial-value="createForm.message_markdown"
                        :options="editorOptions"
                        initial-edit-type="wysiwyg"
                        height="400px"
                        resizable
                        @change="syncMessageFromEditor"
                    />
                </AppField>
                <div v-if="showSuspendUserOption" class="form-group">
                    <label class="checkbox-label">
                        <input v-model="createForm.suspend_user" type="checkbox" />
                        {{ $t('suspenderUsuario') }}
                    </label>
                </div>
                <AppField v-if="showExcessUserNoteOption" :label="$t('notaPrivadaSoloAdmins')">
                    <textarea
                        v-model="createForm.private_note"
                        class="form-control"
                        rows="4"
                        :placeholder="$t('notaPrivadaSoloAdmins')"
                    ></textarea>
                </AppField>
                <AppButton variant="primary" :disabled="createDisabled" @click="createTicket">
                    {{ creating ? $t('guardando') : $t('crearTicket') }}
                </AppButton>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapGetters } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import { useTicketsStore } from '../../stores/tickets';
import { useAuthStore } from '../../stores/auth';
import dialogs from '../../services/dialogs';
import { ADMIN_PERMISSIONS, can } from '../../utils/adminPermissions';

export default {
    name: 'admin-support-ticket-new',
    data() {
        return {
            creating: false,
            selectedUser: null,
            tripUserId: null,
            showMessageEditor: false,
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [['bold', 'italic', 'strike'], ['ul', 'ol'], ['link']]
            },
            createForm: {
                user_id: null,
                type: 'account_verification',
                subject: '',
                message_markdown: '',
                trip_id: null,
                suspend_user: false,
                private_note: ''
            }
        };
    },
    computed: {
        ...mapGetters(useAuthStore, {
            authUser: 'user'
        }),
        createDisabled() {
            return this.creating ||
                !this.createForm.user_id ||
                !this.createForm.subject ||
                !this.createForm.message_markdown;
        },
        showSuspendUserOption() {
            return this.createForm.type === 'excess_contribution' && can(this.authUser, ADMIN_PERMISSIONS.UsersSuspend);
        },
        showExcessUserNoteOption() {
            return this.createForm.type === 'excess_contribution';
        }
    },
    watch: {
        selectedUser(user) {
            this.createForm.user_id = user && user.id ? user.id : null;
            if (this.createForm.trip_id && (!user || user.id !== this.tripUserId)) {
                this.createForm.trip_id = null;
            }
            this.syncRouteQuery();
        },
        'createForm.type'() {
            this.syncRouteQuery();
        },
        'createForm.subject'() {
            this.syncRouteQuery();
        },
        'createForm.message_markdown'() {
            this.syncRouteQuery();
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            adminCreateTicket: 'adminCreateTicket'
        }),
        messageMarkdownFromEditor() {
            const editor = this.$refs.messageEditor;
            if (editor && typeof editor.invoke === 'function') {
                return editor.invoke('getMarkdown') || '';
            }
            return this.createForm.message_markdown;
        },
        syncMessageFromEditor() {
            this.createForm.message_markdown = this.messageMarkdownFromEditor();
        },
        applyPrefill() {
            const query = this.$route.query || {};
            const userId = parseInt(query.userId, 10);
            const tripId = parseInt(query.tripId, 10);
            if (!Number.isNaN(userId) && userId > 0 && !Number.isNaN(tripId) && tripId > 0) {
                this.createForm.trip_id = tripId;
                this.tripUserId = userId;
            }
            if (!Number.isNaN(userId) && userId > 0) {
                const userName = query.userName ? String(query.userName) : '';
                this.selectedUser = { id: userId, name: userName, email: '' };
                this.createForm.user_id = userId;
            }
            if (query.type) {
                this.createForm.type = String(query.type);
            }
            if (query.subject) {
                this.createForm.subject = String(query.subject);
            }
            if (query.message) {
                this.createForm.message_markdown = String(query.message);
            }
        },
        syncRouteQuery() {
            const query = {};
            if (this.selectedUser && this.selectedUser.id) {
                query.userId = String(this.selectedUser.id);
                query.userName = String(this.selectedUser.name || '');
            }
            if (this.createForm.type) {
                query.type = this.createForm.type;
            }
            if (this.createForm.subject) {
                query.subject = this.createForm.subject;
            }
            if (this.createForm.message_markdown) {
                query.message = this.createForm.message_markdown;
            }
            if (this.createForm.trip_id) {
                query.tripId = String(this.createForm.trip_id);
            }
            this.$router.replace({ query });
        },
        createTicket() {
            this.createForm.message_markdown = this.messageMarkdownFromEditor();
            this.creating = true;
            const payload = { ...this.createForm };
            if (!payload.suspend_user) {
                delete payload.suspend_user;
            }
            if (!payload.private_note || payload.private_note.trim() === '') {
                delete payload.private_note;
            }
            if (payload.type !== 'excess_contribution') {
                delete payload.suspend_user;
                delete payload.private_note;
            }
            return this.adminCreateTicket(payload)
                .then((ticket) => {
                    dialogs.message(this.$t('perfilActualizadoCorrectamente'), { estado: 'success' });
                    this.$router.push({ name: 'admin-support-ticket-detail', params: { id: ticket.id } });
                })
                .catch((error) => {
                    const messageKey =
                        error && error.status === 409
                            ? 'excessContributionTicketAlreadyExists'
                            : 'errorDatos';
                    dialogs.message(this.$t(messageKey), { estado: 'error' });
                })
                .finally(() => {
                    this.creating = false;
                });
        }
    },
    mounted() {
        this.applyPrefill();
        this.showMessageEditor = true;
    },
    components: {
        AdminLayout,
        UserSearchAutocomplete,
        AppButton,
        AppField,
        AppInput,
        editor: ToastUiEditor
    }
};
</script>

<style scoped>
.selected-user-value {
    margin-top: 0;
}

.admin-support-ticket-new__type-select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.admin-support-ticket-new__type-select:focus {
    outline: none;
}

.admin-support-ticket-new__editor-field {
    margin-bottom: 16px;
}
</style>
