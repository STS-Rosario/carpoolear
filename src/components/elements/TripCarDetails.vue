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
import { carDetailRows } from '../../utils/carFields.js';

export default {
    name: 'trip-car-details',
    props: {
        car: {
            type: Object,
            required: true
        }
    },
    computed: {
        rows() {
            return carDetailRows(this.car).map((row) => ({
                ...row,
                displayValue: row.value || '—'
            }));
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
