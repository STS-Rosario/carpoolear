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
                                <th scope="col">{{ $t('tiempoDeEspera') }}</th>
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
                                <td>{{ formatWaitingTime(item) }}</td>
                                <td>{{ item.paid ? $t('si') : $t('no') }}</td>
                                <td>
                                    <span :class="getStatusBadgeClass(item)">
                                        {{ getStatusLabel(item) }}
                                    </span>
                                    <span
                                        v-if="isApprovedWithImagesPending(item)"
                                        class="label label-danger pending-images-pill"
                                        :title="$t('faltaBorrarImagenes')"
                                    >
                                        {{ $t('faltaBorrarImagenes') }}
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
                    <template #no-data><div class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayValidacionesManuales') }}</div>
                    </div></template>
                    <template #loading><div class="text-center" style="margin-top: 20px;">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        <p>{{ $t('cargando') }}</p>
                    </div></template>
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
        formatWaitingTime(item) {
            const submitted = item.submitted_at ? new Date(item.submitted_at).getTime() : null;
            if (!submitted) return '-';
            const end = item.manual_validation_started_at
                ? new Date(item.manual_validation_started_at).getTime()
                : Date.now();
            let diffMs = Math.max(0, end - submitted);
            const days = Math.floor(diffMs / 86400000);
            diffMs %= 86400000;
            const hours = Math.floor(diffMs / 3600000);
            diffMs %= 3600000;
            const minutes = Math.floor(diffMs / 60000);
            const parts = [];
            if (days > 0) parts.push(`${days} ${this.$t('tiempoEsperaDias')}`);
            if (hours > 0) parts.push(`${hours} ${this.$t('tiempoEsperaHoras')}`);
            parts.push(`${minutes} ${this.$t('tiempoEsperaMinutos')}`);
            return parts.join(' ');
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
        isApprovedWithImagesPending(item) {
            const status = item.review_status;
            const approved = status === 'approved' || status === 'approve';
            return approved && item.has_images === true;
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
<style scoped>
.pending-images-pill {
    margin-left: 6px;
}
</style>
