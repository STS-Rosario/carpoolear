<template>
    <div class="trip-creation-draft" v-if="hasDraft">
        <div class="trip-creation-draft-card">
            <div class="trip-creation-draft-card__body">
                <div class="trip-creation-draft-card__title">
                    {{ $t('tripCreationIncompleteTitle') }}
                </div>
                <p class="trip-creation-draft-card__text">
                    {{ $t('tripCreationIncompleteBody') }}
                </p>
                <div class="trip-creation-draft-card__actions">
                    <router-link
                        :to="{ name: 'new-trip', query: { resumeDraft: '1' } }"
                        class="btn btn-primary btn-sm"
                    >
                        {{ $t('continuar') }}
                    </router-link>
                    <button
                        type="button"
                        class="btn btn-default btn-sm"
                        @click="onDelete"
                    >
                        {{ $t('eliminar') }}
                    </button>
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

export default {
    name: 'trip-creation-draft-card',

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        hasDraft() {
            if (!this.user || this.user.id == null) {
                return false;
            }
            return hasTripCreationDraft(this.user.id);
        }
    },

    methods: {
        onDelete() {
            if (this.user && this.user.id != null) {
                clearTripCreationDraft(this.user.id);
            }
            this.$forceUpdate();
        }
    }
};
</script>

<style scoped>
.trip-creation-draft {
    margin: 0 auto 1.25rem;
    max-width: 500px;
}

.trip-creation-draft-card {
    padding: 1rem 1.1rem;
    border-radius: 16px;
    background: #f5f5f5;
}

.trip-creation-draft-card__title {
    font-weight: 700;
    margin-bottom: 0.35rem;
}

.trip-creation-draft-card__text {
    margin-bottom: 0.85rem;
    color: #555;
}

.trip-creation-draft-card__actions {
    display: flex;
    gap: 0.5rem;
}
</style>
