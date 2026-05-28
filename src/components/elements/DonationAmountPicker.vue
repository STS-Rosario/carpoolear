<template>
    <div class="donation-amount-picker">
        <p v-if="showUsageNote" class="donation-usage-note text-center">
            {{ $t('donationUsageNote') }}
        </p>
        <div class="radio">
            <label
                v-for="tier in tiers"
                :key="tier.amount"
                class="radio-inline donation-tier-option"
            >
                <input
                    type="radio"
                    name="donationValor"
                    :id="'donation-' + tier.amount"
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
    gap: 6px;
    margin-right: 12px;
    margin-bottom: 8px;
}

.donation-tier-option .fa {
    font-size: 1.1em;
    opacity: 0.85;
}

.donation-usage-note {
    font-size: 0.95em;
    color: #555;
    margin-bottom: 12px;
    line-height: 1.45;
}
</style>
