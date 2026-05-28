<template>
    <div v-if="showTripPatente || hasDescription" class="trip-description-block">
        <p v-if="showTripPatente" class="trip-patente">
            {{ $t('patenteDelAuto') }}
            <span class="trip-patente__value">{{ trip.car.patente }}</span>
            <span
                v-if="trip.car.deleted"
                class="trip-car-deleted-label"
            >
                ({{ $t('autoEliminado') }})
            </span>
        </p>
        <div
            v-if="hasDescription"
            class="row italic quote"
            :class="descriptionLength"
        >
            <i class="fa fa-quote-left" aria-hidden="true"></i>
            <span>{{ trip.description }}</span>
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
export default {
    name: 'TripDescription',
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme'
        }),
        hasDescription() {
            return (
                this.trip.description && this.trip.description.length > 0
            );
        },
        showTripPatente() {
            return (
                !this.trip.is_passenger &&
                this.trip.car &&
                this.trip.car.patente
            );
        },
        descriptionLength() {
            return this.trip.description.length > 215 ? 'long-description' : '';
        }
    },
    props: [],
    components: {},
    methods: {}
};
</script>
<style scoped>
.trip-description-block {
    margin-left: 1em;
}

.trip-patente {
    margin: 0 0 0.75em;
}

.trip-patente__value {
    font-weight: bold;
}

.quote {
    margin-left: 0;
}

@media only screen and (min-width: 768px) {
    .trip-description-block {
        margin-left: 0;
    }
    .trip-detail-component .quote.long-description {
        font-size: 14px;
    }
}
</style>
