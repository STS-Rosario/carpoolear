<template>
    <div class="manual-validation-pay-options">
        <p class="manual-validation-text">
            {{ $t('manualValidationPayIntro1', { cost: costDisplay }) }}
        </p>
        <p class="manual-validation-text">{{ $t('manualValidationPayIntro2') }}</p>
        <p class="manual-validation-text manual-validation-list-lead">
            {{ $t('manualValidationPayListLead') }}
        </p>
        <ul class="manual-validation-bullets">
            <li>{{ $t('manualValidationPayBulletDni') }}</li>
        </ul>
        <p class="manual-validation-upload-warning">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
            {{ $t(manualValidationUploadWarningKey) }}
        </p>
        <p class="manual-validation-text manual-validation-closing">
            {{ $t('manualValidationPayClosing') }}
        </p>

        <div class="manual-validation-pay-buttons">
            <AppButton
                variant="primary"
                size="lg"
                block
                class="manual-validation-pay-cta"
                :disabled="loadingPreference || loadingQr || costUnavailable"
                :loading="loadingPreference"
                @click="$emit('pay-mp')"
            >
                {{ $t('manualValidationPagarMercadoPago') }}
            </AppButton>
            <AppButton
                v-if="qrEnabled"
                variant="secondary"
                size="lg"
                block
                class="manual-validation-pay-cta"
                :disabled="loadingPreference || loadingQr || costUnavailable"
                :loading="loadingQr"
                @click="$emit('pay-qr')"
            >
                {{ $t('pagarConQR') }}
            </AppButton>
        </div>
        <ManualValidationQrPaymentHelp v-if="qrEnabled" />

        <slot />

        <p
            v-if="costUnavailable"
            class="manual-validation-text small manual-validation-cost-unavailable"
        >
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
                <ManualValidationQrPaymentHelp />
                <AppButton
                    variant="tertiary"
                    size="sm"
                    class="manual-validation-qr-close"
                    @click="$emit('close-qr')"
                >
                    {{ $t('cerrar') }}
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getManualValidationUploadWarningKey,
    MANUAL_VALIDATION_UPLOAD_WARNING_STYLE
} from '../../utils/manualValidationUploadWarning';
import AppButton from '../ui/AppButton.vue';
import ManualValidationQrPaymentHelp from './ManualValidationQrPaymentHelp.vue';

export default {
    name: 'ManualIdentityValidationPayOptions',
    components: {
        AppButton,
        ManualValidationQrPaymentHelp
    },
    props: {
        costDisplay: {
            type: String,
            required: true
        },
        qrEnabled: {
            type: Boolean,
            default: false
        },
        loadingPreference: {
            type: Boolean,
            default: false
        },
        loadingQr: {
            type: Boolean,
            default: false
        },
        showQrPanel: {
            type: Boolean,
            default: false
        },
        qrImageUrl: {
            type: String,
            default: null
        },
        costUnavailable: {
            type: Boolean,
            default: false
        }
    },
    emits: ['pay-mp', 'pay-qr', 'close-qr'],
    computed: {
        manualValidationUploadWarningKey() {
            return getManualValidationUploadWarningKey();
        },
        manualValidationUploadWarningStyle() {
            return MANUAL_VALIDATION_UPLOAD_WARNING_STYLE;
        }
    }
};
</script>

<style scoped>
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

.manual-validation-upload-warning {
    margin: 0 0 1rem;
    padding: 0.75rem 0.9rem;
    border: v-bind('manualValidationUploadWarningStyle.border');
    border-radius: 4px;
    background: v-bind('manualValidationUploadWarningStyle.background');
    color: v-bind('manualValidationUploadWarningStyle.color');
    line-height: 1.4;
}

.manual-validation-upload-warning .fa {
    margin-right: 0.5rem;
}

.manual-validation-pay-options .manual-validation-bullets {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
    margin: 0 0 1rem;
    margin-left: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
}

.manual-validation-pay-options .manual-validation-bullets li {
    display: list-item;
    margin-bottom: 0.35rem;
}

.manual-validation-pay-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.25rem;
}

.manual-validation-pay-cta {
    text-transform: uppercase;
    letter-spacing: 0.02em;
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
    color: #666;
}
</style>
