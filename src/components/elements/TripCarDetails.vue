<template>
    <div class="trip-car-details">
        <h3 class="trip-car-details__title">{{ $t('auto') }}</h3>
        <p
            v-for="row in rows"
            :key="row.labelKey"
            class="trip-car-details__line"
        >
            <strong>{{ $t(row.labelKey) }}:</strong>
            {{ row.displayValue }}
        </p>
        <p v-if="car.deleted" class="trip-car-details__deleted">
            ({{ $t('autoEliminado') }})
        </p>
    </div>
</template>

<script>
import {
    carDetailRows,
    resolveTripFuelProfile
} from '../../utils/carFields.js';

export default {
    name: 'trip-car-details',
    props: {
        car: {
            type: Object,
            required: true
        },
        trip: {
            type: Object,
            default: null
        }
    },
    computed: {
        rows() {
            const fuelProfile = resolveTripFuelProfile(
                this.trip ? { ...this.trip, car: this.car } : { car: this.car }
            );
            const car = fuelProfile ? { ...this.car, ...fuelProfile } : this.car;

            return carDetailRows(car).map((row) => ({
                ...row,
                displayValue: this.rowDisplayValue(row)
            }));
        }
    },
    methods: {
        rowDisplayValue(row) {
            if (row.valueKey) {
                const label = this.$t(row.valueKey);
                return row.rateLabel ? `${label} (${row.rateLabel})` : label;
            }

            return row.value || '—';
        }
    }
};
</script>

<style scoped>
.trip-car-details {
    margin: 0 0 0.75em;
}

.trip-car-details__title {
    margin: 0 0 0.1rem 0;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.2;
}

.trip-car-details__line {
    margin: 0 0 0.2em;
}

.trip-car-details__deleted {
    margin: 0.35em 0 0;
    font-size: 0.95em;
}
</style>
