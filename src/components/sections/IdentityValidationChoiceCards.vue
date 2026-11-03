<template>
    <div class="identity-validation-cards">
        <div
            v-if="manualEnabled"
            class="identity-validation-card"
        >
            <div class="identity-validation-card-header">
                <div class="identity-validation-card-heading">
                    <i class="fa fa-file-text-o" aria-hidden="true"></i>
                    <h2 class="identity-validation-card-title">{{ $t('identidadModalManualTitulo') }}</h2>
                </div>
                <div class="identity-validation-card-badges">
                    <span class="identity-validation-card-badge">{{ formattedManualCost }}</span>
                    <span class="identity-validation-card-badge">{{ $t('identityValidationManualBadgeTime') }}</span>
                </div>
            </div>
            <p class="identity-validation-card-desc">{{ $t('identityValidationManualCardDesc') }}</p>
            <AppButton
                variant="primary"
                size="lg"
                block
                class="identity-validation-choice-cta"
                :style="buttonSizingStyle"
                :disabled="blockedByMissingDni"
                @click="$emit('choose-manual')"
            >
                {{ $t('solicitarVerificacionManual') }}
            </AppButton>
        </div>

        <div
            v-if="mpEnabled"
            class="identity-validation-card"
        >
            <div class="identity-validation-card-header">
                <div class="identity-validation-card-heading">
                    <i class="fa fa-shield" aria-hidden="true"></i>
                    <h2 class="identity-validation-card-title">{{ $t('identidadModalAutoTitulo') }}</h2>
                </div>
                <div class="identity-validation-card-badges">
                    <span class="identity-validation-card-badge">{{ $t('identityValidationAutoBadgeFree') }}</span>
                    <span class="identity-validation-card-badge">{{ $t('identityValidationAutoBadgeInstant') }}</span>
                </div>
            </div>
            <p class="identity-validation-card-desc">{{ $t('identityValidationAutoCardDesc') }}</p>
            <AppButton
                variant="primary"
                size="lg"
                block
                class="identity-validation-choice-cta"
                :style="buttonSizingStyle"
                :disabled="blockedByMissingDni || loadingOauth"
                :loading="loadingOauth"
                @click="$emit('choose-mp')"
            >
                {{ $t('validarConMercadoPago') }}
            </AppButton>
            <p class="identity-validation-card-hint">{{ $t('identidadModalAutoPuedeEliminarMp') }}</p>
        </div>
    </div>
</template>

<script>
import AppButton from '../ui/AppButton.vue';

export default {
    name: 'IdentityValidationChoiceCards',
    components: {
        AppButton
    },
    props: {
        mpEnabled: {
            type: Boolean,
            default: false
        },
        manualEnabled: {
            type: Boolean,
            default: false
        },
        formattedManualCost: {
            type: String,
            default: '—'
        },
        blockedByMissingDni: {
            type: Boolean,
            default: false
        },
        loadingOauth: {
            type: Boolean,
            default: false
        },
        buttonSizingStyle: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['choose-mp', 'choose-manual']
};
</script>

<style scoped>
.identity-validation-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 768px) {
    .identity-validation-cards {
        flex-direction: row;
        align-items: stretch;
        gap: 1.25rem;
    }

    .identity-validation-cards .identity-validation-card {
        flex: 1 1 0;
        min-width: 0;
        background: #fafafa;
    }
}

.identity-validation-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ds-action-border, #1e5f9e);
    border-radius: 10px;
    padding: 1rem 1rem 1.15rem;
    background: #fff;
}

.identity-validation-card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.5rem;
    margin: 0 0 0.5rem;
}

.identity-validation-card-heading {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex: 0 1 auto;
    min-width: 0;
}

.identity-validation-card-heading .fa {
    color: var(--ds-action, #1e5f9e);
    font-size: 1.15rem;
    flex-shrink: 0;
}

.identity-validation-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
    color: #333;
}

.identity-validation-card-badges {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.35rem;
    flex: 0 0 auto;
    flex-shrink: 0;
    margin-left: auto;
}

.identity-validation-card-badge {
    display: inline-flex;
    align-items: center;
    border: 1px solid #c5d4e0;
    border-radius: 999px;
    padding: 0.1rem 0.55rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.3;
    color: #4a6578;
    background: #fff;
    white-space: nowrap;
}

.identity-validation-card-desc {
    margin: 0 0 0.75rem;
    line-height: 1.4;
    color: #333;
    font-size: 0.875rem;
}

.identity-validation-card-hint {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    line-height: 1.35;
    color: #666;
}

.identity-validation-choice-cta {
    margin-top: auto;
    letter-spacing: 0.01em;
}

@media (max-width: 767px) {
    .identity-validation-cards {
        gap: 0.5rem;
    }

    .identity-validation-card {
        padding: 0.8125rem 1rem 0.875rem;
    }

    .identity-validation-card-header {
        margin-bottom: 0.375rem;
        flex-wrap: nowrap;
    }

    .identity-validation-card-title {
        font-size: 0.8125rem;
        line-height: 1.25;
    }

    .identity-validation-card-badge {
        font-size: 0.6875rem;
        padding: 0.05rem 0.45rem;
    }

    .identity-validation-card-desc {
        margin-bottom: 0.5rem;
        line-height: 1.35;
    }

    .identity-validation-card-hint {
        margin-top: 0.45rem;
        line-height: 1.3;
    }
}
</style>
