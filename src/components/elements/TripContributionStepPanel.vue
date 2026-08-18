<template>
    <div class="trip-contribution-step">
        <h3 class="new-trip-wizard__question">
            {{ $t('tripCreationStepContributionQuestion') }}
        </h3>
        <p class="trip-contribution-step__subtitle label-soft">
            {{ $t('tripCreationStepContributionSubtitle') }}
        </p>

        <div
            class="trip-contribution-step__amount"
            :class="{ 'has-error': Boolean(priceError) }"
        >
            <span class="trip-contribution-step__currency" aria-hidden="true"
                >$</span
            >
            <input
                type="number"
                min="0"
                step="0.01"
                class="trip-contribution-step__input"
                :value="price"
                :aria-label="$t('tripCreationStepContributionQuestion')"
                @input="$emit('update:price', $event.target.value)"
            />
            <span class="trip-contribution-step__suffix">{{
                $t('tripContributionPerPerson')
            }}</span>
        </div>
        <span class="error" v-if="priceError">{{ priceError }}</span>

        <button
            type="button"
            class="trip-contribution-step__suggested"
            :class="{
                'trip-contribution-step__suggested--expanded': suggestedExpanded
            }"
            @click="toggleSuggested"
        >
            <span class="trip-contribution-step__suggested-main">
                {{
                    $t('tripContributionSuggested', {
                        amount: suggestedAmountLabel
                    })
                }}
            </span>
            <i
                class="fa"
                :class="
                    suggestedExpanded ? 'fa-chevron-down' : 'fa-chevron-left'
                "
                aria-hidden="true"
            ></i>
            <div
                v-if="suggestedExpanded"
                class="trip-contribution-step__suggested-body"
            >
                <strong>{{ $t('tripContributionHowCalculated') }}</strong>
                <p>{{ suggestedDescription }}</p>
            </div>
        </button>

        <div class="trip-contribution-step__important">
            <div class="trip-contribution-step__important-title">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <strong>{{ $t('tripContributionImportantTitle') }}</strong>
            </div>
            <div
                class="trip-contribution-step__important-body"
                v-html="$t('tripContributionImportantBody')"
            ></div>
            <p class="trip-contribution-step__important-explainer">
                {{ $t('tripContributionDivisionExplainerPrefix') }}<router-link :to="{ name: 'division_de_gastos' }">{{ $t('tripContributionDivisionExplainerLink') }}</router-link>{{ $t('tripContributionDivisionExplainerSuffix') }}
            </p>
        </div>
    </div>
</template>

<script>
import { formatContributionDisplayAmount } from '../../utils/tripContributionDisplay.js';

export default {
    name: 'trip-contribution-step-panel',

    props: {
        price: {
            type: [String, Number],
            default: ''
        },
        recommendedSeatPriceCents: {
            type: Number,
            default: 0
        },
        suggestedDescription: {
            type: String,
            default: ''
        },
        priceError: {
            type: String,
            default: ''
        }
    },

    emits: ['update:price'],

    data() {
        return {
            suggestedExpanded: false
        };
    },

    computed: {
        suggestedAmountLabel() {
            return formatContributionDisplayAmount(
                this.recommendedSeatPriceCents
            );
        }
    },

    methods: {
        toggleSuggested() {
            this.suggestedExpanded = !this.suggestedExpanded;
        }
    }
};
</script>

<style scoped>
.trip-contribution-step__subtitle {
    margin: 0 0 1rem;
}

.trip-contribution-step__amount {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 3.25rem;
    padding: 0.65rem 1rem;
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background: #fff;
}

.trip-contribution-step__amount.has-error {
    border-color: #c0392b;
}

.trip-contribution-step__currency {
    color: var(--ds-action, #1e5f9e);
    font-weight: 700;
    font-size: 1.15rem;
}

.trip-contribution-step__input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: 1.1rem;
    color: #737373;
    outline: none;
}

.trip-contribution-step__suffix {
    color: #737373;
    white-space: nowrap;
}

.trip-contribution-step__suggested {
    display: block;
    width: 100%;
    margin: 1rem 0;
    padding: 0.9rem 1rem;
    border: 1px solid var(--ds-action, #1e5f9e);
    border-radius: 0.75rem;
    background: #eef5fb;
    color: var(--ds-action, #1e5f9e);
    font: inherit;
    text-align: left;
    cursor: pointer;
    position: relative;
}

.trip-contribution-step__suggested-main {
    display: block;
    padding-right: 1.5rem;
    font-weight: 700;
}

.trip-contribution-step__suggested .fa {
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.trip-contribution-step__suggested-body {
    margin-top: 0.85rem;
    color: #404040;
    font-weight: 400;
}

.trip-contribution-step__suggested-body strong {
    display: block;
    margin-bottom: 0.35rem;
    color: #22211f;
}

.trip-contribution-step__suggested-body p {
    margin: 0;
    line-height: 1.45;
}

.trip-contribution-step__important {
    margin-top: 1.25rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #f3f3f3;
    color: #404040;
}

.trip-contribution-step__important-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
}

.trip-contribution-step__important-title .fa {
    color: var(--ds-action, #1e5f9e);
}

.trip-contribution-step__important-body {
    line-height: 1.45;
}

.trip-contribution-step__important-body p {
    margin: 0 0 0.75rem;
}

.trip-contribution-step__important-body p:last-child {
    margin-bottom: 0;
}

.trip-contribution-step__important-explainer {
    margin: 0.75rem 0 0;
    line-height: 1.45;
}

.trip-contribution-step__important-body :deep(strong) {
    font-weight: 700;
}
</style>
