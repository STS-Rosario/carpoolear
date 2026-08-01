<template>
    <div class="row trip-stats" v-if="!trip.is_passenger && !isPassengersView">
        <div class="trip-detail__stats">
            <span>
                {{ distanceString }}
                <abbr :title="$t('kilometros')">{{ $t('km') }}</abbr>
            </span>
            <span class="trip-detail__stats-sep">&middot;</span>
            <span>{{ trip.estimated_time }} {{ $t('horas') }}</span>
            <span class="trip-detail__stats-sep">&middot;</span>
            <span>
                {{ ((trip.distance / 1000) * 0.15).toFixed(2) }}
                <abbr :title="$t('kilogramosDioxidoCarbono')">
                    kg CO<sub>2</sub> eq.
                </abbr>
            </span>
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import SvgItem from '../SvgItem';
export default {
    name: 'TripDate',
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme'
        }),
        distanceString() {
            return Math.floor(this.trip.distance / 1000);
        },
        isPassengersView() {
            return this.trip.is_passenger;
        }
    },
    components: {
        SvgItem
    },
    methods: {}
};
</script>
<style scoped></style>
