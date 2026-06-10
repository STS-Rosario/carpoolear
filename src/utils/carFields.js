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

export function isCarComplete(car) {
    if (!car || !hasValue(car.patente)) {
        return false;
    }

    if (!isValidCarYear(car.year)) {
        return false;
    }

    const hasCatalogIds = car.car_brand_id && car.car_model_id;
    const hasOther =
        hasValue(car.brand_other) && hasValue(car.model_other);

    return Boolean(hasCatalogIds || hasOther);
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
