<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('excesoContribucion') }}</h2>
                <Loading :data="list">
                    <div class="table-responsive">
                        <table class="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('id') }}</th>
                                    <th scope="col">{{ $t('usuario') }}</th>
                                    <th scope="col">{{ $t('origen') }}</th>
                                    <th scope="col">{{ $t('destino') }}</th>
                                    <th scope="col">{{ $t('contribucion') }}</th>
                                    <th scope="col">{{ $t('contribucionPotencial') }}</th>
                                    <th scope="col">{{ $t('tieneNotas') }}</th>
                                    <th scope="col">{{ $t('ticketSoporte') }}</th>
                                    <th scope="col">{{ $t('estado') }}</th>
                                    <th scope="col">{{ $t('acciones') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item.id">
                                    <th scope="row">
                                        <router-link :to="adminExcessContributionDetailRoute(item.id)">
                                            {{ item.id }}
                                        </router-link>
                                    </th>
                                    <td>{{ item.user_name || $t('na') }}</td>
                                    <td>{{ item.from_town }}</td>
                                    <td>{{ item.to_town }}</td>
                                    <td>{{ formatTripContributionPesosLabel(item.seat_price_cents) }}</td>
                                    <td>{{ formatTripContributionPesosLabel(item.potential_seat_price_cents) }}</td>
                                    <td>{{ item.has_private_note ? $t('si') : $t('no') }}</td>
                                    <td>
                                        <router-link
                                            v-if="
                                                item.user_id &&
                                                Number(item.excess_contribution_support_tickets_count) > 0
                                            "
                                            :to="excessContributionSupportTicketsRoute(item.user_id)"
                                            class="btn btn-link btn-sm"
                                        >
                                            {{ item.excess_contribution_support_tickets_count }}
                                        </router-link>
                                        <span v-else>-</span>
                                    </td>
                                    <td>
                                        <span :class="excessContributionStatusClass(item.exceso_contribucion_status)">
                                            {{
                                                excessContributionStatusLabel(
                                                    item.exceso_contribucion_status,
                                                    (key) => $t(key)
                                                )
                                            }}
                                        </span>
                                    </td>
                                    <td>
                                        <router-link
                                            :to="adminExcessContributionDetailRoute(item.id)"
                                            class="btn btn-link btn-sm"
                                        >
                                            {{ $t('verDetalle') }}
                                        </router-link>
                                        <router-link
                                            v-if="item.user_id"
                                            :to="getAdminUserProfileRoute(item.user_id)"
                                            class="btn btn-link btn-sm"
                                        >
                                            {{ $t('verPerfil') }}
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <template #no-data>
                        <div class="text-center" style="margin-top: 20px;">
                            <div class="alert alert-info">{{ $t('noHayExcesoContribucion') }}</div>
                        </div>
                    </template>
                    <template #loading>
                        <div class="text-center" style="margin-top: 20px;">
                            <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                            <p>{{ $t('cargando') }}</p>
                        </div>
                    </template>
                </Loading>
                <AdminPaginationBar
                    v-if="listMeta && listMeta.pagination"
                    :pagination="listMeta.pagination"
                    :per-page="listPerPage"
                    :loading="list === null"
                    @prev="goPrevPage"
                    @next="goNextPage"
                    @update:per-page="onPerPageChange"
                />
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminPaginationBar from '../AdminPaginationBar.vue';
import Loading from '../Loading';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';
import {
    adminExcessContributionDetailRoute,
    excessContributionStatusClass,
    excessContributionStatusLabel,
    excessContributionSupportTicketsRoute,
    formatTripContributionPesosLabel
} from '../../utils/adminTripExcessContributionList';

export default {
    name: 'AdminExcesoContribucion',
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE
        };
    },
    methods: {
        formatTripContributionPesosLabel,
        excessContributionStatusLabel,
        excessContributionStatusClass,
        adminExcessContributionDetailRoute,
        excessContributionSupportTicketsRoute,
        getAdminUserProfileRoute,
        fetchList() {
            const api = new AdminApi();
            return api
                .getTripExcessContributions({
                    page: this.listPage,
                    per_page: this.listPerPage
                })
                .then((res) => {
                    this.list = res.data || [];
                    this.listMeta = res.meta || null;
                })
                .catch(() => {
                    this.list = [];
                    this.listMeta = null;
                });
        },
        goPrevPage() {
            const pagination = this.listMeta && this.listMeta.pagination;
            if (!pagination || pagination.current_page <= 1) {
                return;
            }
            this.listPage = pagination.current_page - 1;
            this.fetchList();
        },
        goNextPage() {
            const pagination = this.listMeta && this.listMeta.pagination;
            if (!pagination || pagination.current_page >= pagination.total_pages) {
                return;
            }
            this.listPage = pagination.current_page + 1;
            this.fetchList();
        },
        onPerPageChange(perPage) {
            this.listPerPage = perPage;
            this.listPage = 1;
            this.fetchList();
        }
    },
    mounted() {
        this.fetchList();
    },
    components: {
        AdminLayout,
        AdminPaginationBar,
        Loading
    }
};
</script>
