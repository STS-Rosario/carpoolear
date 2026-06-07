import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'NewTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

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
        expect(viewSource).toContain('onOutboundTotalSeatsChange');
        expect(viewSource).toContain('onReturnTotalSeatsChange');
        expect(viewSource).toContain("$t('rearMaxTwoRequiresThreeOrFewerSeats')");
        expect(viewSource).toMatch(
            /id="newtrip-comfort-rear-max-two"[\s\S]*?@change="onOutboundRearMaxTwoChange"/s
        );
        expect(viewSource).toMatch(
            /id="otherTrip-comfort-rear-max-two"[\s\S]*?@change="onReturnRearMaxTwoChange"/s
        );
    });
});
