<template>
    <div class="trip-creation-success">
        <h2 class="trip-creation-success__title">{{ $t('tripCreationSuccessTitle') }}</h2>
        <div class="trip-creation-success__emoji" aria-hidden="true">🥳</div>
        <p class="trip-creation-success__heading">{{ $t('tripCreationSuccessAllSet') }}</p>
        <p class="trip-creation-success__prompt">{{ $t('tripCreationSuccessSharePrompt') }}</p>

        <div class="trip-creation-success__actions">
            <button
                type="button"
                class="btn btn-primary trip-creation-success__share"
                data-testid="trip-creation-share"
                @click="onShare"
            >
                <i class="fa fa-share-alt" aria-hidden="true"></i>
                {{ $t('tripCreationShareTrip') }}
            </button>
            <router-link
                :to="{ name: 'detail_trip', params: { id: trip.id } }"
                class="btn btn-default trip-creation-success__view"
                data-testid="trip-creation-view-trip"
            >
                {{ $t('tripCreationViewTrip') }}
            </router-link>
            <button
                v-if="!trip.is_passenger && !trip.parent_trip_id"
                type="button"
                class="btn btn-default trip-creation-success__return"
                data-testid="trip-creation-return-trip"
                @click="$emit('start-return-trip')"
            >
                {{ $t('cargarViajeRegreso') }}
            </button>
            <button
                v-if="canSaveTemplate"
                type="button"
                class="btn btn-default trip-creation-success__save-template"
                data-testid="trip-creation-save-template"
                @click="openSaveTemplateModal"
            >
                {{ $t('tripCreationSaveTemplate') }}
            </button>
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
                <div class="form-group text-left">
                    <label for="trip-creation-template-name">
                        {{ $t('tripCreationTemplateNameLabel') }}
                    </label>
                    <input
                        id="trip-creation-template-name"
                        v-model="templateName"
                        type="text"
                        class="form-control"
                        data-testid="trip-creation-template-name"
                    />
                </div>
            </template>
            <template #footer>
                <button
                    type="button"
                    class="btn btn-primary"
                    data-testid="trip-creation-template-save"
                    :disabled="!templateName.trim()"
                    @click="onSaveTemplate"
                >
                    {{ $t('guardar') }}
                </button>
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
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import { useAuthStore } from '../../stores/auth';
import { shareContent } from '../../utils/shareContent.js';
import { buildTripShareMessage } from '../../utils/tripShareMessage.js';
import {
    buildTripCreationTemplateFromSnapshot,
    saveTripCreationTemplate
} from '../../utils/tripCreationTemplate.js';

export default {
    name: 'trip-creation-success',

    components: {
        TripInviteFriends,
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
            templateName: ''
        };
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        canSaveTemplate() {
            return Boolean(
                this.creationSnapshot &&
                    this.user &&
                    this.user.id != null
            );
        }
    },

    methods: {
        tripUrl() {
            const route = this.$router.resolve({
                name: 'detail_trip',
                params: { id: this.trip.id }
            });
            return window.location.origin + route.href;
        },
        async onShare() {
            const url = this.tripUrl();
            const text = buildTripShareMessage({
                trip: this.trip,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });

            await shareContent({
                title: this.$t('tripCreationShareTrip'),
                text,
                url
            });
        },
        openSaveTemplateModal() {
            this.templateName = '';
            this.showSaveTemplateModal = true;
        },
        closeSaveTemplateModal() {
            this.showSaveTemplateModal = false;
            this.templateName = '';
        },
        onSaveTemplate() {
            const name = this.templateName.trim();
            if (!name || !this.canSaveTemplate) {
                return;
            }

            const template = buildTripCreationTemplateFromSnapshot(
                this.creationSnapshot
            );

            saveTripCreationTemplate(this.user.id, name, template)
                .then(() => {
                    this.closeSaveTemplateModal();
                    dialogs.message(this.$t('tripCreationTemplateSaved'), {
                        estado: 'success'
                    });
                })
                .catch(() => {
                    dialogs.message(this.$t('problemaAlCargarElViaje'), {
                        estado: 'error'
                    });
                });
        }
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
    margin-bottom: 0.5rem;
}

.trip-creation-success__prompt {
    margin-bottom: 1.5rem;
}

.trip-creation-success__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.trip-creation-success__actions .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;
}

.trip-creation-success__share i {
    margin-right: 0.35rem;
}

.trip-creation-success__invite {
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}
</style>
