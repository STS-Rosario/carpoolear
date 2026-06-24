<template>
    <div
        v-if="visible"
        class="pending-ratings-banner"
        @click="goToMyTrips"
    >
        <span class="banner-text">
            {{ $t('pendingRatingsBanner') }}
        </span>
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
    width: 100%;
    padding: 10px 14px;
    background: #f0ad4e;
    color: #333;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.pending-ratings-banner:hover {
    background: #ec971f;
}
.banner-text {
    display: inline-block;
}
</style>
