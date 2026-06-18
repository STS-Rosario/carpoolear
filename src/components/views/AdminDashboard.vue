<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('adminDashboardTitle') }}</h2>
            </div>
        </div>
        <div class="row admin-dashboard-cards">
            <div class="col-md-11 col-md-offset-1">
                <div class="panel panel-default admin-dashboard-card">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ $t('adminDashboardManualVerifications') }}</h3>
                    </div>
                    <div class="panel-body">
                        <Loading :data="manualIdentityValidations">
                            <ul class="list-group admin-dashboard-list">
                                <li
                                    v-for="item in manualIdentityValidations"
                                    :key="item.id"
                                    class="list-group-item"
                                >
                                    <router-link
                                        :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                    >
                                        #{{ item.id }} - {{ item.user_name || $t('na') }}
                                    </router-link>
                                    <span class="text-muted admin-dashboard-meta">
                                        {{ formatDate(item.submitted_at) }}
                                    </span>
                                </li>
                            </ul>
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
            <div class="col-md-11">
                <div class="panel panel-default admin-dashboard-card">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ $t('adminDashboardSupportTickets') }}</h3>
                    </div>
                    <div class="panel-body">
                        <Loading :data="supportTickets">
                            <ul class="list-group admin-dashboard-list">
                                <li
                                    v-for="ticket in supportTickets"
                                    :key="ticket.id"
                                    class="list-group-item"
                                >
                                    <router-link
                                        :to="{ name: 'admin-support-ticket-detail', params: { id: ticket.id } }"
                                    >
                                        #{{ ticket.id }} - {{ ticket.subject }}
                                    </router-link>
                                    <span class="text-muted admin-dashboard-meta">
                                        {{ formatDate(ticket.updated_at) }}
                                    </span>
                                </li>
                            </ul>
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

<style scoped>
.admin-dashboard-cards {
    margin-top: 8px;
}

.admin-dashboard-card {
    margin-bottom: 20px;
}

.admin-dashboard-list {
    margin-bottom: 0;
}

.admin-dashboard-meta {
    display: block;
    font-size: 12px;
    margin-top: 4px;
}

.admin-dashboard-more {
    margin: 12px 0 0;
}
</style>
