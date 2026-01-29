<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <router-link :to="{ name: 'admin-mp-rejected-validations' }" class="btn btn-default btn-sm mb-2">
                    {{ $t('volver') }}
                </router-link>
                <div v-if="loading" class="text-center">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    <p>{{ $t('cargando') }}</p>
                </div>
                <div v-else-if="item" class="panel panel-default">
                    <div class="panel-heading">
                        <h3>{{ $t('detalleRechazoMp') }} #{{ item.id }}</h3>
                    </div>
                    <div class="panel-body">
                        <h4>{{ $t('datosUsuario') }}</h4>
                        <p>
                            <strong>{{ $t('estado') }}:</strong>
                            <span :class="item.user_identity_validated ? 'label label-success' : 'label label-default'">
                                {{ item.user_identity_validated ? $t('identidadValidada') : $t('identidadNoValidada') }}
                            </span>
                        </p>
                        <p><strong>{{ $t('usuario') }} ID:</strong> {{ item.user_id }}</p>
                        <p><strong>{{ $t('nombre') }}:</strong>
                            <router-link v-if="item.user_id" :to="{ name: 'profile', params: { id: item.user_id } }" target="_blank">
                                {{ item.user_name }}
                            </router-link>
                            <span v-else>{{ item.user_name || $t('na') }}</span>
                        </p>
                        <p><strong>{{ $t('doc') }}:</strong> {{ item.user_nro_doc || '-' }}</p>
                        <p><strong>{{ $t('email') }}:</strong> {{ item.user_email || '-' }}</p>
                        <p><strong>{{ $t('motivoRechazo') }}:</strong> {{ getRejectReasonLabel(item.reject_reason) }}</p>
                        <p><strong>{{ $t('fecha') }}:</strong> {{ formatDate(item.created_at) }}</p>

                        <div v-if="item.approved_at" class="alert alert-success">
                            <strong>{{ $t('validadoPor') }}:</strong> {{ item.approved_by_name || $t('na') }} {{ $t('el') }} {{ formatDate(item.approved_at) }}
                        </div>
                        <div v-else-if="!item.user_identity_validated" class="mt-3">
                            <button
                                class="btn btn-success"
                                :disabled="approving"
                                @click="approveUser"
                            >
                                {{ approving ? $t('cargando') : $t('validarUsuario') }}
                            </button>
                            <p v-if="approveError" class="text-danger mt-2">{{ approveError }}</p>
                        </div>

                        <h4 class="mt-4">{{ $t('payloadMercadoPago') }}</h4>
                        <pre class="mp-payload">{{ mpPayloadFormatted }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import adminNav from '../sections/adminNav';
import { AdminApi } from '../../services/api';

export default {
    name: 'AdminMpRejectedValidationDetail',
    props: {
        id: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            item: null,
            loading: true,
            approving: false,
            approveError: null
        };
    },
    computed: {
        mpPayloadFormatted() {
            if (!this.item || !this.item.mp_payload) return '-';
            try {
                return JSON.stringify(this.item.mp_payload, null, 2);
            } catch (e) {
                return String(this.item.mp_payload);
            }
        }
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
        fetchItem() {
            const api = new AdminApi();
            return api.getMercadoPagoRejectedValidation(this.id).then((res) => {
                const data = res.data || res;
                this.item = data.data || data;
            }).catch(() => {
                this.item = null;
            }).finally(() => {
                this.loading = false;
            });
        },
        approveUser() {
            this.approving = true;
            this.approveError = null;
            const api = new AdminApi();
            api.approveMercadoPagoRejectedValidation(this.id)
                .then((res) => {
                    const data = res.data || res;
                    if (data.data) {
                        this.item = data.data;
                    }
                })
                .catch((err) => {
                    this.approveError = (err.response && err.response.data && err.response.data.error) || this.$t('resultError');
                })
                .finally(() => {
                    this.approving = false;
                });
        }
    },
    watch: {
        id: {
            handler() {
                this.loading = true;
                this.item = null;
                this.fetchItem();
            },
            immediate: true
        }
    },
    components: {
        adminNav
    }
};
</script>

<style scoped>
.mp-payload {
    background: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
    max-height: 500px;
    overflow: auto;
    font-size: 0.9em;
}
.mt-4 { margin-top: 1.5em; }
</style>
