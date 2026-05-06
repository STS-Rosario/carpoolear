<template>
    <AdminLayout>
        <h3>{{ $t('crearTicket') }}</h3>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="form-group">
                    <label>{{ $t('usuario') }}</label>
                    <input
                        v-model.trim="userSearch"
                        type="text"
                        class="form-control"
                        :placeholder="$t('escribeUnNombreYPresionaBuscar')"
                        @input="onSearchUsers"
                    />
                    <ul v-if="showAutocomplete" class="list-group autocomplete-users">
                        <li
                            v-for="user in userOptions"
                            :key="user.id"
                            class="list-group-item"
                            @click="selectUser(user)"
                        >
                            {{ user.id }} - {{ user.name }} ({{ user.email }})
                        </li>
                        <li v-if="!searchLoading && !userOptions.length" class="list-group-item text-muted">
                            {{ $t('noSeEncontroNingunUsuario') }}
                        </li>
                        <li v-if="searchLoading" class="list-group-item text-muted">
                            {{ $t('cargandoUsuarios') }}
                        </li>
                    </ul>
                </div>

                <div class="form-group">
                    <label>{{ $t('usuario') }}</label>
                    <p class="form-control-static selected-user-value" v-if="selectedUserLabel">{{ selectedUserLabel }}</p>
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
import { useTicketsStore } from '../../stores/tickets';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs';

export default {
    name: 'admin-support-ticket-new',
    data() {
        return {
            creating: false,
            searchLoading: false,
            showAutocomplete: false,
            userOptions: [],
            userSearch: '',
            selectedUser: null,
            userSearchTimer: null,
            createForm: {
                user_id: null,
                type: 'account_verification',
                subject: '',
                message_markdown: ''
            }
        };
    },
    computed: {
        selectedUserLabel() {
            if (!this.selectedUser || !this.selectedUser.id) return '';
            return `${this.selectedUser.id} - ${this.selectedUser.name || ''}`.trim();
        },
        createDisabled() {
            return this.creating ||
                !this.createForm.user_id ||
                !this.createForm.subject ||
                !this.createForm.message_markdown;
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
                this.userSearch = `${userId}${userName ? ` - ${userName}` : ''}`;
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
        onSearchUsers() {
            if (this.userSearchTimer) clearTimeout(this.userSearchTimer);
            const term = this.userSearch;
            if (!term) {
                this.userOptions = [];
                this.showAutocomplete = false;
                this.selectedUser = null;
                this.createForm.user_id = null;
                return;
            }
            this.userSearchTimer = setTimeout(() => {
                this.searchLoading = true;
                this.showAutocomplete = true;
                const adminApi = new AdminApi();
                adminApi.searchUsers({ name: term }).then((response) => {
                    const rows = Array.isArray(response.data) ? response.data : [];
                    this.userOptions = rows.slice(0, 8);
                }).catch(() => {
                    this.userOptions = [];
                }).finally(() => {
                    this.searchLoading = false;
                });
            }, 250);
        },
        selectUser(user) {
            this.selectedUser = user;
            this.userSearch = `${user.id} - ${user.name || ''}`.trim();
            this.createForm.user_id = user.id;
            this.showAutocomplete = false;
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
    beforeUnmount() {
        if (this.userSearchTimer) {
            clearTimeout(this.userSearchTimer);
        }
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.autocomplete-users {
    margin-top: 6px;
    max-height: 240px;
    overflow: auto;
    cursor: pointer;
    background: #fff;
}

.autocomplete-users .list-group-item {
    color: #333;
    background: #fff;
}

.autocomplete-users .list-group-item:hover {
    background: #f5f5f5;
}

.selected-user-value {
    margin-top: 0;
}
</style>
