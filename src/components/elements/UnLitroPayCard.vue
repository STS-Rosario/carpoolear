<template>
    <div class="un-litro-pay-card">
        <div class="un-litro-pay-card__trip">
            <div class="un-litro-pay-card__route">
                <strong>{{ tripRouteLabel }}</strong>
                <span class="un-litro-pay-card__badge">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    {{ $t('unLitroPendingPaymentBadge') }}
                </span>
            </div>
            <p class="un-litro-pay-card__when">{{ tripWhenLabel }}</p>
        </div>
        <div class="un-litro-pay-card__info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
            {{ $t('unLitroTripCreatedHidden') }}
        </div>
        <div class="un-litro-pay-card__amount">
            <div class="un-litro-pay-card__amount-copy">
                <h3>{{ $t('unLitroName') }}</h3>
                <p class="un-litro-pay-card__price">${{ formattedSelladoAmount }}</p>
            </div>
            <UnLitroInfoCard :charged="true" :free-trips-amount="freeTripsAmount" />
        </div>
        <p class="un-litro-pay-card__choose">
            {{ $t('unLitroChooseHowToPay') }}
        </p>
        <label
            class="un-litro-pay-method"
            :class="{
                'un-litro-pay-method--selected': selectedMethod === 'mercado_pago'
            }"
        >
            <input
                type="radio"
                :name="radioGroupName"
                value="mercado_pago"
                v-model="selectedMethod"
            />
            <span class="un-litro-pay-method__icon" aria-hidden="true">
                <i class="fa fa-credit-card"></i>
            </span>
            <span>
                <strong>{{ $t('unLitroPayMercadoPago') }}</strong>
                <em>{{ $t('unLitroPayMercadoPagoHint') }}</em>
            </span>
        </label>
        <label
            class="un-litro-pay-method"
            :class="{
                'un-litro-pay-method--selected': qrEnabled && selectedMethod === 'qr',
                'un-litro-pay-method--disabled': !qrEnabled
            }"
            data-testid="un-litro-pay-qr"
        >
            <input
                type="radio"
                :name="radioGroupName"
                value="qr"
                v-model="selectedMethod"
                :disabled="!qrEnabled"
            />
            <span class="un-litro-pay-method__icon" aria-hidden="true">
                <i class="fa fa-qrcode"></i>
            </span>
            <span>
                <strong>{{ $t('unLitroPayQr') }}</strong>
                <em>{{ $t('unLitroPayQrHint') }}</em>
            </span>
            <div
                v-if="qrEnabled && selectedMethod === 'qr' && showQrPanel"
                class="un-litro-pay-card__qr"
            >
                <p class="un-litro-pay-card__qr-instruction">
                    {{ $t('escaneáConAppMercadoPago') }}
                </p>
                <div v-if="qrImageUrl" class="un-litro-pay-card__qr-image-wrap">
                    <img :src="qrImageUrl" alt="QR" class="un-litro-pay-card__qr-image" />
                </div>
                <p v-else class="un-litro-pay-card__qr-loading">
                    {{ $t('cargando') }}...
                </p>
                <p class="un-litro-pay-card__qr-expiry">{{ $t('qrExpiraEn') }}</p>
                <ManualValidationQrPaymentHelp
                    computer-suffix-key="comoHacerPagoQRComputadoraSuffixUnLitro"
                />
            </div>
        </label>
        <div class="un-litro-pay-card__actions">
            <button
                type="button"
                class="un-litro-pay-card__later"
                data-testid="un-litro-pay-later"
                @click="onPayLater"
            >
                {{ $t('unLitroPayLater') }}
            </button>
            <AppButton
                variant="primary"
                class="un-litro-pay-card__pay"
                data-testid="un-litro-pay-now"
                :loading="loadingQr"
                :disabled="loadingQr"
                @click="onPayNow"
            >
                {{
                    $t('unLitroBannerPayAmount', {
                        amount: '$' + formattedSelladoAmount
                    })
                }}
            </AppButton>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode';
import { mapState } from 'pinia';
import UnLitroInfoCard from './UnLitroInfoCard.vue';
import ManualValidationQrPaymentHelp from '../sections/ManualValidationQrPaymentHelp.vue';
import AppButton from '../ui/AppButton.vue';
import { useAuthStore } from '../../stores/auth';
import dialogs from '../../services/dialogs.js';
import TripApi from '../../services/api/Trips.js';
import { selladoCheckoutUrl } from '../../utils/tripSelladoUi.js';
import { isSelladoPending } from '../../utils/tripSelladoDisplay.js';
import { formatPesoIntegerFromCents } from '../../utils/tripContributionDisplay.js';
import { openExternalUrl } from '../../utils/externalLink.js';
import dayjs from '../../dayjs';

function cityNameFromPoint(point) {
    if (!point) {
        return '';
    }
    const address = point.json_address || {};
    return address.ciudad || address.city || point.address || point.name || '';
}

export default {
    name: 'un-litro-pay-card',

    components: {
        UnLitroInfoCard,
        ManualValidationQrPaymentHelp,
        AppButton
    },

    props: {
        trip: {
            type: Object,
            required: true
        },
        qrEnabled: {
            type: Boolean,
            default: false
        },
        radioGroupName: {
            type: String,
            default: 'un-litro-pay-method'
        }
    },

    emits: ['pay-later', 'paid'],

    data() {
        return {
            selectedMethod: 'mercado_pago',
            showQrPanel: false,
            qrImageUrl: null,
            loadingQr: false,
            pollIntervalId: null
        };
    },

    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        formattedSelladoAmount() {
            return formatPesoIntegerFromCents(
                (this.config && this.config.module_trip_creation_payment_amount_cents) ||
                    0
            );
        },
        freeTripsAmount() {
            return (
                (this.config && this.config.module_trip_creation_payment_trips_threshold) ||
                0
            );
        },
        tripRouteLabel() {
            const points = this.trip.points || [];
            const origin = cityNameFromPoint(points[0]) || this.trip.from_town || '';
            const destination =
                cityNameFromPoint(points[points.length - 1]) || this.trip.to_town || '';
            return `${origin} → ${destination}`;
        },
        tripWhenLabel() {
            if (!this.trip.trip_date) {
                return '';
            }
            return `${dayjs(this.trip.trip_date).format('ddd, D MMM')} · ${dayjs(
                this.trip.trip_date
            ).format('HH:mm')} hs`;
        }
    },

    watch: {
        qrEnabled(enabled) {
            if (!enabled && this.selectedMethod === 'qr') {
                this.selectedMethod = 'mercado_pago';
                this.closeQrPanel();
            }
        }
    },

    beforeUnmount() {
        this.stopPolling();
    },

    methods: {
        createSelladoQrOrder() {
            const tripsApi = new TripApi();
            return tripsApi.createSelladoQrOrder(this.trip.id);
        },
        onPayNow() {
            if (this.selectedMethod === 'qr' && this.qrEnabled) {
                this.payWithQr();
                return;
            }
            const url = selladoCheckoutUrl(this.trip);
            if (url) {
                openExternalUrl(url);
                return;
            }
            dialogs.message(this.$t('errorAlGuardar'), {
                estado: 'error'
            });
        },
        async payWithQr() {
            this.loadingQr = true;
            try {
                const result = await this.createSelladoQrOrder();
                const data = result?.data || result;
                const qrData = data?.qr_data;
                if (!qrData) {
                    throw new Error('missing qr');
                }
                this.showQrPanel = true;
                this.qrImageUrl = null;
                QRCode.toDataURL(qrData, { width: 256, margin: 2 }, (err, url) => {
                    if (!err) {
                        this.qrImageUrl = url;
                    }
                });
                this.startPolling();
            } catch {
                dialogs.message(this.$t('errorAlGuardar'), {
                    estado: 'error'
                });
            } finally {
                this.loadingQr = false;
            }
        },
        onPayLater() {
            this.closeQrPanel();
            this.$emit('pay-later');
        },
        closeQrPanel() {
            this.showQrPanel = false;
            this.qrImageUrl = null;
            this.stopPolling();
        },
        startPolling() {
            this.stopPolling();
            this.pollIntervalId = setInterval(() => {
                this.pollTripPaid();
            }, 3000);
        },
        stopPolling() {
            if (this.pollIntervalId) {
                clearInterval(this.pollIntervalId);
                this.pollIntervalId = null;
            }
        },
        async pollTripPaid() {
            if (!this.trip?.id) {
                return;
            }
            try {
                const tripsApi = new TripApi();
                const result = await tripsApi.show(this.trip.id);
                const trip = result?.data || result;
                if (trip && !isSelladoPending(trip)) {
                    this.closeQrPanel();
                    this.$emit('paid', trip);
                }
            } catch {
                // Keep polling until the webhook marks the trip ready.
            }
        }
    }
};
</script>

<style scoped>
.un-litro-pay-card {
    max-width: 32rem;
    margin: 0 auto;
    text-align: left;
    background: transparent;
    container-type: inline-size;
    container-name: un-litro-pay;
}

.un-litro-pay-card__trip {
    margin-bottom: 0.85rem;
    padding: 0.85rem 1rem;
    border: 1px solid #e5e4e0;
    border-radius: 0.65rem;
}

.un-litro-pay-card__route {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.un-litro-pay-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: var(--ds-warning-bg, #ffecc8);
    color: var(--ds-warning-text, #262626);
    font-size: 0.8rem;
    font-weight: 700;
}

.un-litro-pay-card__when {
    margin: 0.4rem 0 0;
    color: var(--ds-text-secondary, #404040);
}

.un-litro-pay-card__info {
    display: flex;
    gap: 0.55rem;
    margin-bottom: 1rem;
    padding: 0.85rem 1rem;
    border-radius: 0.65rem;
    background: var(--ds-info-bg, #e1effa);
    color: var(--ds-text-primary, #22211f);
    line-height: 1.4;
}

.un-litro-pay-card__info i {
    margin-top: 0.15rem;
    color: var(--ds-action, #1e5f9e);
}

.un-litro-pay-card__amount {
    display: flex;
    flex-direction: column;
    gap: 0.75rem 1.25rem;
    margin-bottom: 1rem;
}

.un-litro-pay-card__amount h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    font-weight: 700;
}

.un-litro-pay-card__price {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.1;
}

.un-litro-pay-card__amount :deep(.un-litro-card) {
    margin: 0;
    padding: 0;
    min-width: 0;
    background: transparent;
}

.un-litro-pay-card__amount :deep(.un-litro-card__content) {
    min-width: 0;
}

.un-litro-pay-card__amount :deep(.un-litro-card__icon),
.un-litro-pay-card__amount :deep(.un-litro-card__title) {
    display: none;
}

.un-litro-pay-card__amount :deep(.un-litro-card__body) {
    margin: 0 0 0.35rem;
}

@container un-litro-pay (min-width: 28rem) {
    .un-litro-pay-card__amount {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }

    .un-litro-pay-card__amount-copy {
        flex: 0 1 10rem;
    }

    .un-litro-pay-card__amount :deep(.un-litro-card) {
        flex: 1 1 auto;
        max-width: 18rem;
    }
}

.un-litro-pay-card__choose {
    margin: 0 0 0.65rem;
    font-weight: 700;
}

.un-litro-pay-method {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.65rem;
    padding: 0.85rem 1rem;
    border: 1.5px solid #d9d7d2;
    border-radius: 0.65rem;
}

.un-litro-pay-method--selected {
    border-color: var(--ds-action, #1e5f9e);
    background: var(--ds-action-bg, #eef4fb);
}

.un-litro-pay-method--disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.un-litro-pay-method input {
    margin: 0;
}

.un-litro-pay-method__icon {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.45rem;
    background: var(--ds-action-bg, #eef4fb);
    color: var(--ds-action, #1e5f9e);
}

.un-litro-pay-method i {
    width: auto;
    text-align: center;
}

.un-litro-pay-method > span:not(.un-litro-pay-method__icon) {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.un-litro-pay-method em {
    font-style: normal;
    color: var(--ds-text-secondary, #404040);
    font-size: 0.9rem;
}

.un-litro-pay-card__qr {
    flex: 1 1 100%;
    margin-top: 0.5rem;
    text-align: center;
}

.un-litro-pay-card__qr-instruction {
    margin: 0 0 0.75rem;
    font-weight: 700;
    color: #22211f;
}

.un-litro-pay-card__qr-image-wrap {
    margin: 0.5rem 0;
}

.un-litro-pay-card__qr-image {
    max-width: 256px;
    height: auto;
}

.un-litro-pay-card__qr-loading,
.un-litro-pay-card__qr-expiry {
    color: #666;
}

.un-litro-pay-card__actions {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.85rem;
    margin-top: 0.75rem;
}

.un-litro-pay-card__pay {
    width: 100%;
}

.un-litro-pay-card__later {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0.35rem 0;
    border: 0;
    background: transparent;
    text-align: center;
    color: var(--ds-action, #1e5f9e);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
}

@container un-litro-pay (min-width: 28rem) {
    .un-litro-pay-card__actions {
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .un-litro-pay-card__pay {
        width: auto;
        min-width: 10.5rem;
    }

    .un-litro-pay-card__later {
        width: auto;
        padding: 0.35rem 0.75rem;
    }
}
</style>
