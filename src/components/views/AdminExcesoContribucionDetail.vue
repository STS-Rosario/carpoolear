<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <AppButton
                    variant="secondary"
                    size="sm"
                    class="admin-exceso-back"
                    :to="{ name: 'admin-exceso-contribucion' }"
                >
                    {{ $t('volver') }}
                </AppButton>
                <div v-if="loading" class="text-center">
                    <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                    <p>{{ $t('cargando') }}</p>
                </div>
                <div v-else-if="item" class="panel panel-default">
                    <div class="panel-heading">
                        <h3>{{ $t('excesoContribucion') }} #{{ item.id }}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="admin-exceso-action-links admin-exceso-action-links--top">
                            <router-link
                                v-if="item.user_id"
                                :to="getAdminUserProfileRoute(item.user_id)"
                                class="admin-exceso-action-link"
                            >
                                {{ $t('verPerfil') }}
                            </router-link>
                            <router-link
                                :to="adminTripSearchRoute(item.id)"
                                class="admin-exceso-action-link"
                            >
                                {{ $t('verViaje') }}
                            </router-link>
                        </div>

                        <h4>{{ $t('datosViaje') }}</h4>
                        <p>
                            <strong>{{ $t('id') }}:</strong>
                            <router-link :to="adminTripSearchRoute(item.id)">{{ item.id }}</router-link>
                        </p>
                        <p><strong>{{ $t('origen') }}:</strong> {{ item.from_town }}</p>
                        <p><strong>{{ $t('destino') }}:</strong> {{ item.to_town }}</p>
                        <p v-if="item.trip_date">
                            <strong>{{ $t('fecha') }}:</strong> {{ formatDate(item.trip_date) }}
                        </p>
                        <p><strong>{{ $t('contribucion') }}:</strong> {{ formatTripContributionPesosLabel(item.seat_price_cents) }}</p>
                        <p><strong>{{ $t('contribucionPotencial') }}:</strong> {{ formatTripContributionPesosLabel(item.potential_seat_price_cents) }}</p>
                        <p><strong>{{ $t('contribucionPromedio') }}:</strong> {{ formatAdminTripContributionLabel(item.average_contribution_cents) ?? $t('noDisponible') }}</p>
                        <p><strong>{{ $t('porcentajeExceso') }}:</strong> {{ formatAdminExcessContributionPercentageLabel(item.excess_contribution_percentage) ?? $t('noDisponible') }}</p>
                        <p v-if="item.description">
                            <strong>{{ $t('descripcion') }}:</strong> {{ item.description }}
                        </p>
                        <p>
                            <strong>{{ $t('estado') }}:</strong>
                            <span :class="excessContributionStatusClass(item.exceso_contribucion_status)">
                                {{
                                    excessContributionStatusLabel(
                                        item.exceso_contribucion_status,
                                        (key) => $t(key)
                                    )
                                }}
                            </span>
                        </p>

                        <h4>{{ $t('datosUsuario') }}</h4>
                        <p><strong>{{ $t('usuario') }} ID:</strong> {{ item.user_id }}</p>
                        <p><strong>{{ $t('nombre') }}:</strong> {{ item.user_name || $t('na') }}</p>
                        <p><strong>{{ $t('email') }}:</strong> {{ item.user_email || '-' }}</p>
                        <p>
                            <strong>{{ $t('tieneNotas') }}:</strong>
                            {{ item.has_private_note ? $t('si') : $t('no') }}
                        </p>
                        <p>
                            <strong>{{ $t('ticketSoporte') }}:</strong>
                            <router-link
                                v-if="Number(item.excess_contribution_support_tickets_count) > 0"
                                :to="excessContributionSupportTicketsRoute(item.user_id)"
                            >
                                {{ item.excess_contribution_support_tickets_count }}
                            </router-link>
                            <span v-else>-</span>
                        </p>

                        <div class="admin-exceso-actions">
                            <AppButton
                                v-if="item.user_id"
                                variant="secondary"
                                size="sm"
                                :to="{
                                    name: 'admin-support-ticket-new',
                                    query: {
                                        userId: item.user_id,
                                        userName: item.user_name,
                                        type: 'excess_contribution',
                                        subject: $t('ticketTypeExcessContribution')
                                    }
                                }"
                            >
                                {{ $t('crearTicketSoporte') }}
                            </AppButton>
                        </div>

                        <div class="admin-exceso-status-actions mt-3">
                            <h4>{{ $t('accion') }}</h4>
                            <AppButton
                                v-for="status in statusActions"
                                :key="status"
                                :variant="excessContributionStatusButtonVariant(status)"
                                size="sm"
                                class="admin-exceso-status-action"
                                :disabled="updatingStatus"
                                :loading="updatingStatus && pendingStatus === status"
                                @click="updateStatus(status)"
                            >
                                {{ excessContributionStatusActionLabel(status, (key) => $t(key)) }}
                            </AppButton>
                        </div>
                    </div>
                </div>
                <div v-else class="alert alert-warning">{{ $t('noHayExcesoContribucion') }}</div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AppButton from '../ui/AppButton.vue';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import {
    adminTripSearchRoute,
    excessContributionStatusActionLabel,
    excessContributionStatusButtonVariant,
    excessContributionStatusActions,
    excessContributionStatusClass,
    excessContributionStatusLabel,
    excessContributionSupportTicketsRoute,
    formatTripContributionPesosLabel,
    formatAdminTripContributionLabel,
    formatAdminExcessContributionPercentageLabel
} from '../../utils/adminTripExcessContributionList';

export default {
    name: 'AdminExcesoContribucionDetail',
    props: {
        tripId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            item: null,
            loading: true,
            updatingStatus: false,
            pendingStatus: null
        };
    },
    computed: {
        statusActions() {
            if (!this.item) {
                return [];
            }
            return excessContributionStatusActions(this.item.exceso_contribucion_status);
        }
    },
    methods: {
        formatTripContributionPesosLabel,
        formatAdminTripContributionLabel,
        formatAdminExcessContributionPercentageLabel,
        excessContributionStatusLabel,
        excessContributionStatusClass,
        excessContributionStatusActionLabel,
        excessContributionStatusButtonVariant,
        adminTripSearchRoute,
        excessContributionSupportTicketsRoute,
        getAdminUserProfileRoute,
        formatDate(value) {
            if (!value) {
                return '-';
            }
            return new Date(value).toLocaleString();
        },
        fetchDetail() {
            this.loading = true;
            const api = new AdminApi();
            return api
                .getTripExcessContribution(this.tripId)
                .then((res) => {
                    this.item = res.data || null;
                })
                .catch(() => {
                    this.item = null;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updateStatus(status) {
            if (!this.item || this.updatingStatus) {
                return;
            }
            this.updatingStatus = true;
            this.pendingStatus = status;
            const api = new AdminApi();
            return api
                .updateTripExcessContributionStatus(this.tripId, status)
                .then((res) => {
                    this.item = res.data || this.item;
                })
                .finally(() => {
                    this.updatingStatus = false;
                    this.pendingStatus = null;
                });
        }
    },
    mounted() {
        this.fetchDetail();
    },
    components: {
        AdminLayout,
        AppButton
    }
};
</script>

<style scoped>
.admin-exceso-back {
    margin-bottom: 16px;
}

.admin-exceso-status-action + .admin-exceso-status-action {
    margin-left: 8px;
}

.admin-exceso-action-link {
    font-size: 16px;
    margin-right: 16px;
}

.admin-exceso-action-links {
    margin-top: 10px;
}

.admin-exceso-action-links--top {
    margin-top: 0;
    margin-bottom: 16px;
}
</style>
