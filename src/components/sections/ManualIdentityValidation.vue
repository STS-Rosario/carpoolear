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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { UserApi } from '../../services/api';
import QRCode from 'qrcode';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

const config = computed(() => authStore.appConfig);

const costCents = ref(0);
const requestId = ref(null);
const paymentSuccess = ref(false);
const unpaidPending = ref(false);
const statusPaidAt = ref(null);
const statusSubmittedAt = ref(null);
const loadingPreference = ref(false);
const loadingQr = ref(false);
const submitting = ref(false);
const submitError = ref(null);
const showQrPanel = ref(false);
const qrImageUrl = ref(null);
const qrData = ref(null);
const pollIntervalId = ref(null);
const files = ref({ front: null, back: null, selfie: null });

const identityValidationManualEnabled = computed(() => {
    return config.value && config.value.identity_validation_manual_enabled === true;
});
const identityValidationManualQrEnabled = computed(() => {
    return config.value && config.value.identity_validation_manual_qr_enabled === true;
});
const canUpload = computed(() => {
    return requestId.value && paymentSuccess.value;
});
const alreadySubmitted = computed(() => {
    return statusSubmittedAt.value != null;
});
const formattedCost = computed(() => {
    if (costCents.value <= 0) return '-';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(costCents.value / 100);
});

function parseQuery() {
    const q = route.query;
    requestId.value = q.request_id ? parseInt(q.request_id, 10) : null;
    paymentSuccess.value = q.payment_success === '1' || q.payment_success === 'true';
}

function fetchStatus() {
    const userApi = new UserApi();
    return userApi.getManualIdentityValidationStatus()
        .then((res) => {
            const data = res.data || res;
            statusPaidAt.value = data.paid_at || null;
            statusSubmittedAt.value = data.submitted_at || null;
            if (data.has_submission && data.paid === false) {
                unpaidPending.value = true;
                if (data.request_id && !requestId.value) {
                    requestId.value = data.request_id;
                }
            }
            if (data.has_submission && data.paid === true && data.request_id && !data.submitted_at) {
                requestId.value = data.request_id;
                paymentSuccess.value = true;
            }
        })
        .catch(() => {});
}

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchCost() {
    const userApi = new UserApi();
    return userApi.getManualIdentityValidationCost()
        .then((res) => {
            costCents.value = (res.data && res.data.cost_cents) || res.cost_cents || 0;
        });
}

function createPreferenceAndRedirect() {
    loadingPreference.value = true;
    submitError.value = null;
    const userApi = new UserApi();
    userApi.createManualIdentityValidationPreference()
        .then((res) => {
            const data = res.data || res;
            const initPoint = data.init_point;
            if (initPoint) {
                window.location.href = initPoint;
            } else {
                loadingPreference.value = false;
            }
        })
        .catch(() => {
            loadingPreference.value = false;
        });
}

function stopPollingStatus() {
    if (pollIntervalId.value) {
        clearInterval(pollIntervalId.value);
        pollIntervalId.value = null;
    }
}

function closeQrPanel() {
    showQrPanel.value = false;
    qrData.value = null;
    qrImageUrl.value = null;
    stopPollingStatus();
}

function startPollingStatus() {
    stopPollingStatus();
    pollIntervalId.value = setInterval(() => {
        fetchStatus().then(() => {
            if (paymentSuccess.value) {
                closeQrPanel();
            }
        });
    }, 3000);
}

function createQrOrderAndShow() {
    loadingQr.value = true;
    submitError.value = null;
    const userApi = new UserApi();
    userApi.createManualIdentityValidationQrOrder()
        .then((res) => {
            const data = res.data || res;
            const qd = data.qr_data;
            const rid = data.request_id;
            if (qd && rid) {
                requestId.value = rid;
                qrData.value = qd;
                showQrPanel.value = true;
                qrImageUrl.value = null;
                QRCode.toDataURL(qd, { width: 256, margin: 2 }, (err, url) => {
                    if (!err) qrImageUrl.value = url;
                });
                startPollingStatus();
            }
            loadingQr.value = false;
        })
        .catch(() => {
            loadingQr.value = false;
        });
}

function onFileChange(event, type) {
    const file = event.target.files && event.target.files[0];
    files.value[type] = file || null;
}

function submitImages() {
    if (!requestId.value || !files.value.front || !files.value.back || !files.value.selfie) {
        submitError.value = t('todosLosArchivosRequeridos');
        return;
    }
    submitting.value = true;
    submitError.value = null;
    const formData = new FormData();
    formData.append('request_id', requestId.value);
    formData.append('front_image', files.value.front);
    formData.append('back_image', files.value.back);
    formData.append('selfie_image', files.value.selfie);

    const userApi = new UserApi();
    userApi.submitManualIdentityValidation(requestId.value, formData)
        .then(() => {
            router.push({ name: 'identity_validation', query: { result: 'manual_submitted' } });
        })
        .catch((err) => {
            submitting.value = false;
            const msg = (err.response && err.response.data && (err.response.data.message || err.response.data.error)) || t('resultError');
            submitError.value = typeof msg === 'string' ? msg : t('resultError');
        });
}

watch(() => route.query, () => {
    parseQuery();
}, { immediate: true });

onMounted(() => {
    parseQuery();
    fetchCost();
    fetchStatus();
});

onBeforeUnmount(() => {
    stopPollingStatus();
});
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
