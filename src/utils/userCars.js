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

export function tripCarIdFromPayload(trip) {
    if (!trip) {
        return null;
    }

    if (trip.car_id != null && trip.car_id !== '') {
        return trip.car_id;
    }

    if (trip.car && trip.car.id != null) {
        return trip.car.id;
    }

    return null;
}

export function isActiveCarId(cars, carId) {
    if (carId == null || carId === '') {
        return false;
    }

    return activeCarsWithPlate(cars).some(
        (car) => String(car.id) === String(carId)
    );
}

export function restoreSelectedCarIdFromTrip(trip, cars = null) {
    const carId = tripCarIdFromPayload(trip);
    if (carId == null) {
        return null;
    }

    if (cars == null) {
        return carId;
    }

    return isActiveCarId(cars, carId) ? carId : null;
}

export function resolveTripCarId(cars, selectedCarId) {
    const withPlate = activeCarsWithPlate(cars);

    if (withPlate.length === 0) {
        return undefined;
    }

    if (selectedCarId != null && selectedCarId !== '') {
        const match = withPlate.find(
            (car) => String(car.id) === String(selectedCarId)
        );
        if (match) {
            return match.id;
        }
    }

    if (withPlate.length === 1) {
        return withPlate[0].id;
    }

    return undefined;
}
