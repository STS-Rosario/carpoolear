import { describe, expect, it } from 'vitest';
import {
    activeCarsWithPlate,
    buildPatenteRowsFromCars,
    canRemoveSavedCar,
    canShowRemoveCarRow,
    isActiveCarId,
    needsCarSelection,
    resolveTripCarId,
    restoreSelectedCarIdFromTrip,
    tripCarIdFromPayload
} from './userCars';

describe('userCars', () => {
    it('builds a single empty row when the user has no cars', () => {
        const row = buildPatenteRowsFromCars([])[0];
        expect(row.id).toBeNull();
        expect(row.patente).toBe('');
        expect(row.brandSelection).toBeNull();
    });

    it('maps stored cars to editable rows', () => {
        const rows = buildPatenteRowsFromCars([
            {
                id: 1,
                patente: 'ABC123',
                car_brand_id: 10,
                car_model_id: 20,
                car_color_id: 3,
                year: 2019
            }
        ]);

        expect(rows[0].patente).toBe('ABC123');
        expect(rows[0].brandSelection).toBe(10);
        expect(rows[0].modelSelection).toBe(20);
        expect(rows[0].car_color_id).toBe(3);
        expect(rows[0].year).toBe(2019);
    });

    it('requires explicit car selection when multiple plates exist', () => {
        const cars = [
            { id: 1, patente: 'AAA111' },
            { id: 2, patente: 'BBB222' }
        ];

        expect(needsCarSelection(cars)).toBe(true);
        expect(resolveTripCarId(cars, null)).toBeUndefined();
        expect(resolveTripCarId(cars, 2)).toBe(2);
        expect(resolveTripCarId(cars, 99)).toBeUndefined();
    });

    it('auto-resolves the only active car when selection is missing or stale', () => {
        const cars = [{ id: 5, patente: 'ONLY1' }];

        expect(needsCarSelection(cars)).toBe(false);
        expect(resolveTripCarId(cars, null)).toBe(5);
        expect(resolveTripCarId(cars, 99)).toBe(5);
    });

    it('restores selected car id from trip payload when editing', () => {
        expect(tripCarIdFromPayload({ car_id: 9 })).toBe(9);
        expect(tripCarIdFromPayload({ car: { id: 4, patente: 'XY' } })).toBe(4);
        expect(tripCarIdFromPayload({})).toBeNull();
        expect(restoreSelectedCarIdFromTrip({ car_id: 9 })).toBe(9);
        expect(restoreSelectedCarIdFromTrip({ car: { id: 4, patente: 'XY' } })).toBe(4);
        expect(restoreSelectedCarIdFromTrip({})).toBeNull();
    });

    it('ignores soft-deleted trip cars when restoring edit selection', () => {
        const activeCars = [{ id: 2, patente: 'NEW002' }];

        expect(isActiveCarId(activeCars, 1)).toBe(false);
        expect(restoreSelectedCarIdFromTrip({ car_id: 1 }, activeCars)).toBeNull();
        expect(restoreSelectedCarIdFromTrip({ car_id: 2 }, activeCars)).toBe(2);
    });

    it('ignores cars without a plate when resolving trip car', () => {
        const cars = [
            { id: 1, patente: '   ' },
            { id: 2, patente: 'OK123' }
        ];

        expect(activeCarsWithPlate(cars)).toEqual([{ id: 2, patente: 'OK123' }]);
        expect(resolveTripCarId(cars, null)).toBe(2);
    });

    it('allows removing a saved car even when it is the only row', () => {
        expect(canRemoveSavedCar({ id: 12, patente: 'ABC123' })).toBe(true);
    });

    it('does not allow removing an unsaved empty row', () => {
        expect(canRemoveSavedCar({ id: null, patente: '' })).toBe(false);
        expect(canRemoveSavedCar({ id: null, patente: 'NEW123' })).toBe(false);
    });

    it('shows remove control for unsaved extra rows or any saved row', () => {
        expect(canShowRemoveCarRow({ id: 1, patente: 'X' }, 1)).toBe(true);
        expect(canShowRemoveCarRow({ id: null, patente: '' }, 2)).toBe(true);
        expect(canShowRemoveCarRow({ id: null, patente: '' }, 1)).toBe(false);
    });
});
