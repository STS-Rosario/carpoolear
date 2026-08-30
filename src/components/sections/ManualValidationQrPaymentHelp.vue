<template>
    <div class="qr-payment-help">
        <button
            type="button"
            class="qr-payment-help__toggle"
            :aria-expanded="helpOpen ? 'true' : 'false'"
            @click="helpOpen = !helpOpen"
        >
            {{ $t('comoPagarElQR') }}
        </button>
        <div v-if="helpOpen" class="qr-payment-help__content">
            <h4 class="qr-payment-help__title">{{ $t('comoHacerPagoQRTitulo') }}</h4>
            <p class="qr-payment-help__paragraph">{{ $t('comoHacerPagoQRCelular') }}</p>
            <p class="qr-payment-help__paragraph">
                {{ $t('comoHacerPagoQRComputadoraPrefix') }}<a
                    :href="carpoolearAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                >{{ $t('comoHacerPagoQRComputadoraLink') }}</a>{{ $t('comoHacerPagoQRComputadoraSuffix') }}
            </p>
        </div>
    </div>
</template>

<script>
import { CARPOOLEAR_APP_URL } from '../../utils/qrPaymentHelp';

export default {
    name: 'ManualValidationQrPaymentHelp',
    data() {
        return {
            helpOpen: false
        };
    },
    computed: {
        carpoolearAppUrl() {
            return CARPOOLEAR_APP_URL;
        }
    }
};
</script>

<style scoped>
.qr-payment-help {
    margin-top: 0.75rem;
    text-align: left;
}

.qr-payment-help__toggle {
    background: none;
    border: none;
    padding: 0;
    color: #337ab7;
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit;
}

.qr-payment-help__content {
    margin-top: 0.75rem;
}

.qr-payment-help__title {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: #333;
}

.qr-payment-help__paragraph {
    margin: 0 0 0.75rem;
    line-height: 1.5;
    color: #333;
}
</style>
