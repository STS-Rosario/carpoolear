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
                <AppTextarea
                    v-model="createForm.message_markdown"
                    :label="$t('mensajeTicket')"
                    :rows="4"
                />
                <AppButton variant="primary" :disabled="createDisabled" @click="createTicket">
                    {{ creating ? $t('guardando') : $t('crearTicket') }}
                </AppButton>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import AppTextarea from '../ui/AppTextarea.vue';
import { useTicketsStore } from '../../stores/tickets';
import dialogs from '../../services/dialogs';

export default {
    name: 'admin-support-ticket-new',
    data() {
        return {
            creating: false,
            selectedUser: null,
            createForm: {
                user_id: null,
                type: 'account_verification',
                subject: '',
                message_markdown: ''
            }
        };
    },
    computed: {
        createDisabled() {
            return this.creating ||
                !this.createForm.user_id ||
                !this.createForm.subject ||
                !this.createForm.message_markdown;
        }
    },
    watch: {
        selectedUser(user) {
            this.createForm.user_id = user && user.id ? user.id : null;
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
        applyPrefill() {
            const query = this.$route.query || {};
            const userId = parseInt(query.userId, 10);
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
            this.$router.replace({ query });
        },
        createTicket() {
            this.creating = true;
            return this.adminCreateTicket(this.createForm)
                .then((ticket) => {
                    dialogs.message(this.$t('perfilActualizadoCorrectamente'), { estado: 'success' });
                    this.$router.push({ name: 'admin-support-ticket-detail', params: { id: ticket.id } });
                })
                .catch(() => {
                    dialogs.message(this.$t('errorDatos'), { estado: 'error' });
                })
                .finally(() => {
                    this.creating = false;
                });
        }
    },
    mounted() {
        this.applyPrefill();
    },
    components: {
        AdminLayout,
        UserSearchAutocomplete,
        AppButton,
        AppField,
        AppInput,
        AppTextarea
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
</style>
