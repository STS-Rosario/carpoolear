<template>
    <div class="trip-creation-success">
        <h2 class="trip-creation-success__title">{{ $t('tripCreationSuccessTitle') }}</h2>
        <div class="trip-creation-success__emoji" aria-hidden="true">🥳</div>
        <p class="trip-creation-success__heading">{{ $t('tripCreationSuccessAllSet') }}</p>
        <p class="trip-creation-success__prompt">{{ $t('tripCreationSuccessSharePrompt') }}</p>

        <div class="trip-creation-success__actions">
            <button
                type="button"
                class="btn btn-primary trip-creation-success__share"
                data-testid="trip-creation-share"
                @click="onShare"
            >
                <i class="fa fa-share-alt" aria-hidden="true"></i>
                {{ $t('tripCreationShareTrip') }}
            </button>
            <router-link
                :to="{ name: 'detail_trip', params: { id: trip.id } }"
                class="btn btn-default trip-creation-success__view"
                data-testid="trip-creation-view-trip"
            >
                {{ $t('tripCreationViewTrip') }}
            </router-link>
            <button
                v-if="!trip.is_passenger && !trip.parent_trip_id"
                type="button"
                class="btn btn-default trip-creation-success__return"
                data-testid="trip-creation-return-trip"
                @click="$emit('start-return-trip')"
            >
                {{ $t('cargarViajeRegreso') }}
            </button>
        </div>

        <div class="trip-creation-success__invite">
            <p class="trip-creation-success__invite-title">
                {{ $t('queresInvitarTusAmigos') }}
            </p>
            <TripInviteFriends :trip-id="trip.id" />
        </div>
    </div>
</template>

<script>
import TripInviteFriends from '../sections/TripInviteFriends.vue';
import { shareContent } from '../../utils/shareContent.js';

export default {
    name: 'trip-creation-success',

    components: {
        TripInviteFriends
    },

    props: {
        trip: {
            type: Object,
            required: true
        }
    },

    emits: ['start-return-trip'],

    methods: {
        tripUrl() {
            const route = this.$router.resolve({
                name: 'detail_trip',
                params: { id: this.trip.id }
            });
            return window.location.origin + route.href;
        },
        async onShare() {
            await shareContent({
                title: this.$t('tripCreationShareTrip'),
                text: this.$t('publicarUnViajeCompartir'),
                url: this.tripUrl()
            });
        }
    }
};
</script>

<style scoped>
.trip-creation-success {
    text-align: center;
    padding: 1rem 0 2rem;
}

.trip-creation-success__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.trip-creation-success__emoji {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 1rem;
}

.trip-creation-success__heading {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.trip-creation-success__prompt {
    margin-bottom: 1.5rem;
}

.trip-creation-success__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.trip-creation-success__share i {
    margin-right: 0.35rem;
}

.trip-creation-success__invite {
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}

.trip-creation-success__invite-title {
    font-weight: 600;
    margin-bottom: 0.75rem;
}
</style>
