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
import { shareContent } from '../../utils/shareContent.js';
import { buildTripShareMessage } from '../../utils/tripShareMessage.js';

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
        tripUrl() {
            const route = this.$router.resolve({
                name: 'detail_trip',
                params: { id: this.trip.id }
            });
            return window.location.origin + route.href;
        },
        async onShare() {
            if (!this.trip) {
                return;
            }

            const url = this.tripUrl();
            const text = buildTripShareMessage({
                trip: this.trip,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });

            await shareContent({
                title: this.$t('tripCreationShareTrip'),
                text,
                url
            });
        }
    }
};
</script>
