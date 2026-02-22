<template>
    <div class="identity-validation-component">
        <div class="alert alert-success" v-if="resultMessage === 'success'">
            {{ $t('resultSuccess') }}
        </div>
        <div class="alert alert-danger" v-if="resultMessage === 'error'">
            {{ $t('resultError') }}
        </div>
        <div class="alert alert-warning" v-if="resultMessage === 'dni_mismatch'">
            {{ $t('resultDniMismatch') }}
        </div>
        <div class="alert alert-warning" v-if="resultMessage === 'name_mismatch'">
            {{ $t('resultNameMismatch') }}
        </div>
        <div class="alert alert-success" v-if="resultMessage === 'manual_submitted'">
            {{ $t('documentacionEnviada') }}
        </div>

        <!-- Only show Validado when we have both flag and date (avoids showing for new users or bad data) -->
        <div v-if="user && user.identity_validated && user.identity_validated_at" class="alert alert-info">
            <strong>{{ $t('identidadValidada') }}</strong>
            {{ $t('validadoEl') }} {{ formatDate(user.identity_validated_at) }}
            <span v-if="user.identity_validation_type"> ({{ user.identity_validation_type }})</span>
        </div>

        <div v-else>
            <div v-if="!identityValidationAvailable" class="alert alert-info">
                {{ $t('validacionIdentidadNoDisponible') }}
            </div>
            <!-- Manual validation: waiting for payment -->
            <div v-else-if="identityValidationManualEnabled && manualStatus.has_submission && manualStatus.paid === false" class="panel panel-warning manual-status-panel">
                <div class="panel-heading">{{ $t('esperandoPagoValidacionManual') }}</div>
                <div class="panel-body">
                    <p>{{ $t('debesPagarParaContinuar') }}</p>
                    <button
                        class="btn btn-primary"
                        :disabled="loadingPreference"
                        @click="payManualValidation"
                    >
                        <span v-if="loadingPreference">{{ $t('guardando') }}</span>
                        <span v-else>{{ $t('pagarAhora') }}</span>
                    </button>
                </div>
            </div>

            <!-- Manual validation: paid, waiting for review or for upload -->
            <div v-else-if="identityValidationManualEnabled && manualStatus.has_submission && manualStatus.paid" class="panel panel-default manual-status-panel">
                <div class="panel-heading">{{ manualStatus.submitted_at ? $t('tienesDocumentoEnRevision') : $t('pagoRealizadoSubeDocumentos') }}</div>
                <div class="panel-body">
                    <p v-if="manualStatus.submitted_at">
                        <strong>{{ $t('estado') }}:</strong>
                        <span v-if="manualStatus.review_status === 'pending'">{{ $t('pagadoEsperandoRevision') }}</span>
                        <span v-else-if="manualStatus.review_status === 'approved'">{{ $t('estadoAprobado') }}</span>
                        <span v-else-if="manualStatus.review_status === 'rejected'">{{ $t('estadoRechazado') }}</span>
                    </p>
                    <p v-if="manualStatus.paid_at">
                        {{ $t('pagadoEl') }} {{ formatDate(manualStatus.paid_at) }}
                    </p>
                    <p v-if="manualStatus.submitted_at">
                        {{ $t('enviadoEl') }} {{ formatDate(manualStatus.submitted_at) }}
                    </p>
                    <p v-if="manualStatus.review_note && manualStatus.review_status === 'rejected'" class="review-note">
                        {{ manualStatus.review_note }}
                    </p>
                    <router-link
                        v-if="manualStatus.review_status === 'rejected'"
                        :to="{ name: 'identity_validation_manual' }"
                        class="btn btn-primary"
                    >
                        {{ $t('puedesIntentarDeNuevo') }}
                    </router-link>
                    <router-link
                        v-else-if="!manualStatus.submitted_at && manualStatus.request_id"
                        :to="{ name: 'identity_validation_manual', query: { request_id: manualStatus.request_id, payment_success: '1' } }"
                        class="btn btn-primary"
                    >
                        {{ $t('subirDocumentacion') }}
                    </router-link>
                </div>
            </div>

            <div v-else class="list-group">
                <div v-if="identityValidationMpEnabled" class="list-group-item">
                    <h4>{{ $t('validarConMercadoPago') }}</h4>
                    <p class="text-muted">{{ $t('validarConMercadoPagoDesc') }}</p>
                    <button
                        class="btn btn-primary"
                        :disabled="!user || !user.nro_doc || loadingOAuth"
                        @click="startMercadoPagoOAuth"
                    >
                        <span v-if="loadingOAuth">{{ $t('guardando') }}</span>
                        <span v-else>{{ $t('validarConMercadoPago') }}</span>
                    </button>
                    <p v-if="user && !user.nro_doc" class="text-warning small mt-2">
                        {{ $t('debesCargarDni') }}
                    </p>
                </div>
                <router-link
                    v-if="identityValidationManualEnabled"
                    :to="{ name: 'identity_validation_manual' }"
                    class="list-group-item list-group-item-action"
                >
                    <h4>{{ $t('validacionManual') }}</h4>
                    <p class="text-muted">{{ $t('validacionManualDescCorta') }}</p>
                    <span class="btn btn-default btn-sm">{{ $t('validacionManual') }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { UserApi } from '../../services/api';

const route = useRoute();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const config = computed(() => authStore.appConfig);

const manualStatus = ref({
    has_submission: false,
    request_id: null,
    paid: null,
    paid_at: null,
    review_status: null,
    submitted_at: null,
    review_note: null
});
const loadingOAuth = ref(false);
const loadingPreference = ref(false);

const identityValidationMpEnabled = computed(() => {
    return config.value && config.value.identity_validation_mercado_pago_enabled === true;
});
const identityValidationManualEnabled = computed(() => {
    return config.value && config.value.identity_validation_manual_enabled === true;
});
const identityValidationAvailable = computed(() => {
    return identityValidationMpEnabled.value || identityValidationManualEnabled.value;
});
const resultMessage = computed(() => {
    return route.query.result || null;
});

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchManualStatus() {
    const userApi = new UserApi();
    return userApi.getManualIdentityValidationStatus()
        .then((res) => {
            manualStatus.value = res.data || res;
        })
        .catch(() => {
            manualStatus.value = { has_submission: false };
        });
}

function payManualValidation() {
    loadingPreference.value = true;
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

function startMercadoPagoOAuth() {
    if (!user.value || loadingOAuth.value) return;
    loadingOAuth.value = true;
    const userApi = new UserApi();
    userApi.getMercadoPagoOAuthUrl()
        .then((res) => {
            const url = (res.data && res.data.authorization_url) || res.authorization_url;
            if (url) {
                window.location.href = url;
            } else {
                loadingOAuth.value = false;
            }
        })
        .catch(() => {
            loadingOAuth.value = false;
        });
}

onMounted(() => {
    fetchManualStatus();
});
</script>

<style scoped>
.identity-validation-component {
    padding: 0 0 1em 0;
}
.manual-status-panel {
    margin-bottom: 1.5em;
}
.review-note {
    font-style: italic;
    color: #666;
}
</style>
