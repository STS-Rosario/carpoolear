import { describe, it, expect } from 'vitest';
import {
    isCarComplete,
    isValidCarYear,
    carsNeedingCompletion,
    carDetailRows,
    carDisplayLabel,
    carPayloadFromForm,
    CATALOG_OTHER_VALUE,
    CAR_YEAR_MIN,
    getCarYearMax
} from './carFields.js';

describe('carFields', () => {
    it('detects complete catalog car', () => {
        expect(
            isCarComplete({
                patente: 'AB123CD',
                car_brand_id: 1,
                car_model_id: 2,
                year: 2020
            })
        ).toBe(true);
    });

    it('detects incomplete patente-only car', () => {
        expect(isCarComplete({ patente: 'AB123CD' })).toBe(false);
    });

    it('detects incomplete car without year', () => {
        expect(
            isCarComplete({
                patente: 'AB123CD',
                car_brand_id: 1,
                car_model_id: 2
            })
        ).toBe(false);
    });

    it('validates year range', () => {
        expect(isValidCarYear(2020)).toBe(true);
        expect(isValidCarYear(CAR_YEAR_MIN)).toBe(true);
        expect(isValidCarYear(getCarYearMax())).toBe(true);
        expect(isValidCarYear(1899)).toBe(false);
        expect(isValidCarYear(getCarYearMax() + 1)).toBe(false);
    });

    it('lists cars needing completion', () => {
        const cars = [
            { id: 1, patente: 'A', car_brand_id: 1, car_model_id: 2, year: 2020 },
            { id: 2, patente: 'B' }
        ];

        expect(carsNeedingCompletion(cars)).toEqual([cars[1]]);
    });

    it('builds detail rows for trip car display', () => {
        expect(
            carDetailRows({
                brand_name: 'Toyota',
                model_name: 'Corolla',
                year: 2020,
                patente: 'AB123CD'
            })
        ).toEqual([
            { labelKey: 'marca', value: 'Toyota' },
            { labelKey: 'modelo', value: 'Corolla' },
            { labelKey: 'anio', value: '2020' },
            { labelKey: 'patente', value: 'AB123CD' }
        ]);
    });

    it('builds display label with catalog names', () => {
        expect(
            carDisplayLabel({
                patente: 'AB123CD',
                brand_name: 'Toyota',
                model_name: 'Corolla',
                color_name: 'Blanco',
                year: 2020
            })
        ).toBe('Toyota · Corolla · 2020 · Blanco · AB123CD');
    });

    it('builds payload for other brand and model', () => {
        expect(
            carPayloadFromForm({
                patente: 'AB123CD',
                car_color_id: 3,
                year: 2018,
                brandSelection: CATALOG_OTHER_VALUE,
                brand_other: 'Custom',
                model_other: 'Wagon'
            })
        ).toEqual({
            patente: 'AB123CD',
            car_color_id: 3,
            year: 2018,
            brand_other: 'Custom',
            model_other: 'Wagon'
        });
    });
});
