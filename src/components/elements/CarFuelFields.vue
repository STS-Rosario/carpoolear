<template>
    <div class="car-fuel-fields">
        <h5 v-if="showSubtitle" class="car-fuel-fields__subtitle">
            {{ $t('fuelInfoSubtitle') }}
        </h5>
        <p v-if="showExplainer" class="car-fuel-fields__explainer">
            {{ $t('fuelFormExplainerIntro') }}
            <strong class="car-fuel-fields__explainer-warning">{{
                $t('fuelFormExplainerWarning')
            }}</strong>
        </p>
        <AppField :label="$t('fuelType')" label-for="car-form-fuel-type">
            <select
                id="car-form-fuel-type"
                v-model="entry.fuel_type"
                class="car-fuel-fields__select"
            >
                <option :value="null">{{ $t('seleccionarCombustible') }}</option>
                <option v-for="type in fuelTypes" :key="type" :value="type">
                    {{ $t(fuelTypeKey(type)) }}
                </option>
            </select>
        </AppField>
        <AppField
            :label="$t('fuelConsumption')"
            label-for="car-form-fuel-consumption"
            :hint="rateHint"
        >
            <select
                id="car-form-fuel-consumption"
                v-model="entry.fuel_consumption"
                class="car-fuel-fields__select"
            >
                <option :value="null">{{ $t('seleccionarConsumo') }}</option>
                <option
                    v-for="level in consumptionLevels"
                    :key="level"
                    :value="level"
                >
                    {{ consumptionOptionLabel(level) }}
                </option>
            </select>
        </AppField>
    </div>
</template>

<script>
import AppField from '../ui/AppField.vue';
import {
    FUEL_CONSUMPTION_LEVELS,
    FUEL_TYPES,
    formatFuelConsumptionOptionLabel,
    fuelConsumptionI18nKey,
    fuelConsumptionRateLabel,
    fuelTypeI18nKey
} from '../../utils/carFields.js';

export default {
    name: 'car-fuel-fields',
    components: { AppField },
    props: {
        entry: {
            type: Object,
            required: true
        },
        showSubtitle: {
            type: Boolean,
            default: true
        },
        showExplainer: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        fuelTypes() {
            return FUEL_TYPES;
        },
        consumptionLevels() {
            return FUEL_CONSUMPTION_LEVELS;
        },
        rateLabel() {
            return fuelConsumptionRateLabel(
                this.entry.fuel_type,
                this.entry.fuel_consumption
            );
        },
        rateHint() {
            return this.rateLabel
                ? this.$t('fuelConsumptionRateHint', { rate: this.rateLabel })
                : '';
        }
    },
    methods: {
        fuelTypeKey: fuelTypeI18nKey,
        fuelConsumptionKey: fuelConsumptionI18nKey,
        consumptionOptionLabel(level) {
            return formatFuelConsumptionOptionLabel(
                this.$t(fuelConsumptionI18nKey(level)),
                this.entry.fuel_type,
                level
            );
        }
    }
};
</script>

<style scoped>
.car-fuel-fields__subtitle {
    margin: 1rem 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
}

.car-fuel-fields__explainer {
    margin: 0.5rem 0 1rem;
    font-size: 0.95em;
}

.car-fuel-fields__explainer-warning {
    display: inline;
    margin-left: 0.25rem;
    color: var(--main-error, #d72521);
    font-weight: 700;
}

.car-fuel-fields__select {
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

.car-fuel-fields__select:focus {
    outline: none;
}

.car-fuel-fields__select option {
    color: #333;
    background: #fff;
}
</style>
