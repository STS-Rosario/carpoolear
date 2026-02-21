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
                        <p v-if="item.review_status" class="review-status-display">
                            <strong>{{ $t('revisionAdmin') }}:</strong>
                            <span :class="getStatusBadgeClass(item)">{{ getStatusLabel(item.review_status) }}</span>
                        </p>
                        <p v-if="item.review_note && item.review_note.trim()" class="review-note-display">
                            <strong>{{ $t('comentarioRevision') }}:</strong> {{ item.review_note }}
                        </p>
                        <p v-if="item.reviewed_at">
                            <strong>{{ $t('revisadoPor') }}:</strong> {{ item.reviewed_by_name || $t('na') }} {{ $t('el') }} {{ formatDate(item.reviewed_at) }}
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

                        <div v-if="!item.review_status" class="review-actions mt-3">
                            <h4>{{ $t('accion') }}</h4>
                            <div class="form-group">
                                <label>{{ $t('comentarioRevisar') }}</label>
                                <textarea v-model="reviewNote" class="form-control" rows="3" :placeholder="$t('comentarioRevisar')"></textarea>
                            </div>
                            <button
                                class="btn btn-success"
                                :disabled="submitting"
                                @click="review('approve')"
                            >
                                {{ $t('aprobar') }}
                            </button>
                            <button
                                class="btn btn-warning"
                                :disabled="!hasComment || submitting"
                                :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                @click="review('pending')"
                            >
                                {{ $t('marcarPendiente') }}
                            </button>
                            <button
                                class="btn btn-danger"
                                :disabled="!hasComment || submitting"
                                :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                @click="review('reject')"
                            >
                                {{ $t('rechazar') }}
                            </button>
                            <p v-if="reviewError" class="text-danger">{{ reviewError }}</p>
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
import dialogs from '../../services/dialogs.js';

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
            reviewNote: '',
            submitting: false,
            reviewError: null
        };
    },
    computed: {
        hasComment() {
            return this.reviewNote && this.reviewNote.trim() !== '';
        },
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
        getStatusLabel(status) {
            if (status === 'pending') return this.$t('estadoPendienteRevision');
            if (status === 'approved' || status === 'approve') return this.$t('estadoAprobado');
            if (status === 'rejected' || status === 'reject') return this.$t('estadoRechazado');
            return status || '-';
        },
        getStatusBadgeClass(item) {
            const status = item.review_status;
            if (status === 'approved' || status === 'approve') return 'label label-success';
            if (status === 'rejected' || status === 'reject') return 'label label-danger';
            return 'label label-warning';
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
        review(action) {
            if (action !== 'approve' && !this.hasComment) return;
            this.submitting = true;
            this.reviewError = null;
            const api = new AdminApi();
            const note = (this.reviewNote && this.reviewNote.trim()) || '';
            api.reviewMercadoPagoRejectedValidation(this.id, action, note)
                .then((res) => {
                    const data = res.data || res;
                    if (data.data) {
                        this.item = data.data;
                    }
                    const messageKey = action === 'approve' ? 'estadoAprobado' : action === 'reject' ? 'estadoRechazado' : 'accionMarcadoPendiente';
                    const estado = action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning';
                    dialogs.message(this.$t(messageKey), { duration: 3, estado });
                    setTimeout(() => {
                        this.$router.push({ name: 'admin-mp-rejected-validations' });
                    }, 3000);
                })
                .catch((err) => {
                    this.reviewError = (err.response && err.response.data && err.response.data.error) || this.$t('resultError');
                })
                .finally(() => {
                    this.submitting = false;
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
.review-note-display {
    word-break: break-word;
}
</style>
