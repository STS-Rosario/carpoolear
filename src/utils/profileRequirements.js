function hasValue(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function hasRequiredProfileFields(user) {
    if (!user) {
        return false;
    }

    return (
        hasValue(user.image) &&
        hasValue(user.description) &&
        hasValue(user.nro_doc) &&
        hasValue(user.mobile_phone)
    );
}

export function firstCarWithPlate(cars) {
    if (!Array.isArray(cars)) {
        return null;
    }

    return cars.find((car) => car && hasValue(car.patente)) || null;
}

export function hasDriverPlate(cars) {
    return !!firstCarWithPlate(cars);
}

export function requiresDriverPlate(trip) {
    if (!trip) {
        return false;
    }

    return !(
        trip.is_passenger === 1 ||
        trip.is_passenger === '1' ||
        trip.is_passenger === true
    );
}
