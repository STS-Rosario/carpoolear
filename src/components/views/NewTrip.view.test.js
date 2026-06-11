import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'NewTrip.vue');
const wizardPath = path.resolve(__dirname, 'NewTripCreationWizard.vue');
const carStepPanelPath = path.resolve(
    __dirname,
    '../elements/TripCarStepPanel.vue'
);
const viewSource = fs.readFileSync(viewPath, 'utf8');
const wizardSource = fs.readFileSync(wizardPath, 'utf8');
const carStepPanelSource = fs.readFileSync(carStepPanelPath, 'utf8');
const uiSource = viewSource + wizardSource + carStepPanelSource;

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
        expect(uiSource).toMatch(/min="0"/s);
        expect(uiSource).toContain('form-control-price');
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
    it('defaults autoaccept friends requests to checked on new trips', () => {
        expect(uiSource).toContain("$t('aceptarPedidosAmigosAutomaticamente')");
        expect(uiSource).toContain('autoaccept_friends_requests');
        expect(viewSource).toMatch(/autoaccept_friends_requests:\s*true/);
        expect(uiSource).toContain('checkbox-trip-autoaccept-friends');
    });

    it('includes autoaccept_friends_requests in create payload normalization', () => {
        expect(viewSource).toMatch(
            /normalizeAllowFlagsForApi\(trip\)[\s\S]*?autoaccept_friends_requests/s
        );
    });
});

describe('NewTrip.vue rear seat comfort preference', () => {
    it('shows comfort section after seats with unchecked checkbox for drivers', () => {
        expect(uiSource).toContain("$t('atrasViajanSolo2Personas')");
        expect(uiSource).toContain('trip-comfort-preference');
        expect(uiSource).toContain('onOutboundRearMaxTwoChange');
        expect(viewSource).toMatch(/rear_max_two_passengers:\s*false/);
    });

    it('normalizes rear seat preference for API and supports return trips', () => {
        expect(viewSource).toMatch(
            /normalizeAllowFlagsForApi\(trip\)[\s\S]*?trip\.rear_max_two_passengers = trip\.rear_max_two_passengers \? 1 : 0/s
        );
        expect(viewSource).toMatch(/otherTrip\.trip\.rear_max_two_passengers/);
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
        expect(uiSource).toContain('onOutboundRearMaxTwoChange');
        expect(viewSource).toContain('onReturnRearMaxTwoChange');
    });

    it('keeps seat selection guarded when rear max two conflicts with four seats', () => {
        expect(viewSource).toContain('onOutboundSeatRadioAttempt');
        expect(viewSource).toContain('onReturnSeatRadioAttempt');
        expect(viewSource).toMatch(
            /onOutboundSeatRadioAttempt\([\s\S]*?shouldBlockSeatSelection\([\s\S]*?event\.preventDefault\(\)/s
        );
        expect(viewSource).toMatch(
            /'trip\.total_seats':\s*function\s*\(newValue,\s*oldValue\)[\s\S]*?guardTotalSeatsAgainstRearComfortConflict/s
        );
        expect(viewSource).toContain('outboundSeatsRadioRevision');
        expect(viewSource).toContain('returnSeatsRadioRevision');
    });
});

describe('NewTrip.vue trip cars editor modal', () => {
    it('opens in-page cars editor instead of navigating to profile settings', () => {
        expect(carStepPanelSource).toContain("$t('editarAutosEnViaje')");
        expect(carStepPanelSource).toContain("$emit('edit-cars')");
        expect(wizardSource).toContain('@edit-cars="form.openTripCarsModal"');
        expect(uiSource).not.toContain("$t('agregarNuevoAutoEnPerfil')");
        expect(viewSource).toContain('TripCarsModal');
        expect(viewSource).toContain('showTripCarsModal');
        expect(viewSource).toContain('openTripCarsModal');
        expect(wizardSource).toContain('TripCarStepPanel');
        expect(uiSource).not.toMatch(
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

describe('NewTrip.vue trip creation template snapshot', () => {
    it('passes a creation snapshot to the success screen for template saving', () => {
        expect(viewSource).toContain(':creation-snapshot="creationSnapshot"');
        expect(viewSource).toContain('creationSnapshot: null');
        expect(viewSource).toMatch(
            /createTrip\(trip\)[\s\S]*?this\.creationSnapshot = buildOutboundTripCreationSnapshot\(this\)/s
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
