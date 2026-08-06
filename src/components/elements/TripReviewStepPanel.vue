<template>
    <div class="trip-review-step">
        <h3 class="new-trip-wizard__question">
            {{ $t('tripCreationStepLastDetailsTitle') }}
        </h3>
        <p class="trip-review-step__subtitle label-soft">
            {{ $t('tripCreationStepLastDetailsSubtitle') }}
        </p>

        <section class="trip-review-step__section">
            <div class="trip-review-step__section-header">
                <h4 class="trip-review-step__section-title">
                    {{ $t('tripReviewSectionRoute') }}
                </h4>
                <button
                    type="button"
                    class="trip-review-step__edit"
                    @click="onEdit('route')"
                >
                    {{ $t('tripReviewEdit') }}
                </button>
            </div>
            <ul class="trip-review-step__route">
                <li
                    v-for="(point, index) in routePoints"
                    :key="`${point.kind}-${index}`"
                    class="trip-review-step__route-item"
                    :class="`trip-review-step__route-item--${point.kind}`"
                >
                    {{ formatRouteLine(point, index) }}
                </li>
            </ul>
            <div v-if="dateLabel || timeLabel" class="trip-review-step__chips">
                <span v-if="dateLabel" class="trip-review-step__chip">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    {{ dateLabel }}
                </span>
                <span v-if="timeLabel" class="trip-review-step__chip">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    {{ timeLabel }}
                </span>
            </div>
        </section>

        <section v-if="showVehicle" class="trip-review-step__section">
            <div class="trip-review-step__section-header">
                <h4 class="trip-review-step__section-title">
                    {{ $t('tripReviewSectionVehicle') }}
                </h4>
                <button
                    type="button"
                    class="trip-review-step__edit"
                    @click="onEdit('vehicle')"
                >
                    {{ $t('tripReviewEdit') }}
                </button>
            </div>
            <p class="trip-review-step__vehicle">
                <i class="fa fa-car" aria-hidden="true"></i>
                {{ vehicleLabel }}
            </p>
        </section>

        <section class="trip-review-step__section">
            <div class="trip-review-step__section-header">
                <h4 class="trip-review-step__section-title">
                    {{ $t('tripReviewSectionSeats') }}
                </h4>
                <button
                    type="button"
                    class="trip-review-step__edit"
                    @click="onEdit('seats')"
                >
                    {{ $t('tripReviewEdit') }}
                </button>
            </div>
            <span class="trip-review-step__seats-pill">
                <i class="fa fa-users" aria-hidden="true"></i>
                {{ seatsLabel }}
            </span>
        </section>

        <section v-if="showContribution" class="trip-review-step__section">
            <div class="trip-review-step__section-header">
                <h4 class="trip-review-step__section-title">
                    {{ $t('tripReviewSectionContribution') }}
                </h4>
                <button
                    type="button"
                    class="trip-review-step__edit"
                    @click="onEdit('contribution')"
                >
                    {{ $t('tripReviewEdit') }}
                </button>
            </div>
            <p class="trip-review-step__price">${{ formattedPrice }}</p>
            <p class="trip-review-step__price-caption label-soft">
                {{ $t('tripReviewContributionPerPerson') }}
            </p>
        </section>

        <section class="trip-review-step__section">
            <div class="trip-review-step__section-header">
                <h4 class="trip-review-step__section-title">
                    {{ $t('tripReviewSectionPreferences') }}
                </h4>
                <button
                    type="button"
                    class="trip-review-step__edit"
                    @click="onEdit('preferences')"
                >
                    {{ $t('tripReviewEdit') }}
                </button>
            </div>
            <div class="trip-review-step__pref-tags">
                <span
                    v-for="tag in preferenceTags"
                    :key="tag.key"
                    class="trip-review-step__pref-tag"
                    :class="{
                        'trip-review-step__pref-tag--yes': tag.allowed,
                        'trip-review-step__pref-tag--no': !tag.allowed
                    }"
                >
                    {{ preferenceTagLabel(tag) }}
                </span>
            </div>
        </section>

        <div
            v-if="showNoLucrar"
            class="trip-review-step__nolucrar"
            :class="{ 'has-error': Boolean(noLucrarError) }"
        >
            <label class="trip-review-step__nolucrar-row">
                <input
                    type="checkbox"
                    class="trip-review-step__nolucrar-input"
                    :checked="noLucrar"
                    @change="$emit('update:noLucrar', $event.target.checked)"
                />
                <span>
                    <strong>{{ $t('meComprometo') }}</strong>
                    <span class="trip-review-step__nolucrar-lead">
                        {{ $t('tripReviewNoLucrarLead') }}
                        <button
                            type="button"
                            class="trip-review-step__more-info"
                            @click.prevent="showNoLucrarModal = true"
                        >
                            {{ $t('tripReviewMoreInfo') }}
                        </button>
                    </span>
                </span>
            </label>
            <span class="error" v-if="noLucrarError">{{ noLucrarError }}</span>
        </div>

        <modal
            v-if="showNoLucrarModal"
            @close="showNoLucrarModal = false"
        >
            <template #header>
                <h3>{{ $t('tripReviewNoLucrarModalTitle') }}</h3>
            </template>
            <template #body>
                <div
                    class="trip-review-step__modal-body text-left color-black"
                    v-html="$t('tripReviewNoLucrarModalBody')"
                ></div>
            </template>
            <template #footer>
                <AppButton variant="secondary" @click="showNoLucrarModal = false">
                    {{ $t('cerrar') }}
                </AppButton>
            </template>
        </modal>
    </div>
</template>

<script>
import modal from '../Modal';
import AppButton from '../ui/AppButton.vue';
import {
    buildTripReviewPreferenceTags,
    formatTripReviewPrice,
    getTripReviewEditStep,
    getTripReviewRoutePoints
} from '../../utils/tripReviewDisplay.js';

const PREF_LABEL_KEYS = {
    kids: 'tripReviewPrefKids',
    smoking: 'tripReviewPrefSmoking',
    pets: 'tripReviewPrefPets'
};

export default {
    name: 'trip-review-step-panel',

    components: {
        modal,
        AppButton
    },

    props: {
        points: { type: Array, default: () => [] },
        puntoPartida: { type: String, default: '' },
        puntoLlegada: { type: String, default: '' },
        dateLabel: { type: String, default: '' },
        timeLabel: { type: String, default: '' },
        showVehicle: { type: Boolean, default: false },
        vehicleLabel: { type: String, default: '' },
        seatsCount: { type: [Number, String], default: 0 },
        showContribution: { type: Boolean, default: false },
        price: { type: [Number, String], default: '' },
        allowKids: { type: Boolean, default: false },
        allowSmoking: { type: Boolean, default: false },
        allowAnimals: { type: Boolean, default: false },
        showNoLucrar: { type: Boolean, default: false },
        noLucrar: { type: Boolean, default: false },
        noLucrarError: { type: String, default: '' }
    },

    emits: ['edit', 'update:noLucrar'],

    data() {
        return {
            showNoLucrarModal: false
        };
    },

    computed: {
        routePoints() {
            return getTripReviewRoutePoints(this.points);
        },
        seatsLabel() {
            return this.$t('tripReviewSeatsCount', {
                count: this.seatsCount
            });
        },
        formattedPrice() {
            return formatTripReviewPrice(this.price);
        },
        preferenceTags() {
            return buildTripReviewPreferenceTags({
                allowKids: this.allowKids,
                allowSmoking: this.allowSmoking,
                allowAnimals: this.allowAnimals
            });
        }
    },

    methods: {
        getTripReviewEditStep,
        onEdit(section) {
            const step = getTripReviewEditStep(section);
            if (step != null) {
                this.$emit('edit', step);
            }
        },
        formatRouteLine(point, index) {
            const detail =
                index === 0
                    ? this.puntoPartida
                    : index === this.routePoints.length - 1
                        ? this.puntoLlegada
                        : '';
            const name = point.name || '';
            if (name && detail) {
                return `${name}, ${detail}`;
            }
            return name || detail;
        },
        preferenceTagLabel(tag) {
            const labelKey = PREF_LABEL_KEYS[tag.key];
            const state = tag.allowed
                ? this.$t('tripReviewYes')
                : this.$t('tripReviewNo');
            return `${this.$t(labelKey)}: ${state}`;
        }
    }
};
</script>

<style scoped>
.trip-review-step__subtitle {
    margin: 0 0 1.25rem;
}

.trip-review-step__section {
    padding: 1rem 0;
    border-bottom: 1px solid #e8e8e8;
}

.trip-review-step__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.trip-review-step__section-title {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8a8a8a;
}

.trip-review-step__edit {
    border: 0;
    background: transparent;
    color: var(--ds-action, #1e5f9e);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
}

.trip-review-step__route {
    list-style: none;
    margin: 0;
    padding: 0 0 0 0.85rem;
    border-left: 2px solid var(--ds-action, #1e5f9e);
}

.trip-review-step__route-item {
    position: relative;
    margin: 0 0 0.65rem;
    padding-left: 0.85rem;
    color: #22211f;
    font-weight: 600;
    line-height: 1.35;
}

.trip-review-step__route-item::before {
    content: '';
    position: absolute;
    left: -1.1rem;
    top: 0.35rem;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    border: 2px solid var(--ds-action, #1e5f9e);
    background: #fff;
}

.trip-review-step__route-item--destination::before {
    background: var(--ds-action, #1e5f9e);
}

.trip-review-step__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.trip-review-step__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.75rem;
    border-radius: 0.65rem;
    background: #f0f0f0;
    color: #404040;
    font-size: 0.9rem;
}

.trip-review-step__vehicle {
    margin: 0;
    font-weight: 700;
    color: #22211f;
}

.trip-review-step__vehicle .fa {
    margin-right: 0.4rem;
    color: var(--ds-action, #1e5f9e);
}

.trip-review-step__seats-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    background: #ffe7a8;
    color: #5a4300;
    font-weight: 700;
}

.trip-review-step__price {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #22211f;
}

.trip-review-step__price-caption {
    margin: 0.15rem 0 0;
}

.trip-review-step__pref-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.trip-review-step__pref-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    background: #f3f3f3;
    color: #404040;
    font-size: 0.85rem;
    font-weight: 600;
}

.trip-review-step__nolucrar {
    margin-top: 1.25rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #eef5fb;
}

.trip-review-step__nolucrar.has-error {
    outline: 1px solid #c0392b;
}

.trip-review-step__nolucrar-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    cursor: pointer;
}

.trip-review-step__nolucrar-input {
    margin-top: 0.2rem;
}

.trip-review-step__nolucrar-lead {
    display: block;
    margin-top: 0.35rem;
    color: #404040;
    font-weight: 400;
    line-height: 1.4;
}

.trip-review-step__more-info {
    border: 0;
    background: transparent;
    color: var(--ds-action, #1e5f9e);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
}

.trip-review-step__modal-body :deep(p) {
    margin: 0 0 0.85rem;
    line-height: 1.45;
}
</style>
