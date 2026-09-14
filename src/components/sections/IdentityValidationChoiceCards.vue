<template>
    <div class="identity-validation-cards">
        <div
            v-if="mpEnabled"
            class="identity-validation-card"
        >
            <div class="identity-validation-card-header">
                <i class="fa fa-shield" aria-hidden="true"></i>
                <h2 class="identity-validation-card-title">{{ $t('identidadModalAutoTitulo') }}</h2>
                <span class="identity-validation-card-badge">{{ $t('identityValidationAutoBadgeFree') }}</span>
                <span class="identity-validation-card-badge">{{ $t('identityValidationAutoBadgeInstant') }}</span>
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
            <p class="identity-validation-mp-warning">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                {{ $t('identityValidationMercadoPagoOwnershipWarningPrefix') }}
                <a href="#" @click.prevent="$emit('edit-profile')">{{ $t('identityValidationMercadoPagoOwnershipWarningProfileLink') }}</a>{{ $t('identityValidationMercadoPagoOwnershipWarningSuffix') }}
            </p>
        </div>

        <div
            v-if="manualEnabled"
            class="identity-validation-card"
        >
            <div class="identity-validation-card-header">
                <i class="fa fa-file-text-o" aria-hidden="true"></i>
                <h2 class="identity-validation-card-title">{{ $t('identidadModalManualTitulo') }}</h2>
                <span class="identity-validation-card-badge">{{ formattedManualCost }}</span>
                <span class="identity-validation-card-badge">{{ $t('identityValidationManualBadgeTime') }}</span>
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
    emits: ['choose-mp', 'choose-manual', 'edit-profile']
};
</script>

<style scoped>
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
        background: #fafafa;
    }
}

.identity-validation-card {
    border: 1px solid var(--ds-action-border, #1e5f9e);
    border-radius: 10px;
    padding: 1.25rem 1.25rem 1.5rem;
    background: #fff;
}

.identity-validation-card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.5rem;
    margin: 0 0 0.75rem;
}

.identity-validation-card-header .fa {
    color: var(--ds-action, #1e5f9e);
    font-size: 1.15rem;
}

.identity-validation-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
    color: #333;
    flex: 1 1 auto;
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
    margin: 0 0 1rem;
    line-height: 1.5;
    color: #333;
    font-size: 0.95rem;
}

.identity-validation-card-hint {
    margin: 0.65rem 0 0;
    font-size: 0.85rem;
    line-height: 1.4;
    color: #666;
}

.identity-validation-choice-cta {
    letter-spacing: 0.01em;
}

.identity-validation-mp-warning {
    margin: 0.75rem 0 0;
    padding: 0.75rem 0.9rem;
    border-radius: 4px;
    border: 1px solid #faebcc;
    background: #fcf8e3;
    color: #8a6d3b;
    line-height: 1.4;
    font-size: 0.92rem;
}

.identity-validation-mp-warning .fa {
    margin-right: 0.5rem;
}

.identity-validation-mp-warning a {
    color: #7f4f00;
    font-weight: 700;
    text-decoration: underline;
}

.identity-validation-mp-warning a:hover,
.identity-validation-mp-warning a:focus {
    color: #5f3a00;
}
</style>
