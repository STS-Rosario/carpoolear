<template>
    <div v-if="showTripCar || hasDescription" class="trip-description-block">
        <TripCarDetails v-if="showTripCar" :car="trip.car" />
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
import TripCarDetails from './TripCarDetails.vue';

export default {
    name: 'TripDescription',
    components: {
        TripCarDetails
    },
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
        showTripCar() {
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
    methods: {}
};
</script>
<style scoped>
.trip-description-block {
    margin-left: 1em;
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
