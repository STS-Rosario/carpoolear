<template>

    <div
        class="trip-seats"
        v-if="config.module_seat_price_enabled && (tripCardTheme === 'light' || !trip.is_passenger)"
    >
        <div v-if="tripCardTheme !== 'light'" class="price-container">
            <div class="price-item">
                <span class="trip_seat-price_value">{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    {{ t('contribucionPorPersona') }} <br/> {{ t('porPersona') }}
                    <br />
                </span>
            </div>
            <div class="price-item" v-if="config.module_max_price_enabled">
                <span class="trip_seat-price_value trip_seat-price_recommended_value">{{ $n(recommendedPricePerSeat, 'currency') }}</span>
                <span class="trip_seats-available_label">
                    <span v-html="t('contribucionRecomendada')"></span>
                    <span>
                        <span
                            class="tooltip-seat-price tooltip-seat-price-passenger"
                            :data-tooltip="t('calculadoEnBaseNafta')"
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
                    {{ t('contribucionPorPersona') }}: <span>{{ $n(trip.seat_price_cents / 100, 'currency') }}</span>
                </template>
            </div>
        </template>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import SvgItem from '../SvgItem';

const { t } = useI18n();
const tripsStore = useTripsStore();
const authStore = useAuthStore();

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const user = computed(() => authStore.user);
const config = computed(() => authStore.appConfig);

const owner = computed(() => {
    console.log('trip', trip.value);
    console.log('user', user.value);
    console.log('trip.user.id', trip.value.user.id);
    console.log('user.id', user.value.id);
    return trip.value && user.value && user.value.id === trip.value.user.id;
});

const recommendedPricePerSeat = computed(() => {
    console.log('trip', trip.value);
    console.log('config', config.value);

    // If the trip already has a recommended price, use that
    if (trip.value.recommended_trip_price_cents) {
        // Convert from cents to dollars and divide by total seats including driver
        return Math.floor(trip.value.recommended_trip_price_cents / 100 / (trip.value.total_seats + 1));
    }

    // Otherwise, calculate the recommended price from scratch
    // Get configuration values
    const fuelPrice = config.value.module_max_price_fuel_price || 1500; // $/l
    const kilometersPerLiter = config.value.module_max_price_kilometer_by_liter || 10; // km/l
    const pricePerKilometer = fuelPrice / kilometersPerLiter; // $/km

    // Get sellado viaje price (convert from cents to dollars)
    const selladoViajePrice = config.value.module_trip_creation_payment_enabled ?
        (config.value.module_trip_creation_payment_amount_cents || 0) / 100 : 0;

    // Get tolls variance percentage (e.g., 10 for 10% extra)
    const tollsVariancePercent = config.value.module_max_price_price_variance_tolls || 0;

    // Get maximum price variance percentage (e.g., 15 for 15% extra)
    const maxPriceVariancePercent = config.value.module_max_price_price_variance_max_extra || 15;

    // Convert distance from meters to kilometers
    const distanceInKm = trip.value.distance / 1000;

    // Calculate base price without sellado (convert to cents for consistency with PHP)
    const basePriceCents = Math.round(distanceInKm * pricePerKilometer * 100);

    // Calculate tolls variance amount
    const tollsVarianceCents = Math.round(basePriceCents * (tollsVariancePercent / 100));

    // Recommended trip price: base + tolls variance + sellado (in cents)
    const recommendedTripPriceCents = basePriceCents + tollsVarianceCents + (selladoViajePrice * 100);

    // Calculate price per seat (including driver)
    // Convert back to dollars and divide by total seats including driver
    const recommendedPricePerSeatVal = recommendedTripPriceCents / 100 / (trip.value.total_seats + 1);

    return Math.round(recommendedPricePerSeatVal);
});
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
