export const CATALOG_OTHER_VALUE = 'other';
export const CAR_YEAR_MIN = 1900;

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
        hasCarColor(entry)
    );
}

export function carFormMissingFieldKeys(entry) {
    if (!entry) {
        return ['marca', 'modelo', 'anio', 'color'];
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

export function isCarComplete(car) {
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

    return [
        {
            labelKey: 'marca',
            value: car.brand_name || car.brand_other || ''
        },
        {
            labelKey: 'modelo',
            value: car.model_name || car.model_other || ''
        },
        {
            labelKey: 'anio',
            value:
                car.year !== null && car.year !== undefined && car.year !== ''
                    ? String(car.year)
                    : ''
        },
        {
            labelKey: 'patente',
            value: car.patente || ''
        }
    ];
}

export function carDisplayLabel(car) {
    if (!car) {
        return '';
    }

    const brand = car.brand_name || car.brand_other || '';
    const model = car.model_name || car.model_other || '';
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
            : car.car_model_id || null
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
        modelSelection: null
    };
}

export function carPayloadFromForm(entry) {
    const payload = {
        patente: (entry.patente || '').trim(),
        car_color_id: entry.car_color_id || null,
        year: entry.year === null || entry.year === '' ? null : Number(entry.year)
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
