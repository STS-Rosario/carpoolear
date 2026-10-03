<template>
    <div class="trip-detail__share">
        <AppButton
            variant="secondary"
            block
            data-testid="trip-detail-share"
            icon-left="fa fa-share-alt"
            @click="onShare"
        >
            {{ $t('tripCreationShareTrip') }}
        </AppButton>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '../ui/AppButton.vue';
import { useTripsStore } from '../../stores/trips';
import { shareTripDetail } from '../../utils/tripDetailShare.js';

export default {
    name: 'TripDetailShareButton',

    components: {
        AppButton
    },

    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        })
    },

    methods: {
        async onShare() {
            if (!this.trip) {
                return;
            }

            await shareTripDetail({
                trip: this.trip,
                router: this.$router,
                origin: window.location.origin,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });
        }
    }
};
</script>
