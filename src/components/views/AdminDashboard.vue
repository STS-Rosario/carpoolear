<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('adminDashboardTitle') }}</h2>
            </div>
        </div>
        <div class="row admin-dashboard-cards">
            <div class="col-md-22 col-md-offset-1">
                <div class="panel panel-default admin-dashboard-card">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ $t('adminDashboardManualVerifications') }}</h3>
                    </div>
                    <div class="panel-body">
                        <Loading :data="manualIdentityValidations">
                            <div class="table-responsive">
                                <table class="table table-hover table-bordered admin-dashboard-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{ $t('id') }}</th>
                                            <th scope="col">{{ $t('nombre') }}</th>
                                            <th scope="col">{{ $t('fechaPago') }}</th>
                                            <th scope="col">{{ $t('fechaEnvio') }}</th>
                                            <th scope="col">{{ $t('tiempoDeEspera') }}</th>
                                            <th scope="col">{{ $t('estado') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in manualIdentityValidations" :key="item.id">
                                            <th scope="row">{{ item.id }}</th>
                                            <td>
                                                <router-link
                                                    :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                                >
                                                    {{ item.user_name || $t('na') }}
                                                </router-link>
                                            </td>
                                            <td>{{ item.paid_at ? formatDate(item.paid_at) : '-' }}</td>
                                            <td>{{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</td>
                                            <td>{{ formatWaitingTime(item) }}</td>
                                            <td>
                                                <span :class="getStatusBadgeClass(item)">
                                                    {{ getStatusLabel(item) }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="admin-dashboard-more">
                                <router-link :to="{ name: 'admin-manual-identity-validations' }">
                                    {{ $t('adminDashboardVerMas') }}
                                </router-link>
                            </p>
                            <template #no-data>
                                <div class="alert alert-info">{{ $t('adminDashboardNoPendingManualVerifications') }}</div>
                            </template>
                            <template #loading>
                                <div class="text-center">
                                    <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                                    <p>{{ $t('cargando') }}</p>
                                </div>
                            </template>
                        </Loading>
                    </div>
                </div>
            </div>
        </div>
        <div class="row admin-dashboard-cards">
            <div class="col-md-22 col-md-offset-1">
                <div class="panel panel-default admin-dashboard-card">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ $t('adminDashboardSupportTickets') }}</h3>
                    </div>
                    <div class="panel-body">
                        <Loading :data="supportTickets">
                            <div class="table-responsive">
                                <table class="table table-hover support-tickets-table support-tickets-table--compact admin-dashboard-table">
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
                                        <tr v-for="ticket in supportTickets" :key="ticket.id">
                                            <td class="support-tickets-table__subject">
                                                <router-link :to="{ name: 'admin-support-ticket-detail', params: { id: ticket.id } }">
                                                    #{{ ticket.id }} - {{ ticket.subject }}
                                                </router-link>
                                                <span
                                                    v-if="ticketOwnerDisplayName(ticket)"
                                                    class="support-tickets-table__owner text-muted"
                                                >
                                                    <span class="support-tickets-table__owner-sep" aria-hidden="true"> · </span>
                                                    <router-link
                                                        v-if="canLinkTicketOwnerProfile(ticket)"
                                                        :to="ticketOwnerAdminProfileRoute(ticket)"
                                                    >{{ ticketOwnerDisplayName(ticket) }}</router-link>
                                                    <span v-else>{{ ticketOwnerDisplayName(ticket) }}</span>
                                                </span>
                                                <span
                                                    v-if="hasUserLastReply(ticket)"
                                                    class="last-reply-icon text-warning"
                                                    title="Ultima respuesta del usuario"
                                                >
                                                    <i class="glyphicon glyphicon-comment"></i>
                                                </span>
                                            </td>
                                            <td class="support-tickets-table__narrow">
                                                <span :class="priorityClass(ticket.priority)">{{ priorityLabel(ticket.priority) }}</span>
                                            </td>
                                            <td class="support-tickets-table__narrow" :title="fullDate(ticket.created_at)">
                                                {{ relativeDate(ticket.created_at) }}
                                            </td>
                                            <td
                                                class="support-tickets-table__narrow"
                                                :class="updatedAgeAttentionClass(ticket)"
                                                :title="fullDate(ticket.updated_at)"
                                            >{{ relativeDate(ticket.updated_at) }}</td>
                                            <td class="support-tickets-table__narrow">
                                                <span :class="statusClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
                                            </td>
                                            <td class="support-tickets-table__narrow">{{ ticketCategoryLabel(ticket.type) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="admin-dashboard-more">
                                <router-link
                                    :to="{ name: 'admin-support-tickets', query: { needs_reply: '1' } }"
                                >
                                    {{ $t('adminDashboardVerMas') }}
                                </router-link>
                            </p>
                            <template #no-data>
                                <div class="alert alert-info">{{ $t('adminDashboardNoPendingSupportTickets') }}</div>
                            </template>
                            <template #loading>
                                <div class="text-center">
                                    <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                                    <p>{{ $t('cargando') }}</p>
                                </div>
                            </template>
                        </Loading>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import Loading from '../Loading';
import { AdminApi } from '../../services/api';
import { normalizeAdminDashboardResponse } from '../../utils/adminDashboardData';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel
} from '../../utils/adminManualIdentityValidationDisplay';
import {
    capitalizeFirst,
    supportTicketCanLinkOwnerProfile,
    supportTicketFullDate,
    supportTicketHasUserLastReply,
    supportTicketOwnerDisplayName,
    supportTicketPriorityClass,
    supportTicketPriorityLabel,
    supportTicketRelativeDate,
    supportTicketStatusClass,
    supportTicketStatusLabel,
    supportTicketUpdatedAgeAttentionClass,
    ticketCategoryLabel
} from '../../utils/adminSupportTicketTableDisplay';

export default {
    name: 'admin-dashboard',
    data() {
        return {
            manualIdentityValidations: null,
            supportTickets: null
        };
    },
    methods: {
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        formatWaitingTime(item) {
            return formatManualIdentityValidationWaitingTime(item, (key) => this.$t(key));
        },
        getStatusLabel(item) {
            return getManualIdentityValidationStatusLabel(item, (key) => this.$t(key));
        },
        getStatusBadgeClass(item) {
            return getManualIdentityValidationStatusBadgeClass(item);
        },
        capitalizeFirst,
        ticketCategoryLabel(type) {
            return ticketCategoryLabel(type, (key) => this.$t(key));
        },
        fullDate: supportTicketFullDate,
        relativeDate: supportTicketRelativeDate,
        updatedAgeAttentionClass(ticket) {
            return supportTicketUpdatedAgeAttentionClass(ticket);
        },
        statusLabel(status) {
            return supportTicketStatusLabel(status, (key) => this.$t(key));
        },
        statusClass: supportTicketStatusClass,
        priorityLabel(priority) {
            return supportTicketPriorityLabel(priority, (key) => this.$t(key));
        },
        priorityClass: supportTicketPriorityClass,
        hasUserLastReply: supportTicketHasUserLastReply,
        canLinkTicketOwnerProfile: supportTicketCanLinkOwnerProfile,
        ticketOwnerAdminProfileRoute(ticket) {
            return getAdminUserProfileRoute(ticket.user.id);
        },
        ticketOwnerDisplayName: supportTicketOwnerDisplayName,
        fetchDashboard() {
            const api = new AdminApi();
            return api.getDashboard().then((res) => {
                const { manualIdentityValidations, supportTickets } =
                    normalizeAdminDashboardResponse(res);
                this.manualIdentityValidations = manualIdentityValidations;
                this.supportTickets = supportTickets;
            }).catch(() => {
                this.manualIdentityValidations = [];
                this.supportTickets = [];
            });
        }
    },
    mounted() {
        this.fetchDashboard();
    },
    components: {
        AdminLayout,
        Loading
    }
};
</script>

<style scoped src="../../styles/supportTicketsTableCompact.css"></style>
<style scoped>
.admin-dashboard-cards {
    margin-top: 8px;
}

.admin-dashboard-card {
    margin-bottom: 20px;
}

.admin-dashboard-table {
    margin-bottom: 0;
}

.admin-dashboard-table thead th {
    background-color: #f3f6fa;
}

.admin-dashboard-table tbody tr:nth-child(odd) {
    background-color: #fafafa;
}

.admin-dashboard-more {
    margin: 12px 0 0;
}

.last-reply-icon {
    margin-left: 8px;
}
</style>
