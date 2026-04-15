<template>
    <div class="manual-identity-validation-component">
        <div v-if="config && !identityValidationManualEnabled" class="alert alert-info">
            {{ $t('validacionManualNoDisponible') }}
            <router-link :to="{ name: 'identity_validation' }" class="btn btn-default btn-sm">{{ $t('volver') }}</router-link>
        </div>
        <template v-else>
            <div
                v-if="(statusPaidAt || statusSubmittedAt) && !(canUpload && !alreadySubmitted)"
                class="panel panel-default status-dates-panel"
            >
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

            <div v-else-if="!canUpload" class="manual-validation-pay">
                <div class="manual-validation-main">
                    <h1 class="manual-validation-title visible-xs-block">{{ $t('validacionManual') }}</h1>

                    <div v-if="unpaidPending" class="alert alert-warning manual-validation-unpaid-alert">
                        <strong>{{ $t('esperandoPagoValidacionManual') }}</strong>
                        <p>{{ $t('debesPagarParaContinuar') }}</p>
                    </div>

                    <p class="manual-validation-text">
                        {{ $t('manualValidationPayIntro1', { cost: formattedCostDisplay }) }}
                    </p>
                    <p class="manual-validation-text">{{ $t('manualValidationPayIntro2') }}</p>
                    <p class="manual-validation-text manual-validation-list-lead">
                        {{ $t('manualValidationPayListLead') }}
                    </p>
                    <ul class="manual-validation-bullets">
                        <li>{{ $t('manualValidationPayBulletDni') }}</li>
                    </ul>
                    <p class="manual-validation-text manual-validation-closing">
                        {{ $t('manualValidationPayClosing') }}
                    </p>

                    <div class="manual-validation-pay-buttons">
                        <button
                            type="button"
                            class="btn btn-danger btn-lg btn-block manual-validation-btn-mp"
                            :disabled="loadingPreference || loadingQr || costCents <= 0"
                            @click="createPreferenceAndRedirect"
                        >
                            <span v-if="loadingPreference">{{ $t('guardando') }}</span>
                            <span v-else>{{ $t('manualValidationPagarMercadoPago') }}</span>
                        </button>
                        <button
                            v-if="identityValidationManualQrEnabled"
                            type="button"
                            class="btn btn-lg btn-block manual-validation-btn-outline"
                            :disabled="loadingPreference || loadingQr || costCents <= 0"
                            @click="createQrOrderAndShow"
                        >
                            <span v-if="loadingQr">{{ $t('guardando') }}</span>
                            <span v-else>{{ $t('pagarConQR') }}</span>
                        </button>
                    </div>

                    <p v-if="costCents <= 0" class="manual-validation-text small manual-validation-cost-unavailable">
                        {{ $t('validacionManualNoDisponible') }}
                    </p>

                    <div v-if="showQrPanel" class="qr-payment-panel panel panel-default">
                        <div class="panel-body text-center">
                            <p class="qr-instruction">{{ $t('escaneáConAppMercadoPago') }}</p>
                            <div v-if="qrImageUrl" class="qr-image-wrap">
                                <img :src="qrImageUrl" alt="QR" class="qr-image" />
                            </div>
                            <p v-else class="manual-validation-text">{{ $t('cargando') }}...</p>
                            <p class="qr-expiry small">{{ $t('qrExpiraEn') }}</p>
                            <button type="button" class="btn btn-default btn-sm manual-validation-qr-close" @click="closeQrPanel">
                                {{ $t('cerrar') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="upload-section manual-validation-upload">
                <div class="manual-validation-main">
                    <router-link
                        :to="{ name: 'identity_validation' }"
                        class="manual-validation-back-desktop hidden-xs"
                    >
                        ← {{ $t('manualValidationVolverOpcionesDesktop') }}
                    </router-link>
                    <h1 class="manual-validation-title visible-xs-block">{{ $t('validacionManual') }}</h1>

                    <div
                        v-if="statusPaidAt || paymentSuccess"
                        class="manual-validation-pay-success"
                    >
                        <img
                            :src="checkCircleIconSrc"
                            alt=""
                            class="manual-validation-success-icon"
                        />
                        <span class="manual-validation-success-copy">
                            <span class="manual-validation-success-title">{{
                                $t('manualValidationPagoProcesado')
                            }}</span>
                            <span v-if="statusPaidAt" class="manual-validation-success-date">{{
                                formatDate(statusPaidAt)
                            }}</span>
                        </span>
                    </div>

                    <p class="manual-validation-text">{{ $t('manualValidationUploadIntro') }}</p>
                    <ul class="manual-validation-bullets manual-validation-upload-photo-list">
                        <li>{{ $t('manualValidationUploadBulletFrente') }}</li>
                        <li>{{ $t('manualValidationUploadBulletDorso') }}</li>
                        <li>{{ $t('manualValidationUploadBulletFotoConDni') }}</li>
                    </ul>

                    <p class="manual-validation-subheading">{{ $t('manualValidationUploadRequisitos') }}</p>
                    <ul class="manual-validation-bullets manual-validation-upload-req-list">
                        <li>{{ $t('manualValidationUploadReqClaras') }}</li>
                        <li>{{ $t('manualValidationUploadReqFormatos') }}</li>
                        <li>
                            {{
                                $t('manualValidationUploadReqTamano', {
                                    maxMb: manualValidationMaxFileMb
                                })
                            }}
                        </li>
                    </ul>

                    <p class="manual-validation-disclaimer">
                        {{ $t('manualValidationUploadDisclaimer') }}
                    </p>

                    <form class="manual-validation-upload-form" @submit.prevent="submitImages">
                        <div class="form-group">
                            <label class="manual-validation-field-label">
                                {{ $t('manualValidationUploadLabelFront') }}
                                <span class="required">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                ref="frontInput"
                                @change="onFileChange($event, 'front')"
                                required
                                class="form-control"
                            />
                        </div>
                        <div class="form-group">
                            <label class="manual-validation-field-label">
                                {{ $t('manualValidationUploadLabelBack') }}
                                <span class="required">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                ref="backInput"
                                @change="onFileChange($event, 'back')"
                                required
                                class="form-control"
                            />
                        </div>
                        <div class="form-group">
                            <label class="manual-validation-field-label">
                                {{ $t('manualValidationUploadLabelSelfie') }}
                                <span class="required">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                ref="selfieInput"
                                @change="onFileChange($event, 'selfie')"
                                required
                                class="form-control"
                            />
                        </div>
                        <button
                            type="submit"
                            class="btn btn-danger btn-lg manual-validation-upload-submit"
                            :disabled="submitting || !requestId"
                        >
                            <span v-if="submitting">{{ $t('guardando') }}</span>
                            <span v-else>{{ $t('enviarDocumentacion') }}</span>
                        </button>
                        <p v-if="submitError" class="manual-validation-submit-error">{{ submitError }}</p>
                    </form>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
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
        ...mapState(useAuthStore, {
            config: 'appConfig'
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
        formattedCostDisplay() {
            if (this.costCents <= 0) return '—';
            const loc = this.$i18n.locale === 'en' ? 'en-US' : 'es-AR';
            return new Intl.NumberFormat(loc, {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(this.costCents / 100);
        },
        manualValidationMaxFileMb() {
            const c = this.config;
            const n = c && c.manual_identity_validation_max_upload_mb;
            if (n != null && Number(n) > 0) {
                return Number(n);
            }
            return 10;
        },
        checkCircleIconSrc() {
            const base = process.env.ROUTE_BASE || '/';
            return `${base}static/img/check-circle.png`;
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
    beforeUnmount() {
        this.stopPollingStatus();
    }
};
</script>

<style scoped>
.manual-identity-validation-component {
    margin-top: 4rem;
    padding: 0 0 1em 0;
    color: #333;
}

.manual-identity-validation-component .btn-primary,
.manual-identity-validation-component .btn-danger {
    color: #fff;
}

.manual-identity-validation-component .btn-primary[disabled],
.manual-identity-validation-component .btn-danger[disabled] {
    color: #fff;
    opacity: 0.65;
}

.manual-identity-validation-component .manual-validation-btn-outline {
    color: #337ab7;
}

.manual-identity-validation-component .manual-validation-btn-outline:hover,
.manual-identity-validation-component .manual-validation-btn-outline:focus {
    color: #286090;
}

.manual-identity-validation-component .alert {
    color: #333;
}

.status-dates-panel {
    margin-top: 1em;
}

.manual-validation-upload {
    margin-top: 1em;
}

.manual-validation-main {
    padding: 0 0 0.5rem;
}

@media (min-width: 768px) {
    .manual-validation-main {
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        padding: 1.75rem 2rem 2rem;
    }
}

.manual-validation-back-desktop {
    display: inline-block;
    margin-bottom: 1rem;
    color: #337ab7;
}

.manual-validation-back-desktop:hover,
.manual-validation-back-desktop:focus {
    color: #286090;
}

.manual-validation-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

.manual-validation-pay-success {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin: 0 0 1.25rem;
}

.manual-validation-success-icon {
    width: 1.85rem;
    height: 1.85rem;
    object-fit: contain;
    flex-shrink: 0;
    display: block;
}

.manual-validation-success-copy {
    line-height: 1.4;
    color: #333;
}

.manual-validation-success-title {
    font-weight: 600;
    margin-right: 0.35rem;
    font-size: 1.125rem;
}

.manual-validation-success-date {
    font-weight: 400;
    font-size: 1rem;
}

.manual-validation-subheading {
    font-weight: 700;
    margin: 1rem 0 0.4rem;
    color: #333;
    font-size: 1rem;
}

.manual-validation-upload-photo-list {
    margin-bottom: 1rem;
}

.manual-validation-upload-req-list {
    margin-bottom: 1rem;
}

.manual-validation-disclaimer {
    margin: 0 0 1.25rem;
    line-height: 1.5;
    color: #333;
    font-size: 0.9rem;
}

.manual-validation-field-label {
    color: #337ab7;
    font-weight: 600;
}

.manual-validation-upload-form .form-group {
    margin-bottom: 1.1rem;
}

.manual-validation-upload-submit {
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 4px;
    font-size: 1.0625rem;
    margin-top: 0.25rem;
}

.manual-validation-unpaid-alert {
    margin-bottom: 1rem;
}

.manual-validation-unpaid-alert strong {
    font-size: 1.25rem;
    line-height: 1.35;
    display: block;
    margin-bottom: 0.35rem;
}

.manual-validation-text {
    margin: 0 0 0.75rem;
    line-height: 1.5;
    color: #333;
}

.manual-validation-list-lead {
    margin-bottom: 0.35rem;
}

.manual-validation-closing {
    margin-bottom: 1.25rem;
}

.manual-identity-validation-component .manual-validation-bullets {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
    margin: 0 0 1rem;
    margin-left: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
}

.manual-identity-validation-component .manual-validation-bullets li {
    display: list-item;
    margin-bottom: 0.35rem;
}

.manual-validation-pay-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.25rem;
}

.manual-validation-btn-mp {
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 4px;
    font-size: 1rem;
}

.manual-validation-btn-outline {
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 4px;
    font-size: 1rem;
    background: #fff;
    border: 2px solid #337ab7;
    color: #337ab7;
}

.manual-validation-btn-outline:hover,
.manual-validation-btn-outline:focus {
    background: #f5f9fc;
    border-color: #286090;
    color: #286090;
}

.manual-validation-cost-unavailable {
    margin-top: 0.75rem;
}

.qr-payment-panel {
    margin-top: 1.25rem;
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
    color: #333;
}

.qr-expiry {
    margin-top: 0.5em;
    color: #333;
}

.manual-validation-qr-close {
    margin-top: 0.75rem;
}

.required {
    color: #c00;
}

.manual-validation-submit-error {
    margin-top: 0.75rem;
    color: #c00;
}
</style>
