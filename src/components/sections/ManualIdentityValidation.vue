<template>
    <div class="manual-identity-validation-component">
        <div v-if="config && !identityValidationManualEnabled" class="alert alert-info">
            {{ $t('validacionManualNoDisponible') }}
            <AppButton
                variant="secondary"
                size="sm"
                :to="{ name: 'identity_validation' }"
            >
                {{ $t('volver') }}
            </AppButton>
        </div>
        <template v-else>
            <div
                v-if="showStatusDatesPanel"
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
                    <AppButton
                        variant="secondary"
                        :to="{ name: 'identity_validation' }"
                    >
                        {{ $t('verEstadoValidacion') }}
                    </AppButton>
                </div>
            </div>

            <div v-else-if="!canUpload" class="manual-validation-pay">
                <div class="manual-validation-main">
                    <div v-if="unpaidPending" class="alert alert-warning manual-validation-unpaid-alert">
                        <strong>{{ $t('esperandoPagoValidacionManual') }}</strong>
                        <p>{{ $t('debesPagarParaContinuar') }}</p>
                    </div>

                    <ManualIdentityValidationPayOptions
                        :cost-display="formattedCostDisplay"
                        :qr-enabled="identityValidationManualQrEnabled"
                        :loading-preference="loadingPreference"
                        :loading-qr="loadingQr"
                        :show-qr-panel="showQrPanel"
                        :qr-image-url="qrImageUrl"
                        :cost-unavailable="costCents <= 0"
                        @pay-mp="createPreferenceAndRedirect"
                        @pay-qr="createQrOrderAndShow"
                        @close-qr="closeQrPanel"
                    >
                        <template v-if="showSwitchToMercadoPagoLink">
                            <hr class="manual-validation-switch-mode-separator" />
                            <p class="manual-validation-switch-mode-link">
                                <router-link :to="switchToMercadoPagoRoute">
                                    {{ $t('manualValidationSwitchToMercadoPago') }}
                                </router-link>
                            </p>
                        </template>
                    </ManualIdentityValidationPayOptions>
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
                        <AppField class="manual-validation-upload-field">
                            <template #label>
                                {{ $t('manualValidationUploadLabelFront') }}
                                <span class="required">*</span>
                            </template>
                            <input
                                type="file"
                                class="manual-validation__file"
                                :accept="imageUploadAccept"
                                ref="frontInput"
                                required
                                @change="onFileChange($event, 'front')"
                            />
                        </AppField>
                        <AppField class="manual-validation-upload-field">
                            <template #label>
                                {{ $t('manualValidationUploadLabelBack') }}
                                <span class="required">*</span>
                            </template>
                            <input
                                type="file"
                                class="manual-validation__file"
                                :accept="imageUploadAccept"
                                ref="backInput"
                                required
                                @change="onFileChange($event, 'back')"
                            />
                        </AppField>
                        <AppField class="manual-validation-upload-field">
                            <template #label>
                                {{ $t('manualValidationUploadLabelSelfie') }}
                                <span class="required">*</span>
                            </template>
                            <input
                                type="file"
                                class="manual-validation__file"
                                :accept="imageUploadAccept"
                                ref="selfieInput"
                                required
                                @change="onFileChange($event, 'selfie')"
                            />
                        </AppField>
                        <AppButton
                            type="submit"
                            variant="primary"
                            size="lg"
                            class="manual-validation-upload-submit"
                            :disabled="submitting || !requestId"
                            :loading="submitting"
                        >
                            {{ $t('enviarDocumentacion') }}
                        </AppButton>
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
import {
    shouldShowSwitchToMercadoPago,
    SWITCH_TO_MERCADO_PAGO_ROUTE
} from '../../utils/identityValidationModeSwitch';
import {
    IMAGE_UPLOAD_ACCEPT,
    getImageUploadMaxMb
} from '../../utils/imageUpload';
import { applyImageUploadSelection } from '../../utils/imageUploadSelection';
import { compressImageFilesForUpload } from '../../utils/imageUploadCompress';
import {
    shouldShowManualValidationAlreadySubmitted,
    shouldShowManualValidationPayAgain
} from '../../utils/manualIdentityValidationStatus';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import ManualIdentityValidationPayOptions from './ManualIdentityValidationPayOptions.vue';

export default {
    name: 'ManualIdentityValidation',
    components: {
        AppButton,
        AppField,
        ManualIdentityValidationPayOptions
    },
    data() {
        return {
            costCents: 0,
            requestId: null,
            paymentSuccess: false,
            unpaidPending: false,
            statusPaidAt: null,
            statusSubmittedAt: null,
            reviewStatus: null,
            forcePaymentRestart: false,
            loadingPreference: false,
            loadingQr: false,
            submitting: false,
            submitError: null,
            showQrPanel: false,
            qrImageUrl: null,
            qrData: null,
            pollIntervalId: null,
            canResubmitWithoutPayment: false,
            files: {
                front: null,
                back: null,
                selfie: null
            },
            imageUploadAccept: IMAGE_UPLOAD_ACCEPT
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
        showSwitchToMercadoPagoLink() {
            return shouldShowSwitchToMercadoPago(this.config);
        },
        switchToMercadoPagoRoute() {
            return SWITCH_TO_MERCADO_PAGO_ROUTE;
        },
        canUpload() {
            return this.requestId && (this.paymentSuccess || this.canResubmitWithoutPayment);
        },
        manualStatusSnapshot() {
            return {
                submitted_at: this.statusSubmittedAt,
                review_status: this.reviewStatus,
                can_resubmit_without_payment: this.canResubmitWithoutPayment
            };
        },
        alreadySubmitted() {
            if (this.forcePaymentRestart) {
                return false;
            }
            return shouldShowManualValidationAlreadySubmitted(this.manualStatusSnapshot);
        },
        showStatusDatesPanel() {
            if (this.forcePaymentRestart) {
                return false;
            }
            if (shouldShowManualValidationPayAgain(this.manualStatusSnapshot)) {
                return false;
            }
            return (this.statusPaidAt || this.statusSubmittedAt) && !(this.canUpload && !this.alreadySubmitted);
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
            return getImageUploadMaxMb(this.config);
        },
        checkCircleIconSrc() {
            const base = process.env.ROUTE_BASE || '/';
            return `${base}img/check-circle.png`;
        }
    },
    methods: {
        parseQuery() {
            const q = this.$route.query;
            this.requestId = q.request_id ? parseInt(q.request_id, 10) : null;
            this.paymentSuccess = q.payment_success === '1' || q.payment_success === 'true';
            if (q.resubmit === '1' || q.resubmit === 'true') {
                this.canResubmitWithoutPayment = true;
                this.paymentSuccess = true;
            }
            if (q.restart === '1' || q.restart === 'true') {
                this.forcePaymentRestart = true;
                this.requestId = null;
                this.paymentSuccess = false;
                this.canResubmitWithoutPayment = false;
            }
        },
        fetchStatus() {
            const userApi = new UserApi();
            return userApi.getManualIdentityValidationStatus()
                .then((res) => {
                    const data = res.data || res;
                    this.statusPaidAt = data.paid_at || null;
                    this.statusSubmittedAt = data.submitted_at || null;
                    this.reviewStatus = data.review_status || null;
                    this.canResubmitWithoutPayment = data.can_resubmit_without_payment === true;
                    if (this.forcePaymentRestart && shouldShowManualValidationPayAgain(data)) {
                        this.requestId = null;
                        this.paymentSuccess = false;
                        this.unpaidPending = data.has_submission && data.paid === false;
                        if (this.unpaidPending && data.request_id) {
                            this.requestId = data.request_id;
                        }
                        return;
                    }
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
                    if (data.can_resubmit_without_payment && data.request_id) {
                        this.requestId = data.request_id;
                        this.paymentSuccess = true;
                        this.statusSubmittedAt = null;
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
            const fieldLabels = {
                front: this.$t('manualValidationUploadLabelFront'),
                back: this.$t('manualValidationUploadLabelBack'),
                selfie: this.$t('manualValidationUploadLabelSelfie')
            };
            const { files, rejected } = applyImageUploadSelection(
                this,
                event,
                event.target.files || [],
                {
                    limit: 1,
                    config: this.config,
                    getDisplayName: () => fieldLabels[type] || type
                }
            );
            this.files[type] = rejected ? null : (files[0] || null);
        },
        async submitImages() {
            if (!this.requestId || !this.files.front || !this.files.back || !this.files.selfie) {
                this.submitError = this.$t('todosLosArchivosRequeridos');
                return;
            }
            this.submitting = true;
            this.submitError = null;

            try {
                const [front, back, selfie] = await compressImageFilesForUpload(
                    [this.files.front, this.files.back, this.files.selfie],
                    this.config
                );

                const formData = new FormData();
                formData.append('request_id', this.requestId);
                formData.append('front_image', front);
                formData.append('back_image', back);
                formData.append('selfie_image', selfie);

                const userApi = new UserApi();
                await userApi.submitManualIdentityValidation(this.requestId, formData);
                this.$router.push({ name: 'identity_validation', query: { result: 'manual_submitted' } });
            } catch (err) {
                this.submitting = false;
                const responseData = (err && err.data) || (err.response && err.response.data) || {};
                const msg = responseData.message || responseData.error || err.message || this.$t('resultError');
                this.submitError = typeof msg === 'string' ? msg : this.$t('resultError');
            }
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
    padding: 0 0 1em 0;
    color: #333;
}
@media only screen and (max-width: 768px) {
    .manual-identity-validation-component {
        padding: 1em;
    }
}

.manual-identity-validation-component .alert {
    color: #333;
}

.status-dates-panel {
    margin-top: 1em;
}

.manual-validation-switch-mode-link {
    margin: 0 0 1rem;
    text-align: center;
}

.manual-validation-switch-mode-separator {
    margin: 1rem 0;
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

.manual-validation-upload-field :deep(.app-field__control-wrap) {
    border: 0;
    box-shadow: none;
    background: transparent;
}

.manual-validation__file {
    width: 100%;
    font-size: var(--ds-input-font-size, 1rem);
    color: var(--ds-input-text, #22211f);
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

.required {
    color: #c00;
}

.manual-validation-submit-error {
    margin-top: 0.75rem;
    color: #c00;
}
</style>
