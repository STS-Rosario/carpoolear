<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('rechazosMercadoPago') }}</h2>
                <form class="admin-mp-rejected-filters" @submit.prevent="applyFilters">
                    <AppInput
                        id="admin-mp-rejected-search"
                        v-model="q"
                        type="search"
                        :label="$t('buscar')"
                        :placeholder="$t('buscarMpRechazoPlaceholder')"
                    />
                    <AppButton variant="secondary" size="sm" type="submit">
                        {{ $t('buscar') }}
                    </AppButton>
                    <AppButton
                        v-if="hasActiveFilters"
                        variant="tertiary"
                        size="sm"
                        type="button"
                        @click="clearFilters"
                    >
                        {{ $t('limpiarFiltros') }}
                    </AppButton>
                </form>
                <Loading :data="list">
                    <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">{{ $t('id') }}</th>
                                <th scope="col">{{ $t('usuario') }} ID</th>
                                <th scope="col">{{ $t('nombre') }}</th>
                                <th scope="col">{{ $t('doc') }}</th>
                                <th scope="col">{{ $t('estado') }}</th>
                                <th scope="col">{{ $t('motivoRechazo') }}</th>
                                <th scope="col">{{ $t('fecha') }}</th>
                                <th scope="col">{{ $t('acciones') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user_id }}</td>
                                <td>{{ item.user_name || $t('na') }}</td>
                                <td>{{ displayDniOrDash(item.user_nro_doc) }}</td>
                                <td>
                                    <span :class="item.user_identity_validated ? 'label label-success' : 'label label-default'">
                                        {{ item.user_identity_validated ? $t('identidadValidada') : $t('identidadNoValidada') }}
                                    </span>
                                </td>
                                <td>{{ getRejectReasonLabel(item.reject_reason) }}</td>
                                <td>{{ formatDate(item.created_at) }}</td>
                                <td>
                                    <router-link
                                        v-if="item.user_id"
                                        :to="getAdminUserProfileRoute(item.user_id)"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ $t('verPerfil') }}
                                    </router-link>
                                    <AppPrimaryLink
                                        :to="{ name: 'admin-mp-rejected-validation-detail', params: { id: item.id } }"
                                    >
                                        {{ $t('verDetalle') }}
                                    </AppPrimaryLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <template #no-data><div class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayRechazosMp') }}</div>
                    </div></template>
                    <template #loading><div class="text-center" style="margin-top: 20px;">
                        <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                        <p>{{ $t('cargando') }}</p>
                    </div></template>
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
import { mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminPaginationBar from '../AdminPaginationBar.vue';
import Loading from '../Loading';
import AppPrimaryLink from '../ui/AppPrimaryLink.vue';
import AppInput from '../ui/AppInput.vue';
import AppButton from '../ui/AppButton.vue';
import { useAuthStore } from '../../stores/auth';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import { displayDniOrDash as formatDisplayDniOrDash } from '../../utils/formatDisplayDni';
import { DEFAULT_ADMIN_PER_PAGE } from '../../utils/adminPagination';

export default {
    name: 'AdminMpRejectedValidations',
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        hasActiveFilters() {
            return Boolean(String(this.q || '').trim());
        }
    },
    data() {
        return {
            list: null,
            listMeta: null,
            listPage: 1,
            listPerPage: DEFAULT_ADMIN_PER_PAGE,
            q: ''
        };
    },
    methods: {
        displayDniOrDash(value) {
            return formatDisplayDniOrDash(
                value,
                this.config,
                '-'
            );
        },
        getAdminUserProfileRoute,
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        getRejectReasonLabel(reason) {
            if (reason === 'dni_mismatch') return this.$t('rechazoDniMismatch');
            if (reason === 'name_mismatch') return this.$t('rechazoNameMismatch');
            if (reason === 'both_mismatch') return this.$t('both_mismatch');
            return reason || '-';
        },
        applyFilters() {
            this.listPage = 1;
            this.fetchList();
        },
        clearFilters() {
            this.q = '';
            this.listPage = 1;
            this.fetchList();
        },
        fetchList() {
            const api = new AdminApi();
            const trimmedQ = String(this.q || '').trim();
            const params = {
                page: this.listPage,
                per_page: this.listPerPage
            };
            if (trimmedQ) {
                params.q = trimmedQ;
            }
            return api.getMercadoPagoRejectedValidations(params).then((res) => {
                this.list = res.data || [];
                this.listMeta = res.meta || null;
            }).catch(() => {
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
        Loading,
        AppPrimaryLink,
        AppInput,
        AppButton
    }
};
</script>

<style scoped>
.admin-mp-rejected-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.75rem 1rem;
    margin-bottom: 1.25rem;
}

.admin-mp-rejected-filters :deep(.app-input) {
    min-width: min(100%, 22rem);
    flex: 1 1 18rem;
}
</style>