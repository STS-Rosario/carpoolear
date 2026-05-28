import { describe, expect, it } from 'vitest';
import {
    activeCarsWithPlate,
    buildPatenteRowsFromCars,
    needsCarSelection,
    resolveTripCarId
} from './userCars';

describe('userCars', () => {
    it('builds a single empty row when the user has no cars', () => {
        expect(buildPatenteRowsFromCars([])).toEqual([{ id: null, patente: '' }]);
        expect(buildPatenteRowsFromCars(null)).toEqual([{ id: null, patente: '' }]);
    });

    it('maps stored cars to editable rows', () => {
        expect(
            buildPatenteRowsFromCars([
                { id: 1, patente: 'ABC123' },
                { id: 2, patente: 'XYZ789' }
            ])
        ).toEqual([
            { id: 1, patente: 'ABC123' },
            { id: 2, patente: 'XYZ789' }
        ]);
    });

    it('requires explicit car selection when multiple plates exist', () => {
        const cars = [
            { id: 1, patente: 'AAA111' },
            { id: 2, patente: 'BBB222' }
        ];

        expect(needsCarSelection(cars)).toBe(true);
        expect(resolveTripCarId(cars, null)).toBeUndefined();
        expect(resolveTripCarId(cars, 2)).toBe(2);
    });

    it('auto-resolves the only active car', () => {
        const cars = [{ id: 5, patente: 'ONLY1' }];

        expect(needsCarSelection(cars)).toBe(false);
        expect(resolveTripCarId(cars, null)).toBe(5);
    });

    it('ignores cars without a plate when resolving trip car', () => {
        const cars = [
            { id: 1, patente: '   ' },
            { id: 2, patente: 'OK123' }
        ];

        expect(activeCarsWithPlate(cars)).toEqual([{ id: 2, patente: 'OK123' }]);
        expect(resolveTripCarId(cars, null)).toBe(2);
    });
});
