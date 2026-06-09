import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'NewTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('NewTrip.vue negative contribution validation', () => {
    it('imports negative seat price helper and blocks negative values on save', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripSeatPrice\.js'/);
        expect(viewSource).toContain('isNegativeSeatPriceInput');
        expect(viewSource).toContain("$t('contribucionPorPersonaNegativa')");
        expect(viewSource).toMatch(
            /if \(this\.trip\.is_passenger == 0 && this\.config\.module_seat_price_enabled\)[\s\S]*?isNegativeSeatPriceInput\(this\.price\)/s
        );
        expect(viewSource).toMatch(
            /isNegativeSeatPriceInput\([\s\S]*?this\.returnPrice[\s\S]*?contribucionPorPersonaNegativa/s
        );
    });

    it('validates negative contribution while typing for outbound and return trips', () => {
        expect(viewSource).toMatch(
            /validatePrice\(\)[\s\S]*?isNegativeSeatPriceInput\(this\.price\)/s
        );
        expect(viewSource).toMatch(
            /validateReturnPrice\(\)[\s\S]*?isNegativeSeatPriceInput\(this\.returnPrice\)/s
        );
    });

    it('sets min zero on contribution inputs', () => {
        expect(viewSource).toMatch(/id="price"[\s\S]*?min="0"/s);
        expect(viewSource).toMatch(/id="return-price"[\s\S]*?min="0"/s);
    });
});

describe('NewTrip.vue max contribution validation timing', () => {
    it('defers max contribution checks until trip-info cap is available', () => {
        expect(viewSource).toContain("from '../../utils/tripMaxPriceValidation.js'");
        expect(viewSource).toContain('exceedsMaximumSeatPrice');
        expect(viewSource).toMatch(
            /validatePrice\(\)[\s\S]*?maximumTripPriceCents:\s*this\.maximum_trip_price_cents/s
        );
        expect(viewSource).toMatch(
            /validateReturnPrice\(\)[\s\S]*?maximumTripPriceCents:\s*this\.maximum_return_trip_price_cents/s
        );
        expect(viewSource).not.toMatch(
            /this\.calcRoute\(type\);\s*\n\s*this\.recalculateRecommendedPrice\(\);/
        );
    });
});

describe('NewTrip.vue seat price API mapping', () => {
    it('imports seat price helpers for voluntary -1 sentinel', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripSeatPrice\.js'/);
        expect(viewSource).toContain('seatPriceCentsForApi');
        expect(viewSource).toContain('priceInputNumberFromStoredSeatPriceCents');
    });
});

describe('NewTrip.vue trip car selection', () => {
    it('restores and saves car_id when editing a driver trip', () => {
        expect(viewSource).toContain('restoreSelectedCarIdFromTrip');
        expect(viewSource).toContain('resolveTripCarId(this.cars, this.selectedCarId)');
        expect(viewSource).toMatch(
            /else\s*\{[\s\S]*?let trip = this\.getSaveInfo\(this, this\.estimatedTimeString\)/s
        );
    });
});

describe('NewTrip.vue autoaccept friends requests', () => {
    it('shows unchecked checkbox bound to trip.autoaccept_friends_requests', () => {
        expect(viewSource).toContain("$t('aceptarPedidosAmigosAutomaticamente')");
        expect(viewSource).toContain('v-model="trip.autoaccept_friends_requests"');
        expect(viewSource).toMatch(/autoaccept_friends_requests:\s*false/);
        expect(viewSource).toMatch(
            /class="trip-comment"[\s\S]*?v-model="trip\.description"[\s\S]*?checkbox-trip-autoaccept-friends/s
        );
    });

    it('includes autoaccept_friends_requests in create payload normalization', () => {
        expect(viewSource).toMatch(
            /normalizeAllowFlagsForApi\(trip\)[\s\S]*?autoaccept_friends_requests/s
        );
    });
});

describe('NewTrip.vue punto partida and punto llegada', () => {
    it('shows required point detail inputs after origin and destination are selected', () => {
        expect(viewSource).toContain("from '../../utils/tripPointDetailValidation.js'");
        expect(viewSource).toContain('TripPointDetailFields');
        expect(viewSource).toContain('validateTripPointDetails');
        expect(viewSource).toMatch(
            /validate\(\)[\s\S]*?validateTripPointDetails\(/s
        );
        expect(viewSource).toContain('punto_partida');
        expect(viewSource).toContain('punto_llegada');
        expect(viewSource).toContain('puntoPartidaError');
        expect(viewSource).toContain('puntoLlegadaError');
    });
});

describe('NewTrip.vue rear seat comfort preference', () => {
    it('shows comfort section after seats with unchecked checkbox for drivers', () => {
        expect(viewSource).toContain("$t('priorizarComodidad')");
        expect(viewSource).toContain("$t('atrasViajanSolo2Personas')");
        expect(viewSource).toMatch(
            /class="trip_seats-available"[\s\S]*?class="trip-comfort-preference"/s
        );
        expect(viewSource).toMatch(
            /v-if="trip\.is_passenger\s*==\s*0"[\s\S]*?class="trip-comfort-preference"/s
        );
        expect(viewSource).toMatch(
            /id="newtrip-comfort-rear-max-two"[\s\S]*?:checked="trip\.rear_max_two_passengers"[\s\S]*?@change="onOutboundRearMaxTwoChange"/s
        );
        expect(viewSource).toMatch(
            /rear_max_two_passengers:\s*false/
        );
    });

    it('normalizes rear seat preference for API and supports return trips', () => {
        expect(viewSource).toMatch(
            /normalizeAllowFlagsForApi\(trip\)[\s\S]*?trip\.rear_max_two_passengers = trip\.rear_max_two_passengers \? 1 : 0/s
        );
        expect(viewSource).toMatch(
            /otherTrip\.trip\.rear_max_two_passengers/
        );
        expect(viewSource).toMatch(
            /class="trip_seats-available"[\s\S]*?class="trip-comfort-preference"[\s\S]*?otherTrip-comfort-rear-max-two/s
        );
    });

    it('recalculates recommended price from comfort preference, not seat count', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripPriceOccupants\.js'/);
        expect(viewSource).toContain('seatPriceCentsFromTripPriceCents');
        expect(viewSource).toMatch(
            /recalculateRecommendedPrice\(\)[\s\S]*?seatPriceCentsFromTripPriceCents\([\s\S]*?this\.trip\.rear_max_two_passengers/s
        );
        expect(viewSource).toMatch(
            /recalculateRecommendedReturnPrice\(\)[\s\S]*?seatPriceCentsFromTripPriceCents\([\s\S]*?this\.otherTrip\.trip\.rear_max_two_passengers/s
        );
        expect(viewSource).toMatch(
            /'trip\.rear_max_two_passengers':\s*function[\s\S]*?recalculateRecommendedPrice\(\)/s
        );
        const recalculateRecommendedPriceBody = viewSource.match(
            /recalculateRecommendedPrice\(\)\s*\{[\s\S]*?validatePrice\(\);\s*\}/
        );
        expect(recalculateRecommendedPriceBody).toBeTruthy();
        expect(recalculateRecommendedPriceBody[0]).not.toContain(
            'this.trip.total_seats + 1'
        );
    });

    it('blocks rear max two with 4 seats and shows validation message', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripRearComfortSeats\.js'/);
        expect(viewSource).toContain('isRearMaxTwoCompatibleWithSeats');
        expect(viewSource).toContain('onOutboundRearMaxTwoChange');
        expect(viewSource).toContain('onReturnRearMaxTwoChange');
        expect(viewSource).toContain('onOutboundSeatRadioAttempt');
        expect(viewSource).toContain('onReturnSeatRadioAttempt');
        expect(viewSource).toContain('guardTotalSeatsAgainstRearComfortConflict');
        expect(viewSource).toContain("$t('rearMaxTwoRequiresThreeOrFewerSeats')");
        expect(viewSource).toMatch(/from '\.\.\/Modal'/);
        expect(viewSource).toContain('showRearMaxTwoSeatsConflictModal');
        expect(viewSource).toMatch(
            /showRearMaxTwoSeatsConflictMessage\(\)\s*\{[\s\S]*?this\.showRearMaxTwoSeatsConflictModal = true/s
        );
        expect(viewSource).toMatch(
            /name="newtrip-rear-comfort-seats-conflict"[\s\S]*?@close="closeRearMaxTwoSeatsConflictModal"/s
        );
        expect(viewSource).not.toContain('dialogs.alert');
        expect(viewSource).toMatch(
            /id="newtrip-comfort-rear-max-two"[\s\S]*?@change="onOutboundRearMaxTwoChange"/s
        );
        expect(viewSource).toMatch(
            /id="otherTrip-comfort-rear-max-two"[\s\S]*?@change="onReturnRearMaxTwoChange"/s
        );
    });

    it('keeps one seat radio selected when rejecting 4 seats with rear max two', () => {
        expect(viewSource).toMatch(
            /id="seats-four"[\s\S]*?onOutboundSeatRadioAttempt\(4,\s*\$event\)/s
        );
        expect(viewSource).toMatch(
            /for="seats-four"[\s\S]*?onOutboundSeatRadioAttempt\(4,\s*\$event\)/s
        );
        expect(viewSource).toMatch(
            /id="otherTrip-seats-four"[\s\S]*?onReturnSeatRadioAttempt\(4,\s*\$event\)/s
        );
        expect(viewSource).toMatch(
            /for="otherTrip-seats-four"[\s\S]*?onReturnSeatRadioAttempt\(4,\s*\$event\)/s
        );
        expect(viewSource).toMatch(
            /onOutboundSeatRadioAttempt\([\s\S]*?shouldBlockSeatSelection\([\s\S]*?event\.preventDefault\(\)[\s\S]*?this\.outboundSeatsRadioRevision \+= 1/s
        );
        expect(viewSource).toMatch(
            /'trip\.total_seats':\s*function\s*\(newValue,\s*oldValue\)[\s\S]*?guardTotalSeatsAgainstRearComfortConflict\([\s\S]*?this\.trip,\s*newValue,\s*oldValue/s
        );
        expect(viewSource).toContain('outboundSeatsRadioRevision');
        expect(viewSource).toContain('returnSeatsRadioRevision');
        expect(viewSource).toContain('name="newtrip-outbound-total-seats"');
        expect(viewSource).not.toMatch(
            /id="seats-four"[\s\S]*?:checked="trip\.total_seats === 4"/s
        );
    });
});

describe('NewTrip.vue trip cars editor modal', () => {
    it('opens in-page cars editor instead of navigating to profile settings', () => {
        expect(viewSource).toContain("$t('editarAutosEnViaje')");
        expect(viewSource).not.toContain("$t('agregarNuevoAutoEnPerfil')");
        expect(viewSource).toContain('TripCarsModal');
        expect(viewSource).toContain('showTripCarsModal');
        expect(viewSource).toContain('openTripCarsModal');
        expect(viewSource).not.toMatch(
            /trip-car-selection[\s\S]*router-link[\s\S]*profile_cars/s
        );
    });

    it('opens cars editor modal when driver has no plate instead of leaving create trip', () => {
        expect(viewSource).toMatch(
            /!hasDriverPlate\(this\.cars\)[\s\S]*?showTripCarsModal = true/s
        );
        expect(viewSource).not.toMatch(
            /!hasDriverPlate\(this\.cars\)[\s\S]*?name:\s*'profile_cars'/s
        );
    });
});

describe('NewTrip.vue incomplete car completion', () => {
    it('blocks driver trip save when selected car lacks marca and modelo', () => {
        expect(viewSource).toContain('CompleteCarModal');
        expect(viewSource).toContain('isCarComplete');
        expect(viewSource).toContain('showCompleteCarModal');
        expect(viewSource).toContain('carToComplete');
        expect(viewSource).toMatch(
            /resolveDriverCarForTrip\(\)[\s\S]*?!isCarComplete\(tripCar\)[\s\S]*?showCompleteCarModal = true/s
        );
    });

    it('renders CompleteCarModal with catalog comboboxes for legacy cars', () => {
        expect(viewSource).toMatch(
            /<CompleteCarModal[\s\S]*?:visible="showCompleteCarModal"/s
        );
    });
});
