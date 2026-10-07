<template>
    <div class="trip-creation-success">
        <template v-if="showUnLitroPayment">
            <h2 class="trip-creation-success__title">
                {{ $t('unLitroPublishTitle') }}
            </h2>
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
                    <h3>{{ $t('unLitroName') }}</h3>
                    <p class="un-litro-pay-card__price">
                        ${{ formattedSelladoAmount }}
                    </p>
                    <UnLitroInfoCard
                        :charged="true"
                        :free-trips-amount="freeTripsAmount"
                    />
                </div>
                <p class="un-litro-pay-card__choose">
                    {{ $t('unLitroChooseHowToPay') }}
                </p>
                <label class="un-litro-pay-method un-litro-pay-method--selected">
                    <input
                        type="radio"
                        name="un-litro-pay-method"
                        value="mercado_pago"
                        checked
                    />
                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                    <span>
                        <strong>{{ $t('unLitroPayMercadoPago') }}</strong>
                        <em>{{ $t('unLitroPayMercadoPagoHint') }}</em>
                    </span>
                </label>
                <label
                    class="un-litro-pay-method un-litro-pay-method--disabled"
                    data-testid="un-litro-pay-qr"
                >
                    <input type="radio" name="un-litro-pay-method" value="qr" disabled />
                    <i class="fa fa-qrcode" aria-hidden="true"></i>
                    <span>
                        <strong>{{ $t('unLitroPayQr') }}</strong>
                        <em>{{ $t('unLitroPayQrHint') }}</em>
                    </span>
                </label>
                <AppButton
                    variant="primary"
                    block
                    class="un-litro-pay-card__pay"
                    data-testid="un-litro-pay-now"
                    @click="onPayNow"
                >
                    {{ $t('unLitroPayOneLiter') }}
                </AppButton>
                <router-link
                    class="un-litro-pay-card__later"
                    data-testid="un-litro-pay-later"
                    :to="{ name: 'detail_trip', params: { id: trip.id } }"
                >
                    {{ $t('unLitroPayLater') }}
                </router-link>
            </div>
        </template>
        <template v-else>
            <h2 class="trip-creation-success__title">{{ $t('tripCreationSuccessTitle') }}</h2>
            <div class="trip-creation-success__emoji" aria-hidden="true">🥳</div>
            <p class="trip-creation-success__heading">{{ $t('tripCreationSuccessAllSet') }}</p>
        </template>

        <div class="trip-creation-success__actions">
            <AppButton
                variant="primary"
                block
                class="trip-creation-success__view"
                data-testid="trip-creation-view-trip"
                :to="{ name: 'detail_trip', params: { id: trip.id } }"
            >
                {{ $t('tripCreationViewTrip') }}
            </AppButton>
            <AppButton
                variant="secondary"
                block
                class="trip-creation-success__share"
                data-testid="trip-creation-share"
                icon-left="fa fa-share-alt"
                @click="onShare"
            >
                {{ $t('tripCreationShareTrip') }}
            </AppButton>
            <AppButton
                v-if="!trip.is_passenger && !trip.parent_trip_id"
                variant="secondary"
                block
                class="trip-creation-success__return"
                data-testid="trip-creation-return-trip"
                icon-left="fa fa-arrow-left"
                @click="$emit('start-return-trip')"
            >
                {{ $t('cargarViajeRegreso') }}
            </AppButton>
            <AppButton
                v-if="canSaveTemplate"
                variant="secondary"
                block
                class="trip-creation-success__save-template"
                data-testid="trip-creation-save-template"
                icon-left="fa fa-bookmark"
                @click="openSaveTemplateModal"
            >
                {{ $t('tripCreationSaveTemplate') }}
            </AppButton>
        </div>

        <modal
            v-if="showSaveTemplateModal"
            @close="closeSaveTemplateModal"
        >
            <template #header>
                <h3>{{ $t('tripCreationSaveTemplateTitle') }}</h3>
            </template>
            <template #body>
                <p>{{ $t('tripCreationSaveTemplateBody') }}</p>
                <div class="trip-creation-success__save-template-form text-left color-black">
                    <AppInput
                        id="trip-creation-template-name"
                        data-testid="trip-creation-template-name"
                        v-model="templateName"
                        :label="$t('tripCreationTemplateNameLabel')"
                        @update:modelValue="onTemplateNameInput"
                    />
                    <div
                        v-if="hasExistingTemplates"
                        class="trip-creation-success__template-or"
                    >
                        {{ $t('tripCreationOr') }}
                    </div>
                    <AppField
                        v-if="hasExistingTemplates"
                        :label="$t('tripCreationReplaceTemplateLabel')"
                        label-for="trip-creation-template-replace"
                    >
                        <select
                            id="trip-creation-template-replace"
                            v-model="replaceTemplateName"
                            class="trip-creation-success__template-select"
                            data-testid="trip-creation-template-replace"
                            @change="onReplaceTemplateChange"
                        >
                            <option disabled value="">
                                {{ $t('tripCreationChooseTemplatePlaceholder') }}
                            </option>
                            <option
                                v-for="template in availableTemplates"
                                :key="template.name"
                                :value="template.name"
                            >
                                {{ template.name }}
                            </option>
                        </select>
                    </AppField>
                </div>
            </template>
            <template #footer>
                <AppButton
                    variant="primary"
                    data-testid="trip-creation-template-save"
                    :disabled="!canConfirmSaveTemplate"
                    @click="onSaveTemplate"
                >
                    {{ $t('guardar') }}
                </AppButton>
            </template>
        </modal>

        <div class="trip-creation-success__invite">
            <TripInviteFriends
                :trip-id="trip.id"
                close-behavior="trip-detail"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import TripInviteFriends from '../sections/TripInviteFriends.vue';
import UnLitroInfoCard from '../elements/UnLitroInfoCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import { useAuthStore } from '../../stores/auth';
import { shareTripDetail } from '../../utils/tripDetailShare.js';
import { isSelladoPending } from '../../utils/tripSelladoDisplay.js';
import { selladoCheckoutUrl } from '../../utils/tripSelladoUi.js';
import { formatPesoIntegerFromCents } from '../../utils/tripContributionDisplay.js';
import { openExternalUrl } from '../../utils/externalLink.js';
import dayjs from '../../dayjs';
import {
    buildTripCreationTemplateFromSnapshot,
    canSaveTripCreationTemplateName,
    listTripCreationTemplates,
    resolveTripCreationTemplateSaveName,
    saveTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';

function cityNameFromPoint(point) {
    if (!point) {
        return '';
    }
    const address = point.json_address || {};
    return address.ciudad || address.city || point.address || point.name || '';
}

export default {
    name: 'trip-creation-success',

    components: {
        TripInviteFriends,
        UnLitroInfoCard,
        AppButton,
        AppField,
        AppInput,
        modal
    },

    props: {
        trip: {
            type: Object,
            required: true
        },
        creationSnapshot: {
            type: Object,
            default: null
        }
    },

    emits: ['start-return-trip'],

    data() {
        return {
            showSaveTemplateModal: false,
            templateName: '',
            replaceTemplateName: '',
            availableTemplates: []
        };
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        showUnLitroPayment() {
            return isSelladoPending(this.trip);
        },
        formattedSelladoAmount() {
            return formatPesoIntegerFromCents(
                (this.config && this.config.module_trip_creation_payment_amount_cents) ||
                    0
            );
        },
        freeTripsAmount() {
            return (this.config && this.config.module_trip_creation_payment_trips_threshold) || 0;
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
        },
        canSaveTemplate() {
            const userId = this.user?.id;
            return Boolean(
                this.creationSnapshot &&
                    userId != null &&
                    userId !== ''
            );
        },
        hasExistingTemplates() {
            return this.availableTemplates.length > 0;
        },
        canConfirmSaveTemplate() {
            return canSaveTripCreationTemplateName({
                newName: this.templateName,
                replaceName: this.replaceTemplateName
            });
        }
    },

    methods: {
        onPayNow() {
            const url = selladoCheckoutUrl(this.trip);
            if (url) {
                openExternalUrl(url);
                return;
            }
            dialogs.message(this.$t('errorAlGuardar'), {
                estado: 'error'
            });
        },
        async onShare() {
            await shareTripDetail({
                trip: this.trip,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });
        },
        async refreshAvailableTemplates() {
            if (!this.user?.id) {
                this.availableTemplates = [];
                return;
            }

            try {
                this.availableTemplates = await listTripCreationTemplates(this.user.id);
            } catch {
                this.availableTemplates = [];
            }
        },
        openSaveTemplateModal() {
            this.templateName = '';
            this.replaceTemplateName = '';
            this.showSaveTemplateModal = true;
            this.refreshAvailableTemplates();
        },
        closeSaveTemplateModal() {
            this.showSaveTemplateModal = false;
            this.templateName = '';
            this.replaceTemplateName = '';
            this.availableTemplates = [];
        },
        onTemplateNameInput() {
            if (this.templateName.trim()) {
                this.replaceTemplateName = '';
            }
        },
        onReplaceTemplateChange() {
            if (this.replaceTemplateName) {
                this.templateName = '';
            }
        },
        async onSaveTemplate() {
            const name = resolveTripCreationTemplateSaveName({
                newName: this.templateName,
                replaceName: this.replaceTemplateName
            });
            if (!name || !this.canSaveTemplate) {
                return;
            }

            const template = buildTripCreationTemplateFromSnapshot(
                this.creationSnapshot
            );
            if (!template) {
                dialogs.message(this.$t('errorAlGuardar'), {
                    estado: 'error'
                });
                return;
            }

            try {
                await saveTripCreationTemplate(this.user.id, name, template);
                this.closeSaveTemplateModal();
                dialogs.message(this.$t('tripCreationTemplateSaved'), {
                    estado: 'success'
                });
            } catch {
                dialogs.message(this.$t('errorAlGuardar'), {
                    estado: 'error'
                });
            }
        }
    },

    mounted() {
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
.trip-creation-success {
    text-align: center;
    padding: 1rem 0 2rem;
}

@media (max-width: 767px) {
    .trip-creation-success {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

.trip-creation-success__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.trip-creation-success__emoji {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 1rem;
}

.trip-creation-success__heading {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.trip-creation-success__actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: center;
    align-items: stretch;
    max-width: 500px;
    margin: 0 auto 2rem;
}

.trip-creation-success__actions .app-button {
    width: 100%;
    box-sizing: border-box;
}

.trip-creation-success__invite {
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}

.trip-creation-success__save-template-form label {
    color: #333;
}

.trip-creation-success__template-select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.trip-creation-success__template-select:focus {
    outline: none;
}

.trip-creation-success__template-or {
    margin: 1rem 0;
    text-align: center;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
    color: #555;
}

.un-litro-pay-card {
    max-width: 500px;
    margin: 0 auto 2rem;
    padding: 1rem;
    text-align: left;
    background: var(--ds-neutral-bg, #fff);
    border: 1px solid #e5e4e0;
    border-radius: 0.75rem;
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

.un-litro-pay-card__amount h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    font-weight: 700;
}

.un-litro-pay-card__price {
    margin: 0 0 0.75rem;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.1;
}

.un-litro-pay-card__amount :deep(.un-litro-card) {
    margin: 0 0 1rem;
    padding: 0;
    background: transparent;
}

.un-litro-pay-card__amount :deep(.un-litro-card__icon),
.un-litro-pay-card__amount :deep(.un-litro-card__title) {
    display: none;
}

.un-litro-pay-card__choose {
    margin: 0 0 0.65rem;
    font-weight: 700;
}

.un-litro-pay-method {
    display: flex;
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

.un-litro-pay-method i {
    width: 1.25rem;
    text-align: center;
    color: var(--ds-action, #1e5f9e);
}

.un-litro-pay-method span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.un-litro-pay-method em {
    font-style: normal;
    color: var(--ds-text-secondary, #404040);
    font-size: 0.9rem;
}

.un-litro-pay-card__pay {
    margin-top: 0.5rem;
}

.un-litro-pay-card__later {
    display: block;
    margin-top: 0.85rem;
    text-align: center;
    color: var(--ds-action, #1e5f9e);
    font-weight: 700;
}
</style>
