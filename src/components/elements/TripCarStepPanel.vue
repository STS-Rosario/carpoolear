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
    margin-bottom: 0.75rem;
}
</style>
