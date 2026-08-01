<template>
    <div class="trip-creation-draft" v-if="draftVisible">
        <div class="trip-creation-draft-card trip-creation-draft-card--info">
            <div class="trip-creation-draft-card__icon" aria-hidden="true">
                <i class="fa fa-info-circle"></i>
            </div>
            <div class="trip-creation-draft-card__body">
                <div class="trip-creation-draft-card__title">
                    {{ $t('tripCreationIncompleteTitle') }}
                </div>
                <p class="trip-creation-draft-card__text">
                    {{ $t('tripCreationIncompleteBody') }}
                </p>
                <div class="trip-creation-draft-card__actions">
                    <AppButton
                        variant="primary"
                        size="sm"
                        :to="{ name: 'new-trip', query: { resumeDraft: '1' } }"
                    >
                        {{ $t('continuar') }}
                    </AppButton>
                    <AppButton
                        variant="danger"
                        size="sm"
                        icon-left="fa fa-trash-o"
                        @click="onDelete"
                    >
                        {{ $t('eliminar') }}
                    </AppButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import {
    clearTripCreationDraft,
    hasTripCreationDraft
} from '../../utils/tripCreationDraft.js';
import bus from '../../services/bus-event.js';
import AppButton from '../ui/AppButton.vue';

export default {
    name: 'trip-creation-draft-card',

    components: {
        AppButton
    },

    data() {
        return {
            draftVisible: false
        };
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        })
    },

    mounted() {
        this.refresh();
        bus.on('trip-creation-draft-changed', this.refresh);
    },

    activated() {
        this.refresh();
    },

    beforeUnmount() {
        bus.off('trip-creation-draft-changed', this.refresh);
    },

    methods: {
        refresh() {
            if (!this.user || this.user.id == null) {
                this.draftVisible = false;
                return;
            }

            this.draftVisible = hasTripCreationDraft(this.user.id);
        },
        onDelete() {
            if (this.user && this.user.id != null) {
                clearTripCreationDraft(this.user.id);
            }
            this.refresh();
        }
    }
};
</script>

<style scoped>
.trip-creation-draft {
    margin: 0 auto 1.25rem;
    max-width: 500px;
}

.trip-creation-draft-card--info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    box-sizing: border-box;
    padding: 0.85rem 1rem;
    border: 1px solid var(--ds-action-border, #1e5f9e);
    border-radius: 0.5rem;
    background: var(--ds-info-bg, #e1effa);
    color: var(--ds-text-primary, #22211f);
}

.trip-creation-draft-card__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.1rem;
    color: var(--ds-info-solid, #1e5f9e);
    font-size: 1.35rem;
    line-height: 1;
}

.trip-creation-draft-card__body {
    flex: 1 1 auto;
    min-width: 0;
}

.trip-creation-draft-card__title {
    margin: 0 0 0.2rem;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.25;
    color: var(--ds-info-solid, #1e5f9e);
}

.trip-creation-draft-card__text {
    margin: 0 0 0.85rem;
    font-size: 0.9rem;
    line-height: 1.35;
    color: var(--ds-text-secondary, #404040);
}

.trip-creation-draft-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
</style>
