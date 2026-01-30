<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('validacionesManuales') }}</h2>
                <Loading :data="list">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">{{ $t('id') }}</th>
                                <th scope="col">{{ $t('nombre') }}</th>
                                <th scope="col">{{ $t('fechaPago') }}</th>
                                <th scope="col">{{ $t('fechaEnvio') }}</th>
                                <th scope="col">{{ $t('pagado') }}</th>
                                <th scope="col">{{ $t('estado') }}</th>
                                <th scope="col">{{ $t('acciones') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user_name || $t('na') }}</td>
                                <td>{{ item.paid_at ? formatDate(item.paid_at) : '-' }}</td>
                                <td>{{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</td>
                                <td>{{ item.paid ? $t('si') : $t('no') }}</td>
                                <td>
                                    <span :class="getStatusBadgeClass(item)">
                                        {{ getStatusLabel(item) }}
                                    </span>
                                </td>
                                <td>
                                    <router-link
                                        v-if="item.user_id"
                                        :to="{ name: 'profile', params: { id: item.user_id } }"
                                        target="_blank"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ $t('verPerfil') }}
                                    </router-link>
                                    <router-link
                                        :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                        class="btn btn-primary-blue btn-sm"
                                    >
                                        {{ $t('revisarSolicitud') }}
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div slot="no-data" class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayValidacionesManuales') }}</div>
                    </div>
                    <div slot="loading" class="text-center" style="margin-top: 20px;">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        <p>{{ $t('cargando') }}</p>
                    </div>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import adminNav from '../sections/adminNav';
import Loading from '../Loading';
import { AdminApi } from '../../services/api';

export default {
    name: 'AdminManualIdentityValidations',
    data() {
        return {
            list: null
        };
    },
    methods: {
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        getStatusLabel(item) {
            if (!item.paid) return this.$t('estadoPendientePago');
            const status = item.review_status;
            if (status === 'pending') return this.$t('estadoPendienteRevision');
            if (status === 'approved' || status === 'approve') return this.$t('estadoAprobado');
            if (status === 'rejected' || status === 'reject') return this.$t('estadoRechazado');
            return status || '-';
        },
        getStatusBadgeClass(item) {
            const status = item.review_status;
            if (status === 'approved' || status === 'approve') return 'label label-success';
            if (status === 'rejected' || status === 'reject') return 'label label-danger';
            if (!item.paid) return 'label label-default';
            return 'label label-warning';
        },
        fetchList() {
            const api = new AdminApi();
            return api.getManualIdentityValidations().then((res) => {
                const data = res.data || res;
                this.list = Array.isArray(data) ? data : (data.data || []);
            }).catch(() => {
                this.list = [];
            });
        }
    },
    mounted() {
        this.fetchList();
    },
    components: {
        adminNav,
        Loading
    }
};
</script>
