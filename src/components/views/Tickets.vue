<template>
    <div class="container">
        <h3>{{ $t('soporte') }}</h3>
        <div class="mbot-10 create-ticket-cta">
            <router-link class="btn btn-primary" :to="{ name: 'ticket-new' }">
                Crear nuevo ticket de soporte
            </router-link>
        </div>

        <p v-if="!safeTickets.length" class="alert alert-warning">No tenés tickets de soporte</p>

        <div v-else class="table-responsive">
            <table class="table table-hover support-tickets-table">
                <thead>
                    <tr>
                        <th>{{ capitalizeFirst($t('asuntoTicket')) }}</th>
                        <th>{{ capitalizeFirst($t('creado')) }}</th>
                        <th>{{ capitalizeFirst($t('actualizado')) }}</th>
                        <th>{{ capitalizeFirst($t('estado')) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in safeTickets" :key="ticket.id">
                        <td>
                            <router-link :to="{ name: 'ticket-detail', params: { id: ticket.id } }">
                                #{{ ticket.id }} - {{ ticket.subject }}
                            </router-link>
                        </td>
                        <td :title="fullDate(ticket.created_at)">{{ relativeDate(ticket.created_at) }}</td>
                        <td :title="fullDate(ticket.updated_at)">{{ relativeDate(ticket.updated_at) }}</td>
                        <td>
                            <span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useTicketsStore } from '../../stores/tickets';
import dayjs from '../../dayjs';

const STATUS_LABEL_KEYS = {
    Open: 'estadoPendiente',
    'Esperando respuesta': 'esperaUsuarioResponda',
    'En revision': 'estadoPendienteRevision',
    Resuelto: 'estadoAprobado',
    Cerrado: 'estadoCerrado'
};

export default {
    name: 'tickets',
    data() {
        return {
            statusClassMap: {
                Cerrado: 'label label-default',
                Resuelto: 'label label-success',
                'Esperando respuesta': 'label label-warning'
            }
        };
    },
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'list'
        }),
        safeTickets() {
            return Array.isArray(this.tickets) ? this.tickets : [];
        }
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchList: 'fetchList'
        }),
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
        capitalizeFirst(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        statusClass(status) {
            return this.statusClassMap[status] || 'label label-info';
        }
    },
    mounted() {
        this.fetchList();
    }
};
</script>

<style scoped>
.create-ticket-cta {
    margin-bottom: 16px;
}

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
</style>
