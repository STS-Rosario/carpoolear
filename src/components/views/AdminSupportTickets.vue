<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-20 col-md-offset-2">
                <div class="list-group">
                    <router-link
                        v-for="ticket in tickets"
                        :key="ticket.id"
                        class="list-group-item"
                        :to="{ name: 'admin-support-ticket-detail', params: { id: ticket.id } }"
                    >
                        <strong>#{{ ticket.id }} - {{ ticket.subject }}</strong>
                        <p>{{ ticket.status }} · {{ ticket.priority }}</p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import adminNav from '../sections/adminNav';
import { useTicketsStore } from '../../stores/tickets';

export default {
    name: 'admin-support-tickets',
    computed: {
        ...mapState(useTicketsStore, {
            tickets: 'adminList'
        })
    },
    methods: {
        ...mapActions(useTicketsStore, {
            fetchAdminList: 'fetchAdminList'
        })
    },
    mounted() {
        this.fetchAdminList();
    },
    components: {
        adminNav
    }
};
</script>
