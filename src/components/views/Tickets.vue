<template>
    <div class="container">
        <h3>{{ $t('soporte') }}</h3>
        <div class="mbot-10">
            <router-link class="btn btn-primary" :to="{ name: 'ticket-new' }">
                Crear nuevo ticket de soporte
            </router-link>
        </div>

        <p v-if="!safeTickets.length" class="alert alert-warning">No tenés tickets de soporte</p>

        <div v-else class="list-group">
            <router-link
                v-for="ticket in safeTickets"
                :key="ticket.id"
                class="list-group-item"
                :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
            >
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <p>{{ ticket.subject }}</p>
                <p>Creado: {{ ticket.created_at || '-' }}</p>
                <p>Actualizado: {{ ticket.updated_at || '-' }}</p>
                <p>
                    Estado:
                    <span :class="statusClass(ticket.status)">{{ ticket.status }}</span>
                </p>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useTicketsStore } from '../../stores/tickets';

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
        statusClass(status) {
            return this.statusClassMap[status] || 'label label-info';
        }
    },
    mounted() {
        this.fetchList();
    }
};
</script>
