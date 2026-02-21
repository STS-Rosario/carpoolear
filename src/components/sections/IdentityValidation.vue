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

<script>
import { mapGetters } from 'vuex';
import { UserApi } from '../../services/api';

export default {
    name: 'IdentityValidation',
    data() {
        return {
            manualStatus: {
                has_submission: false,
                request_id: null,
                paid: null,
                paid_at: null,
                review_status: null,
                submitted_at: null,
                review_note: null
            },
            loadingOAuth: false,
            loadingPreference: false
        };
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            config: 'auth/appConfig'
        }),
        identityValidationMpEnabled() {
            return this.config && this.config.identity_validation_mercado_pago_enabled === true;
        },
        identityValidationManualEnabled() {
            return this.config && this.config.identity_validation_manual_enabled === true;
        },
        identityValidationAvailable() {
            return this.identityValidationMpEnabled || this.identityValidationManualEnabled;
        },
        resultMessage() {
            return this.$route.query.result || null;
        },
        /** Why "Validar con Mercado Pago" is disabled (for debugging) */
        mercadopagoButtonDisabledReason() {
            if (!this.user) return 'no_user';
            if (!this.user.nro_doc || String(this.user.nro_doc).trim() === '') return 'no_nro_doc';
            if (this.loadingOAuth) return 'loading_oauth';
            return null;
        }
    },
    watch: {
        user: {
            handler(newUser) {
                const reason = this.mercadopagoButtonDisabledReason;
                console.log('[IdentityValidation] Mercado Pago button state', {
                    hasUser: !!newUser,
                    nro_doc: newUser ? (newUser.nro_doc != null ? newUser.nro_doc : '(undefined)') : 'N/A',
                    loadingOAuth: this.loadingOAuth,
                    disabledReason: reason,
                    buttonDisabled: !!reason
                });
            },
            immediate: true
        }
    },
    methods: {
        formatDate(value) {
            if (!value) return '';
            const d = new Date(value);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        fetchManualStatus() {
            const userApi = new UserApi();
            return userApi.getManualIdentityValidationStatus()
                .then((res) => {
                    this.manualStatus = res.data || res;
                })
                .catch(() => {
                    this.manualStatus = { has_submission: false };
                });
        },
        payManualValidation() {
            this.loadingPreference = true;
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
        startMercadoPagoOAuth() {
            if (!this.user || this.loadingOAuth) return;
            this.loadingOAuth = true;
            const userApi = new UserApi();
            userApi.getMercadoPagoOAuthUrl()
                .then((res) => {
                    const url = (res.data && res.data.authorization_url) || res.authorization_url;
                    if (url) {
                        window.location.href = url;
                    } else {
                        this.loadingOAuth = false;
                    }
                })
                .catch(() => {
                    this.loadingOAuth = false;
                });
        }
    },
    mounted() {
        this.fetchManualStatus();
        this.$nextTick(() => {
            console.log('[IdentityValidation] mounted – Mercado Pago button', {
                hasUser: !!this.user,
                nro_doc: this.user ? (this.user.nro_doc != null ? this.user.nro_doc : '(undefined)') : 'N/A',
                loadingOAuth: this.loadingOAuth,
                disabledReason: this.mercadopagoButtonDisabledReason
            });
        });
    }
};
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
