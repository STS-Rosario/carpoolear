<template>
    
    <div
        class="trip-seats"
        v-if="this.config.module_seat_price_enabled && (tripCardTheme === 'light' || !trip.is_passenger)"
    >
        <div v-if="tripCardTheme !== 'light'" class="price-container">
            <div class="price-item">
                <span class="trip_seat-price_value">{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    {{ $t('contribucionPorPersona') }}
                    <br />
                </span>
            </div>
            <div class="price-item" v-if="this.config.module_max_price_enabled">
                <span class="trip_seat-price_value trip_seat-price_recommended_value">{{ $n(recommendedPricePerSeat, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    <span v-html="$t('contribucionRecomendada')"></span>
                    <span>
                        <span
                            class="tooltip-seat-price tooltip-seat-price-passenger"
                            :data-tooltip="$t('calculadoEnBaseNafta')"
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
                    {{ $t('contribucionPorPersona') }}: <span>{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
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
            // Same unit as trip.seat_price_cents / 100 (main currency) so $n(..., 'currency') formats like trip detail
            const toDisplayAmount = (value) => Math.round(value * 100) / 100;

            if (this.trip.recommended_seat_price_cents != null) {
                return this.trip.recommended_seat_price_cents / 100;
            }
            if (this.trip.recommended_trip_price_cents) {
                const perSeat = this.trip.recommended_trip_price_cents / 100 / (this.trip.total_seats + 1);
                return toDisplayAmount(perSeat);
            }
            // Calculate from scratch
            const fuelPrice = this.config.module_max_price_fuel_price || 1500; // $/l
            const kilometersPerLiter = this.config.module_max_price_kilometer_by_liter || 10; // km/l
            const pricePerKilometer = fuelPrice / kilometersPerLiter; // $/km
            const selladoViajePrice = this.config.module_trip_creation_payment_enabled ?
                (this.config.module_trip_creation_payment_amount_cents || 0) / 100 : 0;
            const tollsVariancePercent = this.config.module_max_price_price_variance_tolls || 0;
            const distanceInKm = this.trip.distance / 1000;
            const basePriceCents = Math.round(distanceInKm * pricePerKilometer * 100);
            const tollsVarianceCents = Math.round(basePriceCents * (tollsVariancePercent / 100));
            const recommendedTripPriceCents = basePriceCents + tollsVarianceCents + (selladoViajePrice * 100);
            const recommendedPricePerSeat = recommendedTripPriceCents / 100 / (this.trip.total_seats + 1);
            return toDisplayAmount(recommendedPricePerSeat);
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