<template>
    <div class="manual-identity-validation-component">
        <div v-if="config && !identityValidationManualEnabled" class="alert alert-info">
            {{ $t('validacionManualNoDisponible') }}
            <router-link :to="{ name: 'identity_validation' }" class="btn btn-default btn-sm">{{ $t('volver') }}</router-link>
        </div>
        <template v-else>
        <div class="alert alert-info">
            {{ $t('validacionManualDescripcion') }}
        </div>

        <div v-if="statusPaidAt || statusSubmittedAt" class="panel panel-default status-dates-panel">
            <div class="panel-body">
                <p v-if="statusPaidAt"><strong>{{ $t('pagadoEl') }}:</strong> {{ formatDate(statusPaidAt) }}</p>
                <p v-if="statusSubmittedAt"><strong>{{ $t('enviadoEl') }}:</strong> {{ formatDate(statusSubmittedAt) }}</p>
            </div>
        </div>

        <div v-if="alreadySubmitted" class="panel panel-info">
            <div class="panel-body">
                <p>{{ $t('documentacionEnviada') }}</p>
                <router-link :to="{ name: 'identity_validation' }" class="btn btn-default">{{ $t('verEstadoValidacion') }}</router-link>
            </div>
        </div>

        <div v-else-if="!canUpload" class="pay-section">
            <div v-if="unpaidPending" class="alert alert-warning unpaid-alert">
                <strong>{{ $t('esperandoPagoValidacionManual') }}</strong>
                <p>{{ $t('debesPagarParaContinuar') }}</p>
            </div>
            <p><strong>{{ $t('costoValidacionManual') }}:</strong> {{ formattedCost }}</p>
            <div class="pay-buttons">
                <button
                    class="btn btn-primary btn-lg"
                    :disabled="loadingPreference || loadingQr || costCents <= 0"
                    @click="createPreferenceAndRedirect"
                >
                    <span v-if="loadingPreference">{{ $t('guardando') }}</span>
                    <span v-else>{{ unpaidPending ? $t('pagarAhora') : $t('pagarYContinuar') }}</span>
                </button>
                <button
                    v-if="identityValidationManualQrEnabled"
                    class="btn btn-default btn-lg pay-qr-btn"
                    :disabled="loadingPreference || loadingQr || costCents <= 0"
                    @click="createQrOrderAndShow"
                >
                    <span v-if="loadingQr">{{ $t('guardando') }}</span>
                    <span v-else>{{ $t('pagarConQR') }}</span>
                </button>
            </div>
            <!-- QR payment: show QR and poll until paid -->
            <div v-if="showQrPanel" class="qr-payment-panel panel panel-default">
                <div class="panel-body text-center">
                    <p class="qr-instruction">{{ $t('escaneáConAppMercadoPago') }}</p>
                    <div v-if="qrImageUrl" class="qr-image-wrap">
                        <img :src="qrImageUrl" alt="QR" class="qr-image" />
                    </div>
                    <p v-else class="text-muted">{{ $t('cargando') }}...</p>
                    <p class="qr-expiry text-muted small">{{ $t('qrExpiraEn') }}</p>
                    <button class="btn btn-default btn-sm mt-2" @click="closeQrPanel">{{ $t('cerrar') }}</button>
                </div>
            </div>
            <p v-if="costCents <= 0" class="text-muted small">{{ $t('validacionManualNoDisponible') }}</p>
        </div>

        <div v-else class="upload-section">
            <div class="alert alert-warning">
                <strong>{{ $t('advertenciaCalidadFotos') }}</strong>
            </div>

            <form @submit.prevent="submitImages">
                <div class="form-group">
                    <label>{{ $t('subirFrenteDocumento') }} <span class="required">*</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        ref="frontInput"
                        @change="onFileChange($event, 'front')"
                        required
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label>{{ $t('subirDorsoDocumento') }} <span class="required">*</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        ref="backInput"
                        @change="onFileChange($event, 'back')"
                        required
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label>{{ $t('subirSelfieDocumento') }} <span class="required">*</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        ref="selfieInput"
                        @change="onFileChange($event, 'selfie')"
                        required
                        class="form-control"
                    />
                </div>
                <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="submitting || !requestId"
                >
                    <span v-if="submitting">{{ $t('guardando') }}</span>
                    <span v-else>{{ $t('enviarDocumentacion') }}</span>
                </button>
                <p v-if="submitError" class="text-danger">{{ submitError }}</p>
            </form>
        </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserApi } from '../../services/api';
import QRCode from 'qrcode';

export default {
    name: 'ManualIdentityValidation',
    data() {
        return {
            costCents: 0,
            requestId: null,
            paymentSuccess: false,
            unpaidPending: false,
            statusPaidAt: null,
            statusSubmittedAt: null,
            loadingPreference: false,
            loadingQr: false,
            submitting: false,
            submitError: null,
            showQrPanel: false,
            qrImageUrl: null,
            qrData: null,
            pollIntervalId: null,
            files: {
                front: null,
                back: null,
                selfie: null
            }
        };
    },
    computed: {
        ...mapGetters({
            config: 'auth/appConfig'
        }),
        identityValidationManualEnabled() {
            return this.config && this.config.identity_validation_manual_enabled === true;
        },
        identityValidationManualQrEnabled() {
            return this.config && this.config.identity_validation_manual_qr_enabled === true;
        },
        canUpload() {
            return this.requestId && this.paymentSuccess;
        },
        alreadySubmitted() {
            return this.statusSubmittedAt != null;
        },
        formattedCost() {
            if (this.costCents <= 0) return '-';
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(this.costCents / 100);
        }
    },
    methods: {
        parseQuery() {
            const q = this.$route.query;
            this.requestId = q.request_id ? parseInt(q.request_id, 10) : null;
            this.paymentSuccess = q.payment_success === '1' || q.payment_success === 'true';
        },
        fetchStatus() {
            const userApi = new UserApi();
            return userApi.getManualIdentityValidationStatus()
                .then((res) => {
                    const data = res.data || res;
                    this.statusPaidAt = data.paid_at || null;
                    this.statusSubmittedAt = data.submitted_at || null;
                    if (data.has_submission && data.paid === false) {
                        this.unpaidPending = true;
                        if (data.request_id && !this.requestId) {
                            this.requestId = data.request_id;
                        }
                    }
                    if (data.has_submission && data.paid === true && data.request_id && !data.submitted_at) {
                        this.requestId = data.request_id;
                        this.paymentSuccess = true;
                    }
                })
                .catch(() => {});
        },
        formatDate(value) {
            if (!value) return '';
            const d = new Date(value);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        fetchCost() {
            const userApi = new UserApi();
            return userApi.getManualIdentityValidationCost()
                .then((res) => {
                    this.costCents = (res.data && res.data.cost_cents) || res.cost_cents || 0;
                });
        },
        createPreferenceAndRedirect() {
            this.loadingPreference = true;
            this.submitError = null;
            const userApi = new UserApi();
            userApi.createManualIdentityValidationPreference()
                .then((res) => {
                    const data = res.data || res;
                    const initPoint = data.init_point;
                    if (initPoint) {
                        window.location.href = initPoint;
                    } else {
                        this.loadingPreference = false;
                    }
                })
                .catch(() => {
                    this.loadingPreference = false;
                });
        },
        createQrOrderAndShow() {
            this.loadingQr = true;
            this.submitError = null;
            const userApi = new UserApi();
            userApi.createManualIdentityValidationQrOrder()
                .then((res) => {
                    const data = res.data || res;
                    const qrData = data.qr_data;
                    const requestId = data.request_id;
                    if (qrData && requestId) {
                        this.requestId = requestId;
                        this.qrData = qrData;
                        this.showQrPanel = true;
                        this.qrImageUrl = null;
                        QRCode.toDataURL(qrData, { width: 256, margin: 2 }, (err, url) => {
                            if (!err) this.qrImageUrl = url;
                        });
                        this.startPollingStatus();
                    }
                    this.loadingQr = false;
                })
                .catch(() => {
                    this.loadingQr = false;
                });
        },
        closeQrPanel() {
            this.showQrPanel = false;
            this.qrData = null;
            this.qrImageUrl = null;
            this.stopPollingStatus();
        },
        startPollingStatus() {
            this.stopPollingStatus();
            this.pollIntervalId = setInterval(() => {
                this.fetchStatus().then(() => {
                    if (this.paymentSuccess) {
                        this.closeQrPanel();
                    }
                });
            }, 3000);
        },
        stopPollingStatus() {
            if (this.pollIntervalId) {
                clearInterval(this.pollIntervalId);
                this.pollIntervalId = null;
            }
        },
        onFileChange(event, type) {
            const file = event.target.files && event.target.files[0];
            this.files[type] = file || null;
        },
        submitImages() {
            if (!this.requestId || !this.files.front || !this.files.back || !this.files.selfie) {
                this.submitError = this.$t('todosLosArchivosRequeridos');
                return;
            }
            this.submitting = true;
            this.submitError = null;
            const formData = new FormData();
            formData.append('request_id', this.requestId);
            formData.append('front_image', this.files.front);
            formData.append('back_image', this.files.back);
            formData.append('selfie_image', this.files.selfie);

            const userApi = new UserApi();
            userApi.submitManualIdentityValidation(this.requestId, formData)
                .then(() => {
                    this.$router.push({ name: 'identity_validation', query: { result: 'manual_submitted' } });
                })
                .catch((err) => {
                    this.submitting = false;
                    const msg = (err.response && err.response.data && (err.response.data.message || err.response.data.error)) || this.$t('resultError');
                    this.submitError = typeof msg === 'string' ? msg : this.$t('resultError');
                });
        }
    },
    watch: {
        '$route.query': {
            handler() {
                this.parseQuery();
            },
            immediate: true
        }
    },
    mounted() {
        this.parseQuery();
        this.fetchCost();
        this.fetchStatus();
    },
    beforeDestroy() {
        this.stopPollingStatus();
    }
};
</script>

<style scoped>
.manual-identity-validation-component {
    padding: 0 0 1em 0;
}
.status-dates-panel {
    margin-top: 1em;
}
.pay-section,
.upload-section {
    margin-top: 1em;
}
.pay-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    align-items: center;
}
.pay-qr-btn {
    margin-left: 0;
}
.qr-payment-panel {
    margin-top: 1em;
}
.qr-image-wrap {
    margin: 1em 0;
}
.qr-image {
    max-width: 256px;
    height: auto;
}
.qr-instruction {
    font-weight: bold;
}
.qr-expiry {
    margin-top: 0.5em;
}
.required {
    color: #c00;
}
</style>
