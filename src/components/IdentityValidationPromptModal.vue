<template>
    <div
        v-if="open"
        class="identity-validation-prompt-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('identidadModalTitle')"
    >
        <div
            class="identity-validation-prompt-backdrop"
            @click="dismissForLater"
        />
        <div class="identity-validation-prompt-dialog">
            <button
                type="button"
                class="identity-validation-prompt-close"
                :aria-label="$t('cerrar')"
                @click.stop="dismissForLater"
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>

            <div class="identity-validation-prompt-illustration">
                <img
                    :src="illustrationSrc"
                    alt=""
                    class="identity-validation-prompt-illustration-img"
                />
            </div>

            <h2 class="identity-validation-prompt-title">
                {{ $t('identidadModalTitle') }}
            </h2>

            <div class="identity-validation-prompt-body">
                <p>{{ $t('identidadModalIntro') }}</p>
                <p class="identity-validation-prompt-emphasis">
                    {{ $t('identidadModalEnfasis') }}
                </p>

                <p
                    v-if="showMpOption || showManualOption"
                    class="identity-validation-prompt-options-lead"
                >
                    {{ $t(optionsTitleKey) }}
                </p>

                <ol
                    v-if="showMpOption || showManualOption"
                    class="identity-validation-prompt-options-list"
                >
                    <li v-if="showMpOption" class="identity-validation-prompt-option-block">
                        <span class="identity-validation-prompt-option-name">{{
                            $t('identidadModalAutoTitulo')
                        }}</span>
                        <ul>
                            <li>
                                <strong>{{ $t('identidadModalAutoMp') }}</strong>
                            </li>
                            <li>{{ $t('identidadModalAutoGratis') }}</li>
                            <li>{{ $t('identidadModalAutoInmediata') }}</li>
                        </ul>
                    </li>
                    <li v-if="showManualOption" class="identity-validation-prompt-option-block">
                        <span class="identity-validation-prompt-option-name">{{
                            $t('identidadModalManualTitulo')
                        }}</span>
                        <ul>
                            <li>
                                <strong>{{ $t('identidadModalManualEquipo') }}</strong>
                            </li>
                            <li>
                                {{
                                    $t('identidadModalManualCosto', {
                                        cost: formattedManualCost
                                    })
                                }}
                            </li>
                            <li>{{ $t('identidadModalManualPlazo') }}</li>
                        </ul>
                    </li>
                </ol>

                <p class="identity-validation-prompt-footnote">
                    {{ $t('identidadModalUnaVez') }}
                </p>

                <div class="identity-validation-prompt-info" role="status">
                    <img
                        :src="infoIconSrc"
                        alt=""
                        class="identity-validation-prompt-info-icon"
                    />
                    <p>
                        {{
                            $t('identidadModalPlazoInfo', {
                                days: plazoModalDays
                            })
                        }}
                    </p>
                </div>
            </div>

            <div class="identity-validation-prompt-actions">
                <button
                    type="button"
                    class="btn btn-lg identity-validation-prompt-btn-validate"
                    @click="goValidate"
                >
                    {{ $t('identidadModalValidar') }}
                </button>
                <button
                    type="button"
                    class="btn btn-lg identity-validation-prompt-btn-later"
                    @click="dismissForLater"
                >
                    {{ $t('identidadModalMasTarde') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import {
    isIdentityValidationCountdownScenario,
    isIdentityPromptDismissed,
    dismissIdentityPromptPermanently
} from '../utils/identityValidationPrompt';

const PLAZO_MODAL_DAYS = 30;

export default {
    name: 'IdentityValidationPromptModal',
    props: {
        /** Hide while splash, onboarding, etc. */
        suppress: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dismissVersion: 0
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            appConfig: 'appConfig',
            logged: 'checkLogin'
        }),
        hideForRoute() {
            const n = this.$route && this.$route.name;
            return (
                n === 'identity_validation' || n === 'identity_validation_manual'
            );
        },
        showMpOption() {
            return (
                this.appConfig &&
                this.appConfig.identity_validation_mercado_pago_enabled === true
            );
        },
        showManualOption() {
            return (
                this.appConfig &&
                this.appConfig.identity_validation_manual_enabled === true
            );
        },
        baseEligible() {
            return (
                this.logged &&
                !this.suppress &&
                !this.hideForRoute &&
                isIdentityValidationCountdownScenario(this.user, this.appConfig)
            );
        },
        dismissed() {
            void this.dismissVersion;
            return this.user && isIdentityPromptDismissed(this.user.id);
        },
        open() {
            return this.baseEligible && !this.dismissed;
        },
        illustrationSrc() {
            const base = process.env.ROUTE_BASE || '/';
            return `${base}static/img/icon-verificacion.png`;
        },
        infoIconSrc() {
            const base = process.env.ROUTE_BASE || '/';
            return `${base}img/icon-info.svg`;
        },
        formattedManualCost() {
            const cents =
                this.appConfig &&
                this.appConfig.manual_identity_validation_cost_cents;
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
        optionsTitleKey() {
            return this.showMpOption && this.showManualOption
                ? 'identidadModalOpcionesTitulo'
                : 'identidadModalUnaOpcion';
        },
        plazoModalDays() {
            return PLAZO_MODAL_DAYS;
        }
    },
    methods: {
        dismissForLater() {
            if (!this.user) return;
            dismissIdentityPromptPermanently(this.user.id);
            this.dismissVersion += 1;
        },
        goValidate() {
            this.$router.push({ name: 'identity_validation' });
        }
    }
};
</script>

<style scoped>
.identity-validation-prompt-modal {
    position: fixed;
    inset: 0;
    z-index: 9990;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.identity-validation-prompt-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
}

.identity-validation-prompt-dialog {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 560px;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 20px 20px 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
}

.identity-validation-prompt-close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 5;
    padding: 8px;
    line-height: 1;
    color: #777;
    font-size: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
}

.identity-validation-prompt-close:hover,
.identity-validation-prompt-close:focus {
    color: #333;
}

.identity-validation-prompt-illustration {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 8px 0 12px;
}

.identity-validation-prompt-illustration-img {
    display: block;
    max-width: 100px;
    width: auto;
    height: auto;
}

.identity-validation-prompt-title {
    margin: 0 0 12px;
    font-size: 1.35rem;
    font-weight: 700;
    text-align: left;
    color: #222;
}

.identity-validation-prompt-body {
    font-size: 14px;
    line-height: 1.45;
    color: #333;
    text-align: left;
}

.identity-validation-prompt-body p {
    margin: 0 0 10px;
}

.identity-validation-prompt-emphasis {
    font-weight: 700;
}

.identity-validation-prompt-options-lead {
    font-weight: 700;
    margin-top: 12px !important;
}

.identity-validation-prompt-options-list {
    margin: 8px 0 12px;
    padding-left: 1.25rem;
    color: #333;
}

.identity-validation-prompt-options-list > li {
    color: #333;
}

.identity-validation-prompt-option-block {
    margin-bottom: 12px;
    color: #333;
}

.identity-validation-prompt-option-name {
    display: block;
    font-weight: 700;
    color: #337ab7;
    margin-bottom: 4px;
}

.identity-validation-prompt-option-block ul {
    margin: 0;
    padding-left: 1.1rem;
    color: #333 !important;
}

.identity-validation-prompt-option-block ul li {
    color: #333 !important;
}

.identity-validation-prompt-option-block ul li strong {
    color: #333 !important;
}

.identity-validation-prompt-footnote {
    font-size: 13px;
    color: #555;
    margin-top: 8px !important;
}

.identity-validation-prompt-info {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-top: 14px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fafafa;
}

.identity-validation-prompt-info p {
    margin: 0;
    flex: 1;
    font-size: 13px;
    line-height: 1.4;
}

.identity-validation-prompt-info-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin-top: 1px;
    object-fit: contain;
}

.identity-validation-prompt-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
    justify-content: stretch;
}

.identity-validation-prompt-actions .btn {
    flex: 1 1 140px;
    min-width: 0;
    font-weight: 700;
    border: none;
}

@media (max-width: 576px) {
    .identity-validation-prompt-actions {
        flex-direction: column;
    }

    .identity-validation-prompt-actions .btn {
        flex: none;
        width: 100%;
        font-size: 1.25rem;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}

.identity-validation-prompt-btn-later {
    background: #7eb8d6 !important;
    color: #fff !important;
}

.identity-validation-prompt-btn-later:hover,
.identity-validation-prompt-btn-later:focus {
    background: #6aa6c4 !important;
    color: #fff !important;
}

.identity-validation-prompt-btn-validate {
    background: #c00 !important;
    color: #fff !important;
}

.identity-validation-prompt-btn-validate:hover,
.identity-validation-prompt-btn-validate:focus {
    background: #a00 !important;
    color: #fff !important;
}
</style>
