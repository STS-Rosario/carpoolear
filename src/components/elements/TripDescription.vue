<template>
    <div v-if="trip.description && trip.description.length" class="row italic quote" :class="descriptionLength">
        <i class="fa fa-quote-left" aria-hidden="true"></i>
        <span> {{trip.description}} </span>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'TripDescription',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme'
        }),
        descriptionLength () {
            return this.trip.description.length > 215 ? 'long-description' : '';
        }
    },
    props: [],
    components: {
    },
    methods: {
    }
};
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