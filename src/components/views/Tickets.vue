<template>
    <div class="container">
        <div class="mbot-10">
            <router-link class="btn btn-primary" :to="{ name: 'ticket-new' }">
                Crear nuevo ticket de soporte
            </router-link>
        </div>

        <div class="list-group">
            <router-link
                v-for="ticket in tickets"
                :key="ticket.id"
                class="list-group-item"
                :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
            >
                <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                <p>{{ ticket.status }} · {{ ticket.priority }}</p>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useTicketsStore } from '../../stores/tickets';

export default {
    name: 'tickets',
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'list'
        })
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchList: 'fetchList'
        })
    },
    mounted() {
        this.fetchList();
    }
};
</script>
