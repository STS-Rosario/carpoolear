<template>
    <div class="trip-car-step-panel">
        <label for="trip-car-select" class="trip-car-step-panel__label">
            {{ $t('seleccionarAuto') }}
            <button
                type="button"
                class="trip-car-step-panel__edit-link btn btn-link"
                @click="$emit('edit-cars')"
            >
                {{ $t('editarAutosEnViaje') }}
            </button>
        </label>
        <select
            id="trip-car-select"
            class="form-control trip-car-step-panel__select"
            v-model="selectedCarIdModel"
            :class="{ 'has-error': carSelectionError.state }"
        >
            <option disabled value="">
                {{ $t('elegiPatente') }}
            </option>
            <option
                v-for="car in driverCarsWithPlate"
                :key="car.id"
                :value="car.id"
            >
                {{ formatCarSelectLabel(car) }}
            </option>
        </select>
        <span class="error" v-if="carSelectionError.state">
            {{ carSelectionError.message }}
        </span>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useCarsStore } from '../../stores/car';
import { formatCarSelectLabel } from '../../utils/carFields.js';
import { activeCarsWithPlate } from '../../utils/userCars.js';

export default {
    name: 'trip-car-step-panel',

    props: {
        selectedCarId: {
            type: [Number, String],
            default: null
        },
        carSelectionError: {
            type: Object,
            required: true
        }
    },

    emits: ['update:selectedCarId', 'cars-updated', 'edit-cars'],

    computed: {
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        driverCarsWithPlate() {
            return activeCarsWithPlate(this.cars);
        },
        selectedCarIdModel: {
            get() {
                return this.selectedCarId;
            },
            set(value) {
                this.$emit('update:selectedCarId', value);
            }
        }
    },

    methods: {
        formatCarSelectLabel
    }
};
</script>

<style scoped>
.trip-car-step-panel__label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--ds-input-label, #404040);
    font-size: var(--ds-input-label-size, 1rem);
    font-weight: var(--ds-input-label-font-weight, 400);
}

.trip-car-step-panel__edit-link {
    font-size: inherit;
    padding: 0;
    vertical-align: baseline;
    font-weight: 700;
    text-decoration: underline;
    color: var(--ds-text-primary, #22211f);
}

.trip-car-step-panel__edit-link:hover,
.trip-car-step-panel__edit-link:focus {
    text-decoration: underline;
    color: var(--ds-text-primary, #22211f);
}

.trip-car-step-panel__select {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 0 0.75rem;
    box-sizing: border-box;
    border: 1px solid var(--ds-input-border);
    border-radius: var(--ds-radius-input, 8px) !important;
    background-color: var(--ds-input-bg);
    color: var(--ds-input-text);
    font-family: inherit;
    font-size: var(--ds-input-font-size);
    line-height: 1.3;
    padding: var(--ds-input-padding-y) 2.5rem var(--ds-input-padding-y)
        var(--ds-input-padding-x);
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23737373' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 0.75rem 0.5rem;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.trip-car-step-panel__select:focus {
    outline: none;
    border-color: var(--ds-input-focus-border);
    box-shadow: var(--ds-input-focus-ring);
}

.trip-car-step-panel__select.has-error {
    border-color: var(--ds-input-error-border, #991b1b);
}
</style>
