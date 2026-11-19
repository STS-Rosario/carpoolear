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
    formatCarDropdownLabel,
    carPayloadFromForm,
    CATALOG_OTHER_VALUE,
    CAR_YEAR_MIN,
    getCarYearMax,
    FUEL_TYPES,
    FUEL_CONSUMPTION_LEVELS,
    fuelFamilyForType,
    fuelConsumptionRate,
    fuelConsumptionRateLabel,
    formatFuelConsumptionOptionLabel,
    hasCarFuelProfile,
    carNeedsFuelProfile,
    emptyCarForm,
    buildCarFormFromCar,
    resolveTripFuelProfile
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
                year: 2011,
                fuel_type: 'nafta_super',
                fuel_consumption: 'medium'
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
                year: 2020,
                fuel_type: 'gnc',
                fuel_consumption: 'low'
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
                year: 2020,
                fuel_type: 'gnc',
                fuel_consumption: 'low'
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
        ).toEqual([
            'marca',
            'modelo',
            'anio',
            'color',
            'combustible',
            'consumo'
        ]);
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
                year: 2020,
                fuel_type: 'nafta_super',
                fuel_consumption: 'medium'
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
                year: 2011,
                fuel_type: 'nafta_super',
                fuel_consumption: 'medium'
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
            { labelKey: 'modelo', value: 'Corolla 2020' },
            { labelKey: 'patente', value: 'AB123CD' }
        ]);
    });

    it('combines model and year on one modelo row', () => {
        expect(
            carDetailRows({
                model_name: 'Gol',
                year: 2015
            })
        ).toEqual([
            { labelKey: 'marca', value: '' },
            { labelKey: 'modelo', value: 'Gol 2015' },
            { labelKey: 'patente', value: '' }
        ]);

        expect(
            carDetailRows({
                model_other: 'MiModelo',
                year: ''
            })[1]
        ).toEqual({ labelKey: 'modelo', value: 'MiModelo' });

        expect(
            carDetailRows({
                year: 2018
            })[1]
        ).toEqual({ labelKey: 'modelo', value: '2018' });
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

    it('formats car dropdown label as make model · patente', () => {
        expect(
            formatCarDropdownLabel({
                patente: 'NSG345',
                brand_name: 'Peugeot',
                model_name: '405'
            })
        ).toBe('Peugeot 405 · NSG345');

        expect(
            formatCarDropdownLabel({
                patente: 'ONLY1'
            })
        ).toBe('ONLY1');
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
            model_other: 'MiModelo',
            fuel_type: null,
            fuel_consumption: null
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
            model_other: 'Wagon',
            fuel_type: null,
            fuel_consumption: null
        });
    });

    describe('fuel profile', () => {
        const completeWithoutFuel = {
            patente: 'AB123CD',
            car_brand_id: 1,
            car_model_id: 2,
            car_color_id: 3,
            year: 2020
        };

        it('exposes fuel types and consumption levels', () => {
            expect(FUEL_TYPES).toEqual([
                'gnc',
                'diesel',
                'diesel_premium',
                'nafta_super',
                'nafta_premium'
            ]);
            expect(FUEL_CONSUMPTION_LEVELS).toEqual(['low', 'medium', 'high']);
        });

        it('maps fuel types to rate families', () => {
            expect(fuelFamilyForType('nafta_super')).toBe('nafta');
            expect(fuelFamilyForType('nafta_premium')).toBe('nafta');
            expect(fuelFamilyForType('diesel')).toBe('diesel');
            expect(fuelFamilyForType('diesel_premium')).toBe('diesel');
            expect(fuelFamilyForType('gnc')).toBe('gnc');
            expect(fuelFamilyForType('unknown')).toBe(null);
        });

        it('resolves consumption rate and unit per family', () => {
            expect(fuelConsumptionRate('nafta_super', 'low')).toEqual({
                per100: 7,
                unit: 'liter'
            });
            expect(fuelConsumptionRate('nafta_premium', 'medium')).toEqual({
                per100: 10,
                unit: 'liter'
            });
            expect(fuelConsumptionRate('nafta_premium', 'high')).toEqual({
                per100: 12,
                unit: 'liter'
            });
            expect(fuelConsumptionRate('diesel', 'low').per100).toBe(6);
            expect(fuelConsumptionRate('diesel_premium', 'medium').per100).toBe(
                8
            );
            expect(fuelConsumptionRate('diesel', 'high')).toEqual({
                per100: 10,
                unit: 'liter'
            });
            expect(fuelConsumptionRate('gnc', 'low')).toEqual({
                per100: 7,
                unit: 'm3'
            });
            expect(fuelConsumptionRate('gnc', 'medium').per100).toBe(9);
            expect(fuelConsumptionRate('gnc', 'high').per100).toBe(11);
            expect(fuelConsumptionRate('gnc', 'bogus')).toBe(null);
            expect(fuelConsumptionRate(null, 'low')).toBe(null);
        });

        it('formats rate label with unit', () => {
            expect(fuelConsumptionRateLabel('nafta_super', 'medium')).toBe(
                '10 L/100km'
            );
            expect(fuelConsumptionRateLabel('gnc', 'medium')).toBe(
                '9 m³/100km'
            );
            expect(fuelConsumptionRateLabel('gnc', null)).toBe('');
        });

        it('formats consumption dropdown options with rate units', () => {
            expect(
                formatFuelConsumptionOptionLabel('Bajo', 'nafta_super', 'low')
            ).toBe('Bajo (7 L/100km)');
            expect(
                formatFuelConsumptionOptionLabel('Medio', 'diesel', 'medium')
            ).toBe('Medio (8 L/100km)');
            expect(
                formatFuelConsumptionOptionLabel('Alto', 'gnc', 'high')
            ).toBe('Alto (11 m³/100km)');
            expect(
                formatFuelConsumptionOptionLabel('Bajo', null, 'low')
            ).toBe('Bajo (7 L/100km)');
        });

        it('detects fuel profile on car or form', () => {
            expect(
                hasCarFuelProfile({
                    fuel_type: 'gnc',
                    fuel_consumption: 'low'
                })
            ).toBe(true);
            expect(hasCarFuelProfile({ fuel_type: 'gnc' })).toBe(false);
            expect(hasCarFuelProfile({ fuel_consumption: 'low' })).toBe(false);
            expect(
                hasCarFuelProfile({ fuel_type: 'x', fuel_consumption: 'low' })
            ).toBe(false);
            expect(hasCarFuelProfile(null)).toBe(false);
        });

        it('requires fuel profile for car and form completeness', () => {
            expect(isCarComplete(completeWithoutFuel)).toBe(false);
            expect(
                isCarComplete({
                    ...completeWithoutFuel,
                    fuel_type: 'diesel',
                    fuel_consumption: 'medium'
                })
            ).toBe(true);
            expect(
                isCarFormComplete({
                    brandSelection: 1,
                    modelSelection: 2,
                    car_color_id: 3,
                    year: 2020
                })
            ).toBe(false);
        });

        it('reports missing fuel keys individually', () => {
            const base = {
                brandSelection: 1,
                modelSelection: 2,
                car_color_id: 3,
                year: 2020
            };
            expect(carFormMissingFieldKeys(base)).toEqual([
                'combustible',
                'consumo'
            ]);
            expect(
                carFormMissingFieldKeys({ ...base, fuel_type: 'gnc' })
            ).toEqual(['consumo']);
            expect(
                carFormMissingFieldKeys({ ...base, fuel_consumption: 'low' })
            ).toEqual(['combustible']);
        });

        it('flags cars missing only fuel as needing completion', () => {
            const cars = [{ id: 1, ...completeWithoutFuel }];
            expect(carsNeedingCompletion(cars)).toEqual(cars);
        });

        it('detects cars that are complete except for fuel', () => {
            expect(carNeedsFuelProfile(completeWithoutFuel)).toBe(true);
            expect(
                carNeedsFuelProfile({
                    ...completeWithoutFuel,
                    fuel_type: 'gnc',
                    fuel_consumption: 'low'
                })
            ).toBe(false);
            expect(carNeedsFuelProfile({ patente: 'AB123CD' })).toBe(false);
            expect(carNeedsFuelProfile(null)).toBe(false);
        });

        it('includes fuel in empty form and build from car', () => {
            expect(emptyCarForm()).toMatchObject({
                fuel_type: null,
                fuel_consumption: null
            });
            expect(
                buildCarFormFromCar({
                    id: 1,
                    patente: 'A',
                    fuel_type: 'gnc',
                    fuel_consumption: 'high'
                })
            ).toMatchObject({ fuel_type: 'gnc', fuel_consumption: 'high' });
            expect(buildCarFormFromCar({ id: 1 })).toMatchObject({
                fuel_type: null,
                fuel_consumption: null
            });
        });

        it('includes fuel in payload', () => {
            expect(
                carPayloadFromForm({
                    patente: 'AB123CD',
                    car_color_id: 3,
                    year: 2018,
                    brandSelection: CATALOG_OTHER_VALUE,
                    brand_other: 'Custom',
                    model_other: 'Wagon',
                    fuel_type: 'diesel_premium',
                    fuel_consumption: 'low'
                })
            ).toMatchObject({
                fuel_type: 'diesel_premium',
                fuel_consumption: 'low'
            });
        });

        it('adds fuel rows to detail rows when present', () => {
            expect(
                carDetailRows({
                    brand_name: 'Toyota',
                    model_name: 'Corolla',
                    year: 2020,
                    patente: 'AB123CD',
                    fuel_type: 'gnc',
                    fuel_consumption: 'medium'
                })
            ).toEqual([
                { labelKey: 'marca', value: 'Toyota' },
                { labelKey: 'modelo', value: 'Corolla 2020' },
                { labelKey: 'patente', value: 'AB123CD' },
                {
                    labelKey: 'fuelType',
                    value: 'gnc',
                    valueKey: 'fuelTypeGnc'
                },
                {
                    labelKey: 'fuelConsumption',
                    value: 'medium',
                    valueKey: 'fuelConsumptionMedium',
                    rateLabel: '9 m³/100km'
                }
            ]);
        });
    });

    describe('resolveTripFuelProfile', () => {
        it('prefers the trip snapshot over the car', () => {
            expect(
                resolveTripFuelProfile({
                    fuel_type: 'diesel',
                    fuel_consumption: 'high',
                    car: { fuel_type: 'gnc', fuel_consumption: 'low' }
                })
            ).toEqual({ fuel_type: 'diesel', fuel_consumption: 'high' });
        });

        it('falls back to the car when the trip has no snapshot', () => {
            expect(
                resolveTripFuelProfile({
                    fuel_type: null,
                    fuel_consumption: null,
                    car: { fuel_type: 'gnc', fuel_consumption: 'low' }
                })
            ).toEqual({ fuel_type: 'gnc', fuel_consumption: 'low' });
        });

        it('returns null when neither trip nor car has a fuel profile', () => {
            expect(resolveTripFuelProfile({ car: {} })).toBe(null);
            expect(resolveTripFuelProfile(null)).toBe(null);
        });
    });
});
