<template>
    <div
        v-if="trip.description && trip.description.length"
        class="row italic quote"
        :class="descriptionLength"
    >
        <i class="fa fa-quote-left" aria-hidden="true"></i>
        <span>{{ trip.description }}</span>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';

const tripsStore = useTripsStore();
const authStore = useAuthStore();

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);

const descriptionLength = computed(() => {
    return trip.value.description.length > 215 ? 'long-description' : '';
});
</script>
<style scoped>
.quote {
    margin-left: 1em;
}
@media only screen and (min-width: 768px) {
    .trip-detail-component .quote {
        margin-left: 0;
    }
    .trip-detail-component .quote.long-description {
        font-size: 14px;
    }
}
</style>
