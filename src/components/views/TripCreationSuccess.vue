<template>
    <div class="trip-creation-success">
        <template v-if="showUnLitroPayment">
            <h2 class="trip-creation-success__title">
                {{ $t('unLitroPublishTitle') }}
            </h2>
            <UnLitroPayCard
                :trip="trip"
                :qr-enabled="qrEnabled"
                @pay-later="goToTrip"
                @paid="onSelladoPaid"
            />
        </template>
        <template v-else>
            <h2 class="trip-creation-success__title">{{ $t('tripCreationSuccessTitle') }}</h2>
            <div class="trip-creation-success__emoji" aria-hidden="true">🥳</div>
            <p class="trip-creation-success__heading">{{ $t('tripCreationSuccessAllSet') }}</p>
            <div v-if="unLitroKind" class="trip-creation-success__un-litro">
                <h4 class="trip-creation-success__un-litro-title">
                    {{ $t('unLitroSectionTitle') }}
                </h4>
                <UnLitroInfoCard
                    :charged="unLitroKind === 'charged'"
                    :complimentary="unLitroKind === 'complimentary'"
                    :bonificado="unLitroKind === 'bonificado'"
                    :free-trips-amount="freeTripsAmount"
                />
            </div>
        </template>

        <div
            v-if="!showUnLitroPayment"
            class="trip-creation-success__actions"
        >
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

        <div
            v-if="!showUnLitroPayment"
            class="trip-creation-success__invite"
        >
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
import UnLitroPayCard from '../elements/UnLitroPayCard.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import { useAuthStore } from '../../stores/auth';
import { shareTripDetail } from '../../utils/tripDetailShare.js';
import { isSelladoPending } from '../../utils/tripSelladoDisplay.js';
import {
    isTripCreationPaymentQrEnabled,
    unLitroCardKindFromTrip
} from '../../utils/tripSelladoUi.js';
import {
    buildTripCreationTemplateFromSnapshot,
    canSaveTripCreationTemplateName,
    listTripCreationTemplates,
    resolveTripCreationTemplateSaveName,
    saveTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';

export default {
    name: 'trip-creation-success',

    components: {
        TripInviteFriends,
        UnLitroInfoCard,
        UnLitroPayCard,
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
        },
        hasComplimentarySellado: {
            type: Boolean,
            default: false
        }
    },

    emits: ['start-return-trip', 'paid'],

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
        qrEnabled() {
            return isTripCreationPaymentQrEnabled(this.config);
        },
        unLitroKind() {
            return unLitroCardKindFromTrip(this.trip, {
                selladoEnabled:
                    this.config && this.config.module_trip_creation_payment_enabled,
                hasComplimentarySellado: this.hasComplimentarySellado
            });
        },
        freeTripsAmount() {
            return (this.config && this.config.module_trip_creation_payment_trips_threshold) || 0;
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
        goToTrip() {
            this.$router.push({ name: 'detail_trip', params: { id: this.trip.id } });
        },
        onSelladoPaid(trip) {
            this.$emit('paid', trip);
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

.trip-creation-success:has(.un-litro-pay-card) {
    text-align: left;
}

.trip-creation-success:has(.un-litro-pay-card) .trip-creation-success__title {
    color: var(--ds-action, #1e5f9e);
    text-align: center;
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

.trip-creation-success__un-litro {
    max-width: 500px;
    margin: 0 auto 1.5rem;
    text-align: left;
}

.trip-creation-success :deep(.un-litro-pay-card) {
    margin-bottom: 2rem;
}

.trip-creation-success__un-litro-title {
    margin: 0 0 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8a8a8a;
}

.trip-creation-success__un-litro :deep(.un-litro-card) {
    margin-bottom: 0;
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

</style>
