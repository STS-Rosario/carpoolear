<template>
    <AdminLayout>
        <h3>{{ $t('soporte') }}</h3>
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
        })
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
