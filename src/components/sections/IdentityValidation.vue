<template>
    <div class="identity-validation-component">
        <div
            v-if="showVerificationSuccessBanner"
            class="identity-verification-success-banner"
        >
            <img
                :src="checkCircleIconSrc"
                alt=""
                class="identity-verification-success-banner__icon"
            />
            <div class="identity-verification-success-banner__content">
                <h2 class="identity-verification-success-banner__title">
                    {{ $t('identityVerificationSuccessTitle') }}
                </h2>
                <p class="identity-verification-success-banner__text">
                    {{ $t('identityVerificationSuccessBody') }}
                </p>
                <p class="identity-verification-success-banner__emphasis">
                    {{ $t('identityVerificationSuccessEmphasis') }}
                </p>
                <router-link
                    :to="{ name: 'trips', params: { clearSearch: true } }"
                    class="identity-verification-success-banner__link"
                >
                    {{ $t('identityVerificationSuccessHomeLink') }}
                </router-link>
            </div>
        </div>

        <div v-else>
        <div class="alert alert-danger" v-if="resultMessage === 'error'">
            {{ $t('resultError') }}
        </div>
        <div class="alert alert-warning" v-if="resultMessage === 'dni_mismatch'">
            {{ $t('resultDniMismatch') }}
        </div>
        <div class="alert alert-warning" v-if="resultMessage === 'name_mismatch'">
            {{ $t('resultNameMismatch') }}
        </div>

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

            <!-- Manual: pending review — blue (?result=manual_submitted) -->
            <div
                v-else-if="
                    identityValidationManualEnabled &&
                        manualStatus.has_submission &&
                        manualStatus.paid &&
                        showManualPendingReviewBlue
                "
                class="identity-validation-manual-submitted-notice identity-validation-manual-submitted-notice--standalone"
            >
                <h2 class="identity-validation-manual-submitted-notice__title">
                    {{ $t('identityValidationManualSubmittedNoticeTitle') }}
                </h2>
                <p class="identity-validation-manual-submitted-notice__text">
                    {{ $t('identityValidationManualSubmittedNoticeBody') }}
                </p>
                <p class="identity-validation-manual-submitted-notice__emphasis">
                    {{ $t('identityValidationManualSubmittedNoticeEmphasis') }}
                </p>
                <div class="identity-validation-manual-submitted-notice__meta">
                    <p class="identity-validation-manual-submitted-notice__meta-line">
                        <strong>{{ $t('estado') }}:</strong>
                        {{ $t('pagadoEsperandoRevision') }}
                    </p>
                    <p
                        v-if="manualStatus.paid_at"
                        class="identity-validation-manual-submitted-notice__meta-line"
                    >
                        {{ $t('pagadoEl') }} {{ formatDate(manualStatus.paid_at) }}
                    </p>
                    <p
                        v-if="manualStatus.submitted_at"
                        class="identity-validation-manual-submitted-notice__meta-line"
                    >
                        {{ $t('enviadoEl') }} {{ formatDate(manualStatus.submitted_at) }}
                    </p>
                </div>
            </div>

            <!-- Manual: pending review — yellow (API state, no query param) -->
            <div
                v-else-if="
                    identityValidationManualEnabled &&
                        manualStatus.has_submission &&
                        manualStatus.paid &&
                        showManualPendingReviewYellow
                "
                class="identity-verification-pending-review-notice"
            >
                <h2 class="identity-verification-pending-review-notice__title">
                    {{ $t('identityVerificationPendingReviewNoticeTitle') }}
                </h2>
                <p class="identity-verification-pending-review-notice__text">
                    {{ $t('identityVerificationPendingReviewNoticeBody') }}
                </p>
                <p class="identity-verification-pending-review-notice__emphasis">
                    {{ $t('identityVerificationPendingReviewNoticeEmphasis') }}
                </p>
                <div class="identity-verification-pending-review-notice__meta">
                    <p class="identity-verification-pending-review-notice__meta-line">
                        <strong>{{ $t('estado') }}:</strong>
                        {{ $t('pagadoEsperandoRevision') }}
                    </p>
                    <p
                        v-if="manualStatus.paid_at"
                        class="identity-verification-pending-review-notice__meta-line"
                    >
                        {{ $t('pagadoEl') }} {{ formatDate(manualStatus.paid_at) }}
                    </p>
                    <p
                        v-if="manualStatus.submitted_at"
                        class="identity-verification-pending-review-notice__meta-line"
                    >
                        {{ $t('enviadoEl') }} {{ formatDate(manualStatus.submitted_at) }}
                    </p>
                </div>
            </div>

            <!-- Manual validation: paid, upload docs -->
            <div
                v-else-if="
                    identityValidationManualEnabled &&
                        manualStatus.has_submission &&
                        manualStatus.paid &&
                        !manualStatus.submitted_at
                "
                class="manual-status-upload-block"
            >
                <p class="manual-status-upload-block__lead">
                    {{ $t('pagoRealizadoSubeDocumentos') }}
                </p>
                <router-link
                    v-if="manualStatus.request_id"
                    :to="{
                        name: 'identity_validation_manual',
                        query: { request_id: manualStatus.request_id, payment_success: '1' }
                    }"
                    class="btn btn-primary"
                >
                    {{ $t('subirDocumentacion') }}
                </router-link>
            </div>

            <!-- Manual validation: paid, submitted — approved or rejected -->
            <div
                v-else-if="
                    identityValidationManualEnabled &&
                        manualStatus.has_submission &&
                        manualStatus.paid &&
                        manualStatus.submitted_at &&
                        !showManualValidationSubmittedNotice
                "
                class="manual-status-terminal-block"
            >
                <p class="manual-status-terminal-block__estado">
                    <strong>{{ $t('estado') }}:</strong>
                    <span v-if="manualStatus.review_status === 'approved'">{{ $t('estadoAprobado') }}</span>
                    <span v-else-if="manualStatus.review_status === 'rejected'">{{ $t('estadoRechazado') }}</span>
                </p>
                <p
                    v-if="manualStatus.paid_at"
                    class="manual-status-terminal-block__date"
                >
                    {{ $t('pagadoEl') }} {{ formatDate(manualStatus.paid_at) }}
                </p>
                <p
                    v-if="manualStatus.submitted_at"
                    class="manual-status-terminal-block__date"
                >
                    {{ $t('enviadoEl') }} {{ formatDate(manualStatus.submitted_at) }}
                </p>
                <p
                    v-if="manualStatus.review_note && manualStatus.review_status === 'rejected'"
                    class="review-note"
                >
                    {{ manualStatus.review_note }}
                </p>
                <router-link
                    v-if="manualStatus.review_status === 'rejected'"
                    :to="{ name: 'identity_validation_manual' }"
                    class="btn btn-primary"
                >
                    {{ $t('puedesIntentarDeNuevo') }}
                </router-link>
            </div>

            <div v-else class="identity-validation-main">
                <header class="identity-validation-intro">
                    <h1 class="identity-validation-title visible-xs-block">{{ $t('validarIdentidad') }}</h1>
                    <p class="identity-validation-lead">{{ $t('identityValidationPageIntro') }}</p>
                    <ul class="identity-validation-bullets">
                        <li>{{ $t('identityValidationPageBullet1') }}</li>
                        <li>{{ $t('identityValidationPageBullet2') }}</li>
                        <li>{{ $t('identityValidationPageBullet3') }}</li>
                    </ul>
                    <p class="identity-validation-once">{{ $t('identidadModalUnaVez') }}</p>
                </header>

                <div class="identity-validation-cards">
                    <div
                        v-if="identityValidationMpEnabled"
                        class="identity-validation-card"
                    >
                        <h2 class="identity-validation-card-title">{{ $t('identidadModalAutoTitulo') }}</h2>
                        <p class="identity-validation-card-desc">{{ $t('identityValidationAutoCardDesc') }}</p>
                        <ul class="identity-validation-card-bullets">
                            <li>{{ $t('identidadModalAutoGratis') }}</li>
                            <li>{{ $t('identidadModalAutoInmediata') }}</li>
                        </ul>
                        <button
                            type="button"
                            class="btn btn-danger btn-lg btn-block identity-validation-btn-cta"
                            :disabled="!user || !user.nro_doc || loadingOAuth"
                            @click="startMercadoPagoOAuth"
                        >
                            <span v-if="loadingOAuth">{{ $t('guardando') }}</span>
                            <span v-else>{{ $t('validarConMercadoPago') }}</span>
                        </button>
                        <p v-if="user && !user.nro_doc" class="small identity-validation-hint">
                            {{ $t('debesCargarDni') }}
                        </p>
                    </div>

                    <div
                        v-if="identityValidationManualEnabled"
                        class="identity-validation-card"
                    >
                        <h2 class="identity-validation-card-title">{{ $t('identidadModalManualTitulo') }}</h2>
                        <p class="identity-validation-card-desc">{{ $t('identityValidationManualCardDesc') }}</p>
                        <ul class="identity-validation-card-bullets">
                            <li>
                                {{ $t('identityValidationCostLine', { cost: formattedManualCost }) }}
                            </li>
                            <li>{{ $t('identityValidationTimeLine') }}</li>
                        </ul>
                        <router-link
                            :to="{ name: 'identity_validation_manual' }"
                            class="btn btn-lg btn-block identity-validation-btn-outline"
                        >
                            {{ $t('solicitarVerificacionManual') }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
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
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
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
        /**
         * Paid + docs sent + not yet approved/rejected — still in admin queue.
         * Must not be hidden behind the green "already verified" banner (user may still
         * carry identity_validated from MP or stale cache while manual review runs).
         */
        manualDocsPendingAdminReview() {
            if (!this.identityValidationManualEnabled) return false;
            const m = this.manualStatus;
            if (!m || !m.has_submission || !m.paid || !m.submitted_at) return false;
            if (m.review_status === 'approved' || m.review_status === 'rejected') {
                return false;
            }
            return true;
        },
        /** Docs submitted, awaiting admin (not approved/rejected). */
        showManualValidationSubmittedNotice() {
            const m = this.manualStatus;
            if (!m || !m.submitted_at) return false;
            const rs = m.review_status;
            return rs !== 'approved' && rs !== 'rejected';
        },
        /** Blue card: right after upload redirect (?result=manual_submitted). */
        showManualPendingReviewBlue() {
            return (
                this.showManualValidationSubmittedNotice &&
                this.resultMessage === 'manual_submitted'
            );
        },
        /** Yellow card: same API state when user opens the page without that query. */
        showManualPendingReviewYellow() {
            return (
                this.showManualValidationSubmittedNotice &&
                this.resultMessage !== 'manual_submitted'
            );
        },
        showVerificationSuccessBanner() {
            if (this.manualDocsPendingAdminReview) {
                return false;
            }
            if (this.resultMessage === 'success') {
                return true;
            }
            if (
                this.user &&
                this.user.identity_validated &&
                this.user.identity_validated_at
            ) {
                return true;
            }
            return false;
        },
        checkCircleIconSrc() {
            const base = process.env.ROUTE_BASE || '/';
            return `${base}static/img/check-circle.png`;
        },
        formattedManualCost() {
            const cents =
                this.config && this.config.manual_identity_validation_cost_cents;
            if (cents == null || Number(cents) <= 0) {
                return '—';
            }
            const loc = this.$i18n.locale === 'en' ? 'en-US' : 'es-AR';
            return new Intl.NumberFormat(loc, {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Number(cents) / 100);
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
            const defaults = {
                has_submission: false,
                request_id: null,
                paid: null,
                paid_at: null,
                review_status: null,
                submitted_at: null,
                review_note: null
            };
            const userApi = new UserApi();
            return userApi.getManualIdentityValidationStatus()
                .then((res) => {
                    let body = res && typeof res === 'object' ? res : null;
                    if (
                        body &&
                        !Object.prototype.hasOwnProperty.call(body, 'has_submission') &&
                        body.data &&
                        typeof body.data === 'object'
                    ) {
                        body = body.data;
                    }
                    if (!body || typeof body !== 'object') {
                        body = {};
                    }
                    this.manualStatus = { ...defaults, ...body };
                })
                .catch(() => {
                    this.manualStatus = { ...defaults };
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
    margin-top: 4rem;
    padding: 0 0 1em 0;
    color: #333;
}

.identity-verification-success-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: #e8f5e9;
    border: 1px solid #a5d6a7;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.identity-verification-success-banner__icon {
    width: 1.85rem;
    height: 1.85rem;
    object-fit: contain;
    flex-shrink: 0;
}

.identity-verification-success-banner__content {
    flex: 1;
    min-width: 0;
}

.identity-verification-success-banner__title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1b5e20;
    line-height: 1.3;
}

.identity-verification-success-banner__text {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #2e7d32;
}

.identity-verification-success-banner__emphasis {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.45;
    color: #2e7d32;
}

.identity-verification-success-banner__link {
    display: inline-block;
    font-size: 0.95rem;
    color: #337ab7;
    font-weight: 600;
}

.identity-verification-success-banner__link:hover,
.identity-verification-success-banner__link:focus {
    color: #286090;
    text-decoration: none;
}

.identity-validation-component .btn-primary,
.identity-validation-component .btn-danger {
    color: #fff;
}

.identity-validation-component .btn-primary[disabled],
.identity-validation-component .btn-danger[disabled] {
    color: #fff;
    opacity: 0.65;
}

.identity-validation-component .identity-validation-btn-outline {
    color: #337ab7;
}

.identity-validation-component .identity-validation-btn-outline:hover,
.identity-validation-component .identity-validation-btn-outline:focus {
    color: #286090;
}

.identity-validation-component .alert {
    color: #333;
}

.identity-validation-manual-submitted-notice {
    background: #cbe6f7;
    border: 1px solid #2b6fad;
    border-radius: 4px;
    padding: 1rem 1.25rem;
    color: #0d3a66;
}

.identity-validation-manual-submitted-notice--standalone {
    margin-bottom: 1rem;
}

.identity-validation-manual-submitted-notice__title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    color: #0d3a66;
}

.identity-validation-manual-submitted-notice__text {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #0d3a66;
}

.identity-validation-manual-submitted-notice__emphasis {
    margin: 0 0 0.65rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.45;
    color: #0d3a66;
}

.identity-validation-manual-submitted-notice__meta {
    margin: 0;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(43, 111, 173, 0.35);
}

.identity-validation-manual-submitted-notice__meta-line {
    margin: 0.15rem 0;
    font-size: 0.95rem;
    line-height: 1.35;
    color: #0d3a66;
}

.identity-verification-pending-review-notice {
    background: #fcf8e3;
    border: 1px solid #d6c896;
    border-radius: 4px;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    color: #7a5f2a;
}

.identity-verification-pending-review-notice__title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    color: #6b5424;
}

.identity-verification-pending-review-notice__text {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #7a5f2a;
}

.identity-verification-pending-review-notice__emphasis {
    margin: 0 0 0.65rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.45;
    color: #6b5424;
}

.identity-verification-pending-review-notice__meta {
    margin: 0;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(122, 95, 42, 0.28);
}

.identity-verification-pending-review-notice__meta-line {
    margin: 0.15rem 0;
    font-size: 0.95rem;
    line-height: 1.35;
    color: #7a5f2a;
}

.manual-status-upload-block {
    margin-bottom: 1.5rem;
    color: #333;
}

.manual-status-upload-block__lead {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    line-height: 1.45;
}

.manual-status-terminal-block {
    margin-bottom: 1.5rem;
    color: #333;
}

.manual-status-terminal-block__estado {
    margin: 0 0 0.35rem;
    font-size: 1rem;
}

.manual-status-terminal-block__date {
    margin: 0.15rem 0;
    font-size: 0.95rem;
    line-height: 1.35;
}

.manual-status-panel {
    margin-bottom: 1.5em;
}

.identity-validation-component .manual-status-panel.panel-warning .panel-heading {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.35;
}

.review-note {
    font-style: italic;
    color: #333;
}

.identity-validation-main {
    padding: 0 0 0.5rem;
}

@media (min-width: 768px) {
    .identity-validation-main {
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        padding: 1.75rem 2rem 2rem;
    }
}

.identity-validation-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    line-height: 1.3;
    color: #333;
}

.identity-validation-lead {
    margin: 0 0 1rem;
    line-height: 1.5;
    color: #333;
}

/* Bullets only on this screen — scoped to root, not global `ul` */
.identity-validation-component .identity-validation-bullets,
.identity-validation-component .identity-validation-card-bullets {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
    margin-left: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
}

.identity-validation-component .identity-validation-bullets {
    margin: 0 0 1rem;
}

.identity-validation-component .identity-validation-bullets li,
.identity-validation-component .identity-validation-card-bullets li {
    display: list-item;
}

.identity-validation-component .identity-validation-bullets li {
    margin-bottom: 0.35rem;
}

.identity-validation-once {
    margin: 0 0 1.75rem;
    font-size: 0.95rem;
    color: #333;
}

.identity-validation-cards {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

@media (min-width: 768px) {
    .identity-validation-cards {
        flex-direction: row;
        align-items: stretch;
        gap: 1.5rem;
    }

    .identity-validation-cards .identity-validation-card {
        flex: 1 1 0;
        min-width: 0;
    }
}

.identity-validation-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1.25rem 1.25rem 1.5rem;
    background: #fff;
}

@media (min-width: 768px) {
    .identity-validation-main .identity-validation-card {
        background: #fafafa;
    }
}

.identity-validation-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    line-height: 1.3;
    color: #333;
}

.identity-validation-card-desc {
    margin: 0 0 1rem;
    line-height: 1.5;
    color: #333;
    font-size: 0.95rem;
}

.identity-validation-component .identity-validation-card-bullets {
    margin: 0 0 1.25rem;
}

.identity-validation-component .identity-validation-card-bullets li {
    margin-bottom: 0.25rem;
}

.identity-validation-btn-cta {
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 4px;
    font-size: 1.125rem;
}

.identity-validation-btn-outline {
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 4px;
    font-size: 1.125rem;
    background: #fff;
    border: 2px solid #337ab7;
    color: #337ab7;
}

.identity-validation-btn-outline:hover,
.identity-validation-btn-outline:focus {
    background: #f5f9fc;
    border-color: #286090;
    color: #286090;
    text-decoration: none;
}

.identity-validation-hint {
    margin-top: 0.75rem;
    margin-bottom: 0;
    color: #333;
}
</style>
