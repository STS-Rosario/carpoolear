function hasValue(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function buildPatenteRowsFromCars(cars) {
    if (!Array.isArray(cars) || cars.length === 0) {
        return [{ id: null, patente: '' }];
    }

    return cars.map((car) => ({
        id: car.id,
        patente: car.patente || ''
    }));
}

export function activeCarsWithPlate(cars) {
    if (!Array.isArray(cars)) {
        return [];
    }

    return cars.filter((car) => car && hasValue(car.patente));
}

export function needsCarSelection(cars) {
    return activeCarsWithPlate(cars).length > 1;
}

export function resolveTripCarId(cars, selectedCarId) {
    const withPlate = activeCarsWithPlate(cars);

    if (withPlate.length === 0) {
        return undefined;
    }

    if (withPlate.length === 1) {
        return withPlate[0].id;
    }

    if (selectedCarId != null && selectedCarId !== '') {
        const match = withPlate.find(
            (car) => String(car.id) === String(selectedCarId)
        );
        if (match) {
            return match.id;
        }
    }

    return undefined;
}
