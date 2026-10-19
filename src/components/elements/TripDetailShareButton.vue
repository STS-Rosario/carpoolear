<template>
    <div class="trip-detail__share">
        <AppButton
            variant="secondary"
            block
            data-testid="trip-detail-share"
            icon-left="fa fa-share-alt"
            @click="onShare"
        >
            {{ $t('tripCreationShareTrip') }}
        </AppButton>
        <div v-if="canInviteFriendsToTrip" class="trip-invite-friends-trigger">
            <span
                class="tooltip-bottom trip-invite-friends-trigger__tooltip"
                :data-tooltip="inviteFriendsSelladoTooltip"
            >
                <AppButton
                    variant="secondary"
                    block
                    data-testid="trip-detail-invite-friends"
                    :disabled="inviteFriendsBlockedByUnpaidSellado"
                    @click="showInviteFriendsModal = true"
                >
                    {{ $t('invitarAmigosAlViaje') }}
                </AppButton>
            </span>
        </div>
        <AppButton
            v-if="canSaveTemplate"
            variant="secondary"
            block
            class="trip-detail__save-template"
            data-testid="trip-detail-save-template"
            icon-left="fa fa-bookmark"
            @click="openSaveTemplateModal"
        >
            {{ $t('tripCreationSaveTemplate') }}
        </AppButton>
        <modal
            :name="'invite-friends-modal'"
            v-if="showInviteFriendsModal"
            @close="onInviteFriendsModalClose"
            :hideFooter="true"
        >
            <template #header>
                <h3>{{ $t('invitarAmigosAlViaje') }}</h3>
            </template>
            <template #body>
                <TripInviteFriends
                    :trip-id="trip.id"
                    @close="onInviteFriendsModalClose"
                />
            </template>
        </modal>
        <modal
            v-if="showSaveTemplateModal"
            @close="closeSaveTemplateModal"
        >
            <template #header>
                <h3>{{ $t('tripCreationSaveTemplateTitle') }}</h3>
            </template>
            <template #body>
                <p>{{ $t('tripCreationSaveTemplateBody') }}</p>
                <div class="trip-detail__save-template-form text-left color-black">
                    <AppInput
                        id="trip-detail-template-name"
                        data-testid="trip-detail-template-name"
                        v-model="templateName"
                        :label="$t('tripCreationTemplateNameLabel')"
                        @update:modelValue="onTemplateNameInput"
                    />
                    <div
                        v-if="hasExistingTemplates"
                        class="trip-detail__template-or"
                    >
                        {{ $t('tripCreationOr') }}
                    </div>
                    <AppField
                        v-if="hasExistingTemplates"
                        :label="$t('tripCreationReplaceTemplateLabel')"
                        label-for="trip-detail-template-replace"
                    >
                        <select
                            id="trip-detail-template-replace"
                            v-model="replaceTemplateName"
                            class="trip-detail__template-select"
                            data-testid="trip-detail-template-replace"
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
                    data-testid="trip-detail-template-save"
                    :disabled="!canConfirmSaveTemplate"
                    @click="onSaveTemplate"
                >
                    {{ $t('guardar') }}
                </AppButton>
            </template>
        </modal>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import modal from '../Modal';
import TripInviteFriends from '../sections/TripInviteFriends.vue';
import dialogs from '../../services/dialogs.js';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import { shareTripDetail } from '../../utils/tripDetailShare.js';
import { isUpcomingTrip } from '../../utils/isUpcomingTrip.js';
import { isInviteFriendsBlockedByUnpaidSellado } from '../../utils/tripSelladoDisplay.js';
import {
    buildTripCreationTemplateFromTrip,
    canSaveTripCreationTemplateName,
    listTripCreationTemplates,
    resolveTripCreationTemplateSaveName,
    saveTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';
import dayjs from '../../dayjs';

export default {
    name: 'TripDetailShareButton',

    components: {
        AppButton,
        AppField,
        AppInput,
        modal,
        TripInviteFriends
    },

    data() {
        return {
            showInviteFriendsModal: false,
            showSaveTemplateModal: false,
            templateName: '',
            replaceTemplateName: '',
            availableTemplates: []
        };
    },

    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user?.id;
        },
        canInviteFriendsToTrip() {
            return this.owner && this.trip && isUpcomingTrip(this.trip, dayjs);
        },
        inviteFriendsBlockedByUnpaidSellado() {
            return isInviteFriendsBlockedByUnpaidSellado(this.trip);
        },
        inviteFriendsSelladoTooltip() {
            return this.inviteFriendsBlockedByUnpaidSellado
                ? this.$t('invitarAmigosSelladoPendiente')
                : null;
        },
        canSaveTemplate() {
            return Boolean(this.owner && this.trip && this.user?.id);
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

    watch: {
        trip() {
            this.maybeOpenInviteFriendsFromQuery();
        }
    },

    mounted() {
        this.maybeOpenInviteFriendsFromQuery();
    },

    methods: {
        async onShare() {
            if (!this.trip) {
                return;
            }

            await shareTripDetail({
                trip: this.trip,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });
        },
        onInviteFriendsModalClose() {
            this.showInviteFriendsModal = false;
        },
        async refreshAvailableTemplates() {
            if (!this.user?.id) {
                this.availableTemplates = [];
                return;
            }

            try {
                this.availableTemplates = await listTripCreationTemplates(
                    this.user.id
                );
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

            const template = buildTripCreationTemplateFromTrip(this.trip);
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
        },
        maybeOpenInviteFriendsFromQuery() {
            if (
                !this.canInviteFriendsToTrip ||
                this.inviteFriendsBlockedByUnpaidSellado
            ) {
                return;
            }
            const query = this.$route && this.$route.query;
            if (!query || query.inviteFriends !== '1') {
                return;
            }
            this.showInviteFriendsModal = true;
            const nextQuery = { ...query };
            delete nextQuery.inviteFriends;
            this.$router.replace({ query: nextQuery });
        }
    }
};
</script>

<style scoped>
.trip-invite-friends-trigger,
.trip-invite-friends-trigger__tooltip {
    display: block;
    width: 100%;
    box-sizing: border-box;
}

.trip-invite-friends-trigger__tooltip {
    padding: 0;
}

.trip-invite-friends-trigger :deep(.app-button) {
    width: 100%;
}

.trip-detail__save-template-form label {
    color: #333;
}

.trip-detail__template-select {
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

.trip-detail__template-select:focus {
    outline: none;
}

.trip-detail__template-or {
    margin: 1rem 0;
    text-align: center;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
    color: #555;
}
</style>
