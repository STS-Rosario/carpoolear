<template>
    <AdminLayout>
        <h3>{{ $t('soporte') }}</h3>
        <p class="mb-2 support-tickets-admin-actions">
            <router-link class="btn btn-primary" :to="{ name: 'admin-support-ticket-new' }">
                {{ $t('crearTicket') }}
            </router-link>
            <router-link class="btn btn-default mleft-6" :to="{ name: 'admin-support-reply-templates' }">
                {{ $t('editarPlantillasRespuestas') }}
            </router-link>
        </p>
        <p v-if="loading" class="alert alert-info">{{ $t('cargandoNotificaciones') }}</p>
        <p v-else-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-else-if="!safeTickets.length" class="alert alert-warning">{{ $t('noHayTickets') }}</p>
        <div v-else class="table-responsive">
            <table class="table table-hover support-tickets-table">
                <thead>
                    <tr>
                        <th>{{ capitalizeFirst($t('asuntoTicket')) }}</th>
                        <th>{{ capitalizeFirst($t('creado')) }}</th>
                        <th>{{ capitalizeFirst($t('actualizado')) }}</th>
                        <th>{{ capitalizeFirst($t('estado')) }}</th>
                        <th>{{ capitalizeFirst($t('prioridad')) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in safeTickets" :key="ticket.id">
                        <td>
                            <router-link :to="{ name: 'admin-support-ticket-detail', params: { id: ticket.id } }">
                                #{{ ticket.id }} - {{ ticket.subject }}
                            </router-link>
                            <span
                                v-if="hasUserLastReply(ticket)"
                                class="last-reply-icon text-warning"
                                title="Ultima respuesta del usuario"
                            >
                                <i class="glyphicon glyphicon-comment"></i>
                            </span>
                        </td>
                        <td :title="fullDate(ticket.created_at)">{{ relativeDate(ticket.created_at) }}</td>
                        <td :title="fullDate(ticket.updated_at)">{{ relativeDate(ticket.updated_at) }}</td>
                        <td><span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span></td>
                        <td><span :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useTicketsStore } from '../../stores/tickets';
import dayjs from '../../dayjs';

const STATUS_LABEL_KEYS = {
    Open: 'estadoPendiente',
    'Esperando respuesta': 'esperaUsuarioResponda',
    'En revision': 'estadoPendienteRevision',
    Resuelto: 'estadoAprobado',
    Cerrado: 'estadoCerrado'
};

const PRIORITY_LABEL_KEYS = {
    low: 'prioridadBaja',
    normal: 'prioridadNormal',
    high: 'prioridadAlta'
};

export default {
    name: 'admin-support-tickets',
    data() {
        return {
            loading: false,
            error: ''
        };
    },
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'adminList'
        }),
        safeTickets() {
            return Array.isArray(this.tickets) ? this.tickets : [];
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchAdminList: 'fetchAdminList'
        }),
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        fullDate(value) {
            if (!value) return '-';
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        },
        relativeDate(value) {
            if (!value) return '-';
            return dayjs(value).fromNow();
        },
        statusLabel(status) {
            if (STATUS_LABEL_KEYS[status]) return this.$t(STATUS_LABEL_KEYS[status]);
            return status || '-';
        },
        statusClass(status) {
            return {
                Cerrado: 'label label-default',
                Resuelto: 'label label-success',
                'Esperando respuesta': 'label label-warning',
                'En revision': 'label label-info'
            }[status] || 'label label-primary';
        },
        priorityLabel(priority) {
            const key = (priority || '').toLowerCase();
            if (PRIORITY_LABEL_KEYS[key]) return this.$t(PRIORITY_LABEL_KEYS[key]);
            return this.capitalizeFirst(priority || '');
        },
        priorityClass(priority) {
            const key = (priority || '').toLowerCase();
            return {
                high: 'label label-danger',
                normal: 'label label-info',
                low: 'label label-default'
            }[key] || 'label label-default';
        },
        hasUserLastReply(ticket) {
            return Number(ticket && ticket.unread_for_admin) > 0;
        }
    },
    mounted() {
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

<style scoped>
.support-tickets-table {
    border: 1px solid #dcdcdc;
}

.support-tickets-table thead th {
    background-color: #f3f6fa;
    border: 1px solid #dcdcdc;
}

.support-tickets-table tbody td {
    border: 1px solid #e5e5e5;
}

.support-tickets-table tbody tr:nth-child(odd) {
    background-color: #fafafa;
}

.last-reply-icon {
    margin-left: 8px;
}

.support-tickets-admin-actions .mleft-6 {
    margin-left: 6px;
}
</style>
