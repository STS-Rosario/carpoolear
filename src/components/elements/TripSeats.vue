<template>
    <div
        class="trip-seats"
        v-if="tripCardTheme === 'light' || !trip.is_passenger"
    >
        <div class="row" v-if="tripCardTheme !== 'light'">
            <div
                class="trip_seats-available col-xs-offset-2 col-sm-offset-4 col-xs-24"
            >
                <div class="trip-seats__availability">
                    <span class="trip_seats-available_value">{{
                        trip.seats_available
                    }}</span>
                    <span
                        v-if="trip.seats_available == 1"
                        class="trip_seats-available_label"
                    >
                        {{ $t('Lugar') }}
                        <br />
                        {{ $t('libre') }}
                    </span>
                    <span
                        v-if="trip.seats_available > 1"
                        class="trip_seats-available_label"
                    >
                        {{ $t('Lugares') }}
                        <br />
                        {{ $t('libres') }}
                    </span>
                    <span
                        v-if="trip.seats_available === 0"
                        class="trip_seats-available_label"
                    >
                        {{ $t('Lugares') }}
                        <br />
                        {{ $t('libres') }}
                    </span>
                    <span
                        v-if="Number(trip.rear_max_two_passengers) > 0"
                        class="trip-seats__rear-comfort-note label-soft"
                    >
                        {{ $t('atrasViajanSolo2Personas') }}
                    </span>
                </div>
            </div>
        </div>
        <template v-else>
            <div
                class="trip_seats-available"
                v-if="!trip.is_passenger"
            >
                <div class="trip-seats__availability">
                    <template v-for="n in trip.total_seats">
                        <span
                            :class="
                                n < trip.total_seats - trip.seats_available
                                    ? 'seat-taken'
                                    : 'seat-free'
                            "
                        >
                            <svg-item :icon="'seat'" :size="18"></svg-item>
                        </span>
                    </template>
                    <span
                        v-if="Number(trip.rear_max_two_passengers) > 0"
                        class="trip-seats__rear-comfort-note label-soft"
                    >
                        {{ $t('atrasViajanSolo2Personas') }}
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import SvgItem from '../SvgItem';
export default {
    name: 'TripSeats',
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme'
        })
    },
    components: {
        SvgItem
    }
};
</script>
<style scoped>
.trip-seats {
    margin-bottom: 2em;
}

.trip-seats__availability {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.5rem;
}

.trip-seats__availability .trip_seats-available_value {
    float: none;
    flex-shrink: 0;
}

.trip-seats__availability .trip_seats-available_label {
    flex-shrink: 0;
}

.trip-seats__rear-comfort-note {
    font-size: 0.9em;
    line-height: 1.2;
    text-transform: none;
    min-width: 0;
    margin-left: 1rem;
}
</style>
