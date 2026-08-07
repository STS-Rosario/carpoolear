<template>
    <div
        v-if="visible"
        class="home-prompt-banner pending-ratings-banner"
        role="button"
        tabindex="0"
        @click="goToMyTrips"
        @keydown.enter.prevent="goToMyTrips"
        @keydown.space.prevent="goToMyTrips"
    >
        <div class="home-prompt-banner__icon" aria-hidden="true">
            <i class="fa fa-star"></i>
        </div>
        <div class="home-prompt-banner__body">
            <p class="home-prompt-banner__text">
                {{ $t('pendingRatingsBanner') }}
            </p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useRatesStore } from '../stores/rates';
import { hasPendingRatings } from '../utils/pendingRatingsEnforcement';

export default {
    name: 'PendingRatingsBanner',
    computed: {
        ...mapState(useRatesStore, {
            pendingRates: 'pendingRates'
        }),
        visible() {
            return hasPendingRatings(this.pendingRates);
        }
    },
    methods: {
        goToMyTrips() {
            this.$router.push({ name: 'my-trips' });
        }
    }
};
</script>

<style scoped>
.pending-ratings-banner {
    width: auto;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-bottom: 0.75rem;
    margin-left: 1rem;
    box-shadow: none;
    text-align: left;
}
</style>
