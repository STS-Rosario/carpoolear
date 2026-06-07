<template>
    
    <div
        class="trip-seats"
        v-if="
            this.config.module_seat_price_enabled &&
            (tripCardTheme === 'light' || !trip.is_passenger) &&
            showSeatPriceSection
        "
    >
        <div v-if="tripCardTheme !== 'light'" class="price-container">
            <div class="price-item">
                <span class="trip_seat-price_value trip_seat-price_value-main">
                    <template v-if="isVoluntaryContribution">{{
                        $t('loQueSePuedaAportar')
                    }}</template>
                    <template v-else>{{
                        $n(trip.seat_price_cents / 100, 'currency')
                    }}</template>
                </span>
                <span class="trip_seats-available_label">
                    {{ $t('contribucionPorPersona') }}
                    <br />
                </span>
                <button
                    v-if="this.config.module_max_price_enabled"
                    class="trip-reference-toggle"
                    type="button"
                    @click="showReferenceContribution = !showReferenceContribution"
                >
                    <span class="trip-reference-toggle__text">
                        {{ $t('verContribucionReferenciaTramo') }}
                    </span>
                    <i
                        class="fa fa-chevron-down trip-reference-toggle__arrow"
                        :class="{ 'trip-reference-toggle__arrow--open': showReferenceContribution }"
                        aria-hidden="true"
                    ></i>
                </button>
                <div
                    v-if="this.config.module_max_price_enabled && showReferenceContribution"
                    class="trip-reference-collapse"
                >
                    <div class="trip-reference-collapse__title">
                        {{ $t('contribucionRecomendada') }}
                    </div>
                    <div class="trip-reference-collapse__description">
                        {{ calculadoEnBaseNaftaDescription }}
                    </div>
                    <div class="trip_seat-price_value trip_seat-price_recommended_value trip-reference-collapse__amount">
                        {{ $n(recommendedPricePerSeat, 'currency') }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="tripCardTheme !== 'light'" style="height: 3.5em"></div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <template v-for="n in trip.total_seats">
                    {{ $t('contribucionPorPersona') }}:
                    <span v-if="isVoluntaryContribution">{{
                        $t('loQueSePuedaAportar')
                    }}</span>
                    <span v-else>{{
                        $n(trip.seat_price_cents / 100, 'currency')
                    }}</span>
                </template>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import {
    isVoluntaryContributionSeatPrice,
    shouldShowTripSeatPriceSection
} from '../../utils/tripSeatPrice.js';
import { seatPriceCentsFromTripPriceCents } from '../../utils/tripPriceOccupants.js';
import SvgItem from '../SvgItem';
export default {
    name: 'TripSeats',
    data() {
        return {
            showReferenceContribution: false
        };
    },
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme',
            user: 'user',
            config: 'appConfig'
        }),
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        showSeatPriceSection() {
            return (
                this.trip &&
                shouldShowTripSeatPriceSection(this.trip.seat_price_cents)
            );
        },
        isVoluntaryContribution() {
            return (
                this.trip &&
                isVoluntaryContributionSeatPrice(this.trip.seat_price_cents)
            );
        },
        calculadoEnBaseNaftaDescription() {
            const base = this.$t('calculadoEnBaseNaftaBase');
            if (this.config && this.config.module_trip_creation_payment_enabled) {
                return base + this.$t('calculadoEnBaseNaftaSelladoSuffix');
            }
            return base;
        },
        recommendedPricePerSeat() {
            const toDisplayAmount = (value) => Math.round(value * 100) / 100;

            if (this.trip.recommended_trip_price_cents) {
                const perSeat = seatPriceCentsFromTripPriceCents(
                    this.trip.recommended_trip_price_cents,
                    this.trip.rear_max_two_passengers
                ) / 100;
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
            const recommendedPricePerSeat = seatPriceCentsFromTripPriceCents(
                recommendedTripPriceCents,
                this.trip.rear_max_two_passengers
            ) / 100;
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
.trip_seat-price_value-main {
    font-size: 2em;
}
.trip-reference-toggle {
    border: 0;
    padding: 0;
    background: transparent;
    color: #2f4f4f;
    font-size: 0.95em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    margin-top: 0.65em;
}
.trip-reference-toggle__text {
    text-decoration: underline;
}
.trip-reference-toggle__arrow {
    text-decoration: none;
    transition: transform 0.2s ease;
}
.trip-reference-toggle__arrow--open {
    transform: rotate(180deg);
}
.trip-reference-collapse {
    width: 100%;
    text-align: center;
    margin-top: 0.5em;
}
.trip-reference-collapse__title {
    font-weight: 600;
}
.trip-reference-collapse__description {
    font-size: 0.9em;
    color: #666;
    margin-top: 0.25em;
}
.trip-reference-collapse__amount {
    font-size: 1.5em;
    color: #808080;
    margin-top: 0.2em;
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