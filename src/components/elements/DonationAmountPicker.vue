<template>
    <div
        class="donation-amount-picker"
        :class="{ 'donation-amount-picker--body-text': bodyTextTone }"
    >
        <p
            v-if="showUsageNote && !usageNoteHtml"
            class="donation-usage-note text-center"
        >
            {{ $t(usageNoteKey) }}
        </p>
        <p
            v-if="showUsageNote && usageNoteHtml"
            class="donation-usage-note text-center"
            v-html="$t(usageNoteKey)"
        ></p>
        <div class="radio">
            <label
                v-for="tier in tiers"
                :key="tier.amount"
                class="radio-inline donation-tier-option"
            >
                <input
                    type="radio"
                    :name="radioGroupName"
                    :id="radioGroupName + '-' + tier.amount"
                    :value="String(tier.amount)"
                    :checked="isSelected(tier.amount)"
                    @change="select(tier.amount)"
                />
                <i :class="['fa', tier.icon]" aria-hidden="true"></i>
                <span class="donation-tier-label">
                    $ {{ formatAmount(tier.amount) }}
                    ({{ $t(tier.labelKey) }})
                </span>
            </label>
            <slot />
        </div>
    </div>
</template>

<script>
import { DONATION_TIERS } from '../../utils/donationOptions.js';

/** i18n: donationTierCafe, donationTierBeer, donationTierFood */

export default {
    name: 'DonationAmountPicker',
    props: {
        modelValue: {
            type: [String, Number],
            default: 0
        },
        showUsageNote: {
            type: Boolean,
            default: true
        },
        usageNoteKey: {
            type: String,
            default: 'donationUsageNote'
        },
        usageNoteHtml: {
            type: Boolean,
            default: false
        },
        bodyTextTone: {
            type: Boolean,
            default: false
        },
        radioGroupName: {
            type: String,
            default: 'donationValor'
        }
    },
    emits: ['update:modelValue'],
    computed: {
        tiers() {
            return DONATION_TIERS;
        }
    },
    methods: {
        isSelected(amount) {
            return String(this.modelValue) === String(amount);
        },
        select(amount) {
            this.$emit('update:modelValue', String(amount));
        },
        formatAmount(amount) {
            return amount.toLocaleString('es-AR');
        }
    }
};
</script>

<style scoped>
.donation-tier-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-right: 12px;
    margin-bottom: 8px;
    position: static;
    padding-left: 0;
}

.donation-tier-option input[type='radio'] {
    position: static;
    margin: 0;
    flex-shrink: 0;
}

.donation-tier-option .fa {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.1em;
    line-height: 1;
    opacity: 0.85;
}

.donation-tier-label {
    line-height: 1.25;
}

.donation-usage-note {
    /* Match .radio > label > span tier labels in donation modals (mobile) */
    font-size: 1.4em;
    color: #555;
    margin-bottom: 12px;
    line-height: 1.45;
}

.donation-amount-picker--body-text .donation-usage-note {
    color: var(--ds-text-primary);
    font-size: 1.2rem;
}

.donation-amount-picker--body-text .donation-usage-note :deep(strong) {
    font-weight: var(--ds-font-weight-bold, 700);
}

.donation-amount-picker--body-text .donation-tier-option,
.donation-amount-picker--body-text .donation-tier-option .donation-tier-label,
.donation-amount-picker--body-text .donation-tier-option .fa {
    color: var(--ds-text-secondary);
}

.donation-amount-picker--body-text .donation-tier-option .fa {
    opacity: 1;
}

@media (min-width: 768px) {
    .donation-usage-note {
        font-size: 1rem;
    }

    .donation-amount-picker--body-text .donation-usage-note {
        font-size: 1.2rem;
    }
}
</style>
