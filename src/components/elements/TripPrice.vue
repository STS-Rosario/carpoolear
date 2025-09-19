<template>
    
    <div
        class="trip-seats"
        v-if="this.config.module_seat_price_enabled && (tripCardTheme === 'light' || !trip.is_passenger)"
    >
        <div v-if="tripCardTheme !== 'light'" class="price-container">
            <div class="price-item">
                <span class="trip_seat-price_value">{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    Contribución 
                    <br />
                    por persona
                </span>
            </div>
            <div class="price-item" v-if="this.config.module_max_price_enabled">
                <span class="trip_seat-price_value trip_seat-price_recommended_value">{{ $n(recommendedPricePerSeat, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    Contribución 
                    <br />
                    recomendada
                    <span>            
                        <span
                            class="tooltip-seat-price tooltip-seat-price-passenger"
                            data-tooltip="Calculado en base a nafta premium, consumo promedio alto, peajes y Sellado de Viaje incluídos (si aplica)"
                        >
                            <i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                            ></i>
                        </span>
                    </span>
                </span>
            </div>
        </div>
        <div v-if="tripCardTheme !== 'light'" style="height: 3.5em"></div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <template v-for="n in trip.total_seats">
                    Contribución por persona: <span>{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
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
            
            // If the trip already has a recommended price, use that
            if (this.trip.recommended_trip_price_cents) {
                // Convert from cents to dollars and divide by total seats including driver
                return Math.floor(this.trip.recommended_trip_price_cents / 100 / (this.trip.total_seats + 1));
            }
            
            // Otherwise, calculate the recommended price from scratch
            // Get configuration values
            const fuelPrice = this.config.module_max_price_fuel_price || 1500; // $/l
            const kilometersPerLiter = this.config.module_max_price_kilometer_by_liter || 10; // km/l
            const pricePerKilometer = fuelPrice / kilometersPerLiter; // $/km
            
            // Get sellado viaje price (convert from cents to dollars)
            const selladoViajePrice = this.config.module_trip_creation_payment_enabled ? 
                (this.config.module_trip_creation_payment_amount_cents || 0) / 100 : 0;
            
            // Get tolls variance percentage (e.g., 10 for 10% extra)
            const tollsVariancePercent = this.config.module_max_price_price_variance_tolls || 0;
            
            // Get maximum price variance percentage (e.g., 15 for 15% extra)
            const maxPriceVariancePercent = this.config.module_max_price_price_variance_max_extra || 15;
            
            // Convert distance from meters to kilometers
            const distanceInKm = this.trip.distance / 1000;
            
            // Calculate base price without sellado (convert to cents for consistency with PHP)
            const basePriceCents = Math.round(distanceInKm * pricePerKilometer * 100);
            
            // Calculate tolls variance amount
            const tollsVarianceCents = Math.round(basePriceCents * (tollsVariancePercent / 100));
            
            // Recommended trip price: base + tolls variance + sellado (in cents)
            const recommendedTripPriceCents = basePriceCents + tollsVarianceCents + (selladoViajePrice * 100);
            
            // Calculate price per seat (including driver)
            // Convert back to dollars and divide by total seats including driver
            const recommendedPricePerSeat = recommendedTripPriceCents / 100 / (this.trip.total_seats + 1);
            
            return Math.round(recommendedPricePerSeat);
        }
    },
    components: {
        SvgItem
    }
};
</script>

<style scoped>
.price-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.price-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.trip_seats-available_label > span {
    display: inline;
}
.tooltip-seat-price-passenger::before {
    width: 20em;
    display: inline;
    text-transform: none;
}
</style>