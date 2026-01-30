<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('rechazosMercadoPago') }}</h2>
                <Loading :data="list">
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
                                <td>{{ item.user_nro_doc || '-' }}</td>
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
                                        :to="{ name: 'profile', params: { id: item.user_id } }"
                                        target="_blank"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ $t('verPerfil') }}
                                    </router-link>
                                    <router-link
                                        :to="{ name: 'admin-mp-rejected-validation-detail', params: { id: item.id } }"
                                        class="btn btn-primary-blue btn-sm"
                                    >
                                        {{ $t('verDetalle') }}
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div slot="no-data" class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayRechazosMp') }}</div>
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
    name: 'AdminMpRejectedValidations',
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
        getRejectReasonLabel(reason) {
            if (reason === 'dni_mismatch') return this.$t('rechazoDniMismatch');
            if (reason === 'name_mismatch') return this.$t('rechazoNameMismatch');
            return reason || '-';
        },
        fetchList() {
            const api = new AdminApi();
            return api.getMercadoPagoRejectedValidations().then((res) => {
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
