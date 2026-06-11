import { describe, it, expect } from 'vitest';
import {
    isCarComplete,
    isCarFormComplete,
    carFormMissingFieldKeys,
    isValidCarYear,
    carsNeedingCompletion,
    carDetailRows,
    carDisplayLabel,
    formatCarSelectLabel,
    carPayloadFromForm,
    CATALOG_OTHER_VALUE,
    CAR_YEAR_MIN,
    getCarYearMax
} from './carFields.js';

describe('carFields', () => {
    it('detects complete car with catalog brand and custom model', () => {
        expect(
            isCarComplete({
                patente: 'AE322FE',
                car_brand_id: 21,
                brand_name: 'FORD',
                model_other: 'MiModelo',
                car_color_id: 3,
                year: 2011
            })
        ).toBe(true);
    });

    it('detects complete catalog car', () => {
        expect(
            isCarComplete({
                patente: 'AB123CD',
                car_brand_id: 1,
                car_model_id: 2,
                car_color_id: 3,
                year: 2020
            })
        ).toBe(true);
    });

    it('detects incomplete car without color', () => {
        expect(
            isCarComplete({
                patente: 'AB123CD',
                car_brand_id: 1,
                car_model_id: 2,
                year: 2020
            })
        ).toBe(false);
    });

    it('detects complete car form with catalog selections', () => {
        expect(
            isCarFormComplete({
                brandSelection: 1,
                modelSelection: 2,
                car_color_id: 3,
                year: 2020
            })
        ).toBe(true);
    });

    it('lists missing car form fields for profile autos CRUD', () => {
        expect(
            carFormMissingFieldKeys({
                brandSelection: null,
                modelSelection: null,
                year: null,
                car_color_id: null
            })
        ).toEqual(['marca', 'modelo', 'anio', 'color']);
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
            {
                id: 1,
                patente: 'A',
                car_brand_id: 1,
                car_model_id: 2,
                car_color_id: 3,
                year: 2020
            },
            { id: 2, patente: 'B' }
        ];

        expect(carsNeedingCompletion(cars)).toEqual([cars[1]]);
    });

    it('does not flag catalog brand with custom model as needing completion', () => {
        const cars = [
            {
                id: 1,
                patente: 'AE322FE',
                car_brand_id: 21,
                brand_name: 'FORD',
                model_other: 'MiModelo',
                car_color_id: 3,
                year: 2011
            },
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

    it('formats car select label as patente (make model)', () => {
        expect(
            formatCarSelectLabel({
                patente: 'AE255HI',
                brand_name: 'Renault',
                model_name: 'Sandero'
            })
        ).toBe('AE255HI (Renault Sandero)');

        expect(
            formatCarSelectLabel({
                patente: 'ABC123',
                brand_other: 'Custom',
                model_other: 'Van'
            })
        ).toBe('ABC123 (Custom Van)');

        expect(formatCarSelectLabel({ patente: 'ONLY1' })).toBe('ONLY1');
    });

    it('builds payload for catalog brand with other model', () => {
        expect(
            carPayloadFromForm({
                patente: 'AE322FE',
                car_color_id: 3,
                year: 2011,
                brandSelection: 21,
                car_brand_id: 21,
                modelSelection: CATALOG_OTHER_VALUE,
                model_other: 'MiModelo'
            })
        ).toEqual({
            patente: 'AE322FE',
            car_color_id: 3,
            year: 2011,
            car_brand_id: 21,
            model_other: 'MiModelo'
        });
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
