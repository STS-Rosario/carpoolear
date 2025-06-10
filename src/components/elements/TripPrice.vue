<template>
    <div
        class="trip-seats"
        v-if="tripCardTheme === 'light' || !trip.is_passenger"
    >
        <div class="row" v-if="tripCardTheme !== 'light'">
            <div
                class="trip_seats-available col-xs-offset-4 col-sm-offset-4 col-xs-12"
            >
                Precio asiento: <span class="pull-left">{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
            </div>
        </div>
        <div v-if="tripCardTheme !== 'light'" style="height: 3.5em"></div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <template v-for="n in trip.total_seats">
                    Precio asiento: <span class="pull-left">{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
                </template>
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SvgItem from '../SvgItem';
export default {
    name: 'TripSeats',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme'
        })
    },
    components: {
        SvgItem
    }
};
</script>
