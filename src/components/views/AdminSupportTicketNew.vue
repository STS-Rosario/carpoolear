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
                        class="form-control-static selected-user-value"
                        v-if="selectedUser && selectedUser.id"
                    >
                        {{ selectedUser.id }} - {{ selectedUser.name || '' }}
                    </p>
                    <p class="text-danger" v-else>{{ $t('errorDatos') }}</p>
                </div>

                <div class="form-group">
                    <label>{{ $t('categoriaTicket') }}</label>
                    <select v-model="createForm.type" class="form-control">
                        <option value="account_verification">{{ $t('ticketTypeAccountVerification') }}</option>
                        <option value="bug_report">{{ $t('ticketTypeBug') }}</option>
                        <option value="contact">{{ $t('ticketTypeContact') }}</option>
                        <option value="feedback">{{ $t('ticketTypeSuggestion') }}</option>
                        <option value="report">{{ $t('ticketTypeReport') }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>{{ $t('asuntoTicket') }}</label>
                    <input v-model="createForm.subject" class="form-control" />
                </div>
                <div class="form-group">
                    <label>{{ $t('mensajeTicket') }}</label>
                    <textarea v-model="createForm.message_markdown" class="form-control" rows="4"></textarea>
                </div>
                <button class="btn btn-primary" :disabled="createDisabled" @click="createTicket">
                    {{ creating ? $t('guardando') : $t('crearTicket') }}
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
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
        UserSearchAutocomplete
    }
};
</script>

<style scoped>
.selected-user-value {
    margin-top: 0;
}
</style>
