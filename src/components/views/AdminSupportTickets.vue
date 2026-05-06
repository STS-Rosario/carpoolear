<template>
    <AdminLayout>
        <h3>{{ $t('soporte') }}</h3>
        <div class="panel panel-default">
            <div class="panel-heading">{{ $t('crearTicket') }}</div>
            <div class="panel-body">
                <div class="form-group">
                    <label>{{ $t('usuario') }} ID</label>
                    <input v-model.number="createForm.user_id" class="form-control" type="number" min="1" />
                    <p v-if="prefilledUserName" class="help-block">{{ prefilledUserName }}</p>
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
                <button class="btn btn-primary" :disabled="creating" @click="createTicket">
                    {{ creating ? $t('guardando') : $t('crearTicket') }}
                </button>
            </div>
        </div>
        <p v-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
        <p v-else-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-else-if="!safeTickets.length" class="alert alert-warning">{{ $t('noHayTickets') }}</p>
        <div v-else class="list-group">
            <router-link
                v-for="ticket in safeTickets"
                :key="ticket.id"
                class="list-group-item"
                :to="{ name: 'admin-support-ticket-detail', params: { id: ticket.id } }"
            >
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <p>{{ ticket.status }} · {{ ticket.priority }}</p>
            </router-link>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useTicketsStore } from '../../stores/tickets';
import dialogs from '../../services/dialogs';

export default {
    name: 'admin-support-tickets',
    data() {
        return {
            loading: false,
            error: '',
            creating: false,
            createForm: {
                user_id: null,
                type: 'account_verification',
                subject: '',
                message_markdown: ''
            }
        };
    },
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'adminList'
        }),
        safeTickets() {
            return Array.isArray(this.tickets) ? this.tickets : [];
        },
        prefilledUserName() {
            const userName = this.$route.query.userName;
            return userName ? String(userName) : '';
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchAdminList: 'fetchAdminList',
            adminCreateTicket: 'adminCreateTicket'
        }),
        applyPrefill() {
            const userId = parseInt(this.$route.query.userId, 10);
            if (!Number.isNaN(userId) && userId > 0) {
                this.createForm.user_id = userId;
            }
            if (this.$route.query.type) {
                this.createForm.type = String(this.$route.query.type);
            }
            if (this.$route.query.subject) {
                this.createForm.subject = String(this.$route.query.subject);
            }
            if (this.$route.query.message) {
                this.createForm.message_markdown = String(this.$route.query.message);
            }
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
        this.loading = true;
        this.error = '';
        this.fetchAdminList()
            .catch(() => {
                this.error = this.$t('errorCargandoTickets');
            })
            .finally(() => {
                this.loading = false;
            });
    },
    components: {
        AdminLayout
    }
};
</script>
