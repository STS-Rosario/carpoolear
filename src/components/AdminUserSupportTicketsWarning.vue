<template>
    <div
        v-if="showWarning"
        class="alert alert-warning admin-user-support-tickets-warning"
        role="alert"
    >
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        {{ $t('adminUsuarioTieneTicketsSoporte', { count: supportTicketsCount }) }}
        <router-link :to="supportTicketsRoute">
            {{ $t('adminUsuarioVerTicketsSoporte', { count: supportTicketsCount }) }}
        </router-link>
    </div>
</template>

<script>
import {
    adminUserSupportTicketsRoute,
    shouldShowAdminUserSupportTicketsWarning
} from '../utils/adminUserSupportTicketsLink';

export default {
    name: 'AdminUserSupportTicketsWarning',
    props: {
        userId: {
            type: [Number, String],
            default: null
        },
        supportTicketsCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        showWarning() {
            return shouldShowAdminUserSupportTicketsWarning(this.supportTicketsCount);
        },
        supportTicketsRoute() {
            return adminUserSupportTicketsRoute(this.userId);
        }
    }
};
</script>

<style scoped>
.admin-user-support-tickets-warning {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

.admin-user-support-tickets-warning .fa {
    margin-right: 0.35rem;
}
</style>
