<template>
    
    <div
        class="trip-seats"
        v-if="tripCardTheme === 'light' || !trip.is_passenger"
    >
        <div class="row" v-if="tripCardTheme !== 'light'">
            <div
                class="trip_seats-available col-xs-offset-4 col-sm-offset-4 col-xs-12"
            >
                Precio asiento: <span>{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
            </div>
            <span v-if="!trip.owner">Precio recomendado: <span>{{ $n(recommendedPricePerSeat, 'currency') }}</span></span>
        </div>
        <div v-if="tripCardTheme !== 'light'" style="height: 3.5em"></div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <template v-for="n in trip.total_seats">
                    Precio asiento: <span>{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
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
            tripCardTheme: 'auth/tripCardTheme',
            user: 'auth/user',
            config: 'auth/appConfig',
        }),
        owner() {
            console.log('this.trip', this.trip);
            console.log('this.user', this.user);
            console.log('this.trip.user.id', this.trip.user.id);
            console.log('this.user.id', this.user.id);
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        recommendedPricePerSeat() {
            console.log('this.trip', this.trip);
            console.log('this.config',this.config);
            
            // Get configuration values
            const kmPerLiter = this.config.module_max_price_kilometer_by_liter || 10; // km/l
            const literPrice = this.config.module_max_price_fuel_price || 1500; // $/l
            
            // Convert distance from meters to kilometers
            const distanceInKm = this.trip.distance / 1000;
            
            // Calculate total fuel cost in dollars
            // (km / (km/l)) * ($/l) = l * ($/l) = $
            const totalFuelCost = (distanceInKm / kmPerLiter) * literPrice;
            
            // Calculate price per seat (including driver)
            // $ / (seats + 1) = $/seat
            const recommendedPrice = totalFuelCost / (this.trip.total_seats + 1);
            
            return Math.round(recommendedPrice);
        }
    },
    components: {
        SvgItem
    }
};
</script>
