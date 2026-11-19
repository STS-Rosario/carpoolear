export const CATALOG_OTHER_VALUE = 'other';
export const CAR_YEAR_MIN = 1900;

export const FUEL_TYPES = [
    'gnc',
    'diesel',
    'diesel_premium',
    'nafta_super',
    'nafta_premium'
];
export const FUEL_CONSUMPTION_LEVELS = ['low', 'medium', 'high'];

const FUEL_FAMILY_BY_TYPE = {
    gnc: 'gnc',
    diesel: 'diesel',
    diesel_premium: 'diesel',
    nafta_super: 'nafta',
    nafta_premium: 'nafta'
};

const FUEL_CONSUMPTION_TABLES = {
    nafta: { unit: 'liter', low: 7, medium: 10, high: 12 },
    diesel: { unit: 'liter', low: 6, medium: 8, high: 10 },
    gnc: { unit: 'm3', low: 7, medium: 9, high: 11 }
};

const FUEL_UNIT_LABELS = { liter: 'L', m3: 'm³' };

export function fuelFamilyForType(fuelType) {
    return FUEL_FAMILY_BY_TYPE[fuelType] || null;
}

export function fuelConsumptionRate(fuelType, level) {
    const family = fuelFamilyForType(fuelType);

    if (!family || !FUEL_CONSUMPTION_LEVELS.includes(level)) {
        return null;
    }

    const table = FUEL_CONSUMPTION_TABLES[family];

    return { per100: table[level], unit: table.unit };
}

export function fuelConsumptionRateLabel(fuelType, level) {
    const rate = fuelConsumptionRate(fuelType, level);

    if (!rate) {
        return '';
    }

    return `${rate.per100} ${FUEL_UNIT_LABELS[rate.unit]}/100km`;
}

function upperFirstCamel(value) {
    return String(value)
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

export function fuelTypeI18nKey(fuelType) {
    return `fuelType${upperFirstCamel(fuelType)}`;
}

export function fuelConsumptionI18nKey(level) {
    return `fuelConsumption${upperFirstCamel(level)}`;
}

export function hasCarFuelProfile(carOrForm) {
    if (!carOrForm) {
        return false;
    }

    return (
        FUEL_TYPES.includes(carOrForm.fuel_type) &&
        FUEL_CONSUMPTION_LEVELS.includes(carOrForm.fuel_consumption)
    );
}

export function resolveTripFuelProfile(trip) {
    if (!trip) {
        return null;
    }

    if (hasCarFuelProfile(trip)) {
        return {
            fuel_type: trip.fuel_type,
            fuel_consumption: trip.fuel_consumption
        };
    }

    if (hasCarFuelProfile(trip.car)) {
        return {
            fuel_type: trip.car.fuel_type,
            fuel_consumption: trip.car.fuel_consumption
        };
    }

    return null;
}

export function getCarYearMax() {
    return new Date().getFullYear();
}

export function isValidCarYear(year) {
    if (year === null || year === undefined || year === '') {
        return false;
    }

    const parsed = Number(year);

    return (
        Number.isInteger(parsed) &&
        parsed >= CAR_YEAR_MIN &&
        parsed <= getCarYearMax()
    );
}

export function hasCarBrandAndModel(carOrForm) {
    if (
        carOrForm.brandSelection === CATALOG_OTHER_VALUE ||
        (hasValue(carOrForm.brand_other) && !carOrForm.car_brand_id)
    ) {
        return (
            hasValue(carOrForm.brand_other) && hasValue(carOrForm.model_other)
        );
    }

    if (carOrForm.car_brand_id && hasValue(carOrForm.model_other)) {
        return true;
    }

    const brandId = carOrForm.car_brand_id || carOrForm.brandSelection;
    const modelSelection =
        carOrForm.car_model_id || carOrForm.modelSelection;

    if (modelSelection === CATALOG_OTHER_VALUE) {
        return Boolean(brandId) && hasValue(carOrForm.model_other);
    }

    if (carOrForm.car_brand_id && carOrForm.car_model_id) {
        return true;
    }

    return Boolean(brandId && modelSelection);
}

export function hasCarColor(carOrForm) {
    return (
        carOrForm.car_color_id !== null &&
        carOrForm.car_color_id !== undefined &&
        carOrForm.car_color_id !== ''
    );
}

export function isCarFormComplete(entry) {
    if (!entry) {
        return false;
    }

    return (
        hasCarBrandAndModel(entry) &&
        isValidCarYear(entry.year) &&
        hasCarColor(entry) &&
        hasCarFuelProfile(entry)
    );
}

export function carFormMissingFieldKeys(entry) {
    if (!entry) {
        return ['marca', 'modelo', 'anio', 'color', 'combustible', 'consumo'];
    }

    const missing = [];

    if (!hasCarBrand(entry)) {
        missing.push('marca');
    }

    if (!hasCarModel(entry)) {
        missing.push('modelo');
    }

    if (!isValidCarYear(entry.year)) {
        missing.push('anio');
    }

    if (!hasCarColor(entry)) {
        missing.push('color');
    }

    if (!FUEL_TYPES.includes(entry.fuel_type)) {
        missing.push('combustible');
    }

    if (!FUEL_CONSUMPTION_LEVELS.includes(entry.fuel_consumption)) {
        missing.push('consumo');
    }

    return missing;
}

function hasCarBrand(entry) {
    if (entry.brandSelection === CATALOG_OTHER_VALUE) {
        return hasValue(entry.brand_other);
    }

    return Boolean(entry.car_brand_id || entry.brandSelection);
}

function hasCarModel(entry) {
    if (entry.brandSelection === CATALOG_OTHER_VALUE) {
        return hasValue(entry.model_other);
    }

    if (entry.modelSelection === CATALOG_OTHER_VALUE) {
        return hasValue(entry.model_other);
    }

    return Boolean(entry.car_model_id || entry.modelSelection);
}

function isCarCompleteWithoutFuel(car) {
    if (!car || !hasValue(car.patente)) {
        return false;
    }

    if (!isValidCarYear(car.year)) {
        return false;
    }

    if (!hasCarColor(car)) {
        return false;
    }

    return hasCarBrandAndModel(car);
}

export function isCarComplete(car) {
    return isCarCompleteWithoutFuel(car) && hasCarFuelProfile(car);
}

export function carNeedsFuelProfile(car) {
    return isCarCompleteWithoutFuel(car) && !hasCarFuelProfile(car);
}

export function carsNeedingCompletion(cars) {
    if (!Array.isArray(cars)) {
        return [];
    }

    return cars.filter((car) => car && hasValue(car.patente) && !isCarComplete(car));
}

export function carDetailRows(car) {
    if (!car) {
        return [];
    }

    const model = car.model_name || car.model_other || '';
    const year =
        car.year !== null && car.year !== undefined && car.year !== ''
            ? String(car.year)
            : '';
    const modelWithYear = [model, year].filter(hasValue).join(' ');

    const rows = [
        {
            labelKey: 'marca',
            value: car.brand_name || car.brand_other || ''
        },
        {
            labelKey: 'modelo',
            value: modelWithYear
        },
        {
            labelKey: 'patente',
            value: car.patente || ''
        }
    ];

    if (hasCarFuelProfile(car)) {
        rows.push(
            {
                labelKey: 'fuelType',
                value: car.fuel_type,
                valueKey: fuelTypeI18nKey(car.fuel_type)
            },
            {
                labelKey: 'fuelConsumption',
                value: car.fuel_consumption,
                valueKey: fuelConsumptionI18nKey(car.fuel_consumption),
                rateLabel: fuelConsumptionRateLabel(
                    car.fuel_type,
                    car.fuel_consumption
                )
            }
        );
    }

    return rows;
}

export function carMakeName(car) {
    if (!car) {
        return '';
    }

    return car.brand_name || car.brand_other || '';
}

export function carModelName(car) {
    if (!car) {
        return '';
    }

    return car.model_name || car.model_other || '';
}

export function formatCarSelectLabel(car) {
    if (!car) {
        return '';
    }

    const patente = String(car.patente || '').trim();
    const makeModel = [carMakeName(car), carModelName(car)]
        .map((part) => String(part || '').trim())
        .filter(hasValue)
        .join(' ');

    if (patente && makeModel) {
        return `${patente} (${makeModel})`;
    }

    if (patente) {
        return patente;
    }

    return makeModel;
}

export function formatCarDropdownLabel(car) {
    if (!car) {
        return '';
    }

    const patente = String(car.patente || '').trim();
    const makeModel = [carMakeName(car), carModelName(car)]
        .map((part) => String(part || '').trim())
        .filter(hasValue)
        .join(' ');

    if (patente && makeModel) {
        return `${makeModel} · ${patente}`;
    }

    if (patente) {
        return patente;
    }

    return makeModel;
}

export function carDisplayLabel(car) {
    if (!car) {
        return '';
    }

    const brand = carMakeName(car);
    const model = carModelName(car);
    const color = car.color_name || '';
    const year = isValidCarYear(car.year) ? String(car.year) : '';
    const parts = [brand, model, year, color, car.patente].filter(hasValue);

    return parts.join(' · ');
}

export function buildCarFormFromCar(car) {
    if (!car) {
        return emptyCarForm();
    }

    return {
        id: car.id || null,
        patente: car.patente || '',
        car_brand_id: car.car_brand_id || null,
        car_model_id: car.car_model_id || null,
        brand_other: car.brand_other || '',
        model_other: car.model_other || '',
        car_color_id: car.car_color_id || null,
        year: car.year ?? null,
        brandSelection: car.brand_other
            ? CATALOG_OTHER_VALUE
            : car.car_brand_id || null,
        modelSelection: car.model_other
            ? CATALOG_OTHER_VALUE
            : car.car_model_id || null,
        fuel_type: car.fuel_type || null,
        fuel_consumption: car.fuel_consumption || null
    };
}

export function emptyCarForm() {
    return {
        id: null,
        patente: '',
        car_brand_id: null,
        car_model_id: null,
        brand_other: '',
        model_other: '',
        car_color_id: null,
        year: null,
        brandSelection: null,
        modelSelection: null,
        fuel_type: null,
        fuel_consumption: null
    };
}

export function carPayloadFromForm(entry) {
    const payload = {
        patente: (entry.patente || '').trim(),
        car_color_id: entry.car_color_id || null,
        year: entry.year === null || entry.year === '' ? null : Number(entry.year),
        fuel_type: entry.fuel_type || null,
        fuel_consumption: entry.fuel_consumption || null
    };

    if (entry.brandSelection === CATALOG_OTHER_VALUE) {
        payload.brand_other = (entry.brand_other || '').trim();
        payload.model_other = (entry.model_other || '').trim();
    } else {
        payload.car_brand_id = entry.car_brand_id || entry.brandSelection;
        if (entry.modelSelection === CATALOG_OTHER_VALUE) {
            payload.model_other = (entry.model_other || '').trim();
        } else {
            payload.car_model_id = entry.car_model_id || entry.modelSelection;
        }
    }

    return payload;
}

function hasValue(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}
