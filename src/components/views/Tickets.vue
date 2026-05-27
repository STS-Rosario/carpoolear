<template>
    <div class="container">
        <h3>{{ $t('soporte') }}</h3>
        <div class="mbot-10 create-ticket-cta">
            <router-link class="btn btn-primary" :to="{ name: 'ticket-new' }">
                {{ $t('crearNuevoTicketMesaAyuda') }}
            </router-link>
        </div>

        <p v-if="!safeTickets.length" class="alert alert-warning">{{ $t('noHayTicketsUsuarioMesaAyuda') }}</p>

        <div v-else class="table-responsive">
            <table class="table table-hover support-tickets-table support-tickets-table--compact">
                <thead>
                    <tr>
                        <th class="support-tickets-table__subject">{{ capitalizeFirst($t('asuntoTicket')) }}</th>
                        <th class="support-tickets-table__narrow">{{ capitalizeFirst($t('prioridad')) }}</th>
                        <th class="support-tickets-table__narrow">{{ capitalizeFirst($t('creado')) }}</th>
                        <th class="support-tickets-table__narrow">{{ capitalizeFirst($t('actualizado')) }}</th>
                        <th class="support-tickets-table__narrow">{{ capitalizeFirst($t('estado')) }}</th>
                        <th class="support-tickets-table__narrow">{{ capitalizeFirst($t('categoriaTicket')) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in safeTickets" :key="ticket.id">
                        <td class="support-tickets-table__subject">
                            <router-link :to="{ name: 'ticket-detail', params: { id: ticket.id } }">
                                #{{ ticket.id }} - {{ ticket.subject }}
                            </router-link>
                        </td>
                        <td class="support-tickets-table__narrow"><span :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span></td>
                        <td class="support-tickets-table__narrow" :title="fullDate(ticket.created_at)">{{ relativeDate(ticket.created_at) }}</td>
                        <td class="support-tickets-table__narrow" :title="fullDate(ticket.updated_at)">{{ relativeDate(ticket.updated_at) }}</td>
                        <td class="support-tickets-table__narrow">
                            <span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                        </td>
                        <td class="support-tickets-table__narrow">{{ ticketCategoryLabel(ticket.type) }}</td>
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
import { TICKET_TYPE_LABEL_KEYS, TICKET_PRIORITY_LABEL_KEYS } from '../../utils/supportTicketLabels';
import { USER_TICKET_STATUS_LABEL_KEYS as STATUS_LABEL_KEYS } from '../../utils/supportTicketStatusLabels';

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
        ticketCategoryLabel(type) {
            const key = TICKET_TYPE_LABEL_KEYS[type];
            if (key) return this.$t(key);
            return this.capitalizeFirst(type || '');
        },
        priorityLabel(priority) {
            const key = (priority || '').toLowerCase();
            if (TICKET_PRIORITY_LABEL_KEYS[key]) return this.$t(TICKET_PRIORITY_LABEL_KEYS[key]);
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
        statusClass(status) {
            return this.statusClassMap[status] || 'label label-info';
        }
    },
    mounted() {
        this.fetchList();
    }
};
</script>

<style scoped src="../../styles/supportTicketsTableCompact.css"></style>
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
