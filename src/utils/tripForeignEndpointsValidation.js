export function isTripPointInHomeCountry(point, osmCountry) {
    return point?.json?.country === osmCountry;
}

export function hasTooManyForeignTripEndpoints(points, osmCountry) {
    if (!Array.isArray(points) || points.length < 2) {
        return false;
    }

    const origin = points[0];
    const destination = points[points.length - 1];
    let foreignEndpoints = 0;

    if (!isTripPointInHomeCountry(origin, osmCountry)) {
        foreignEndpoints += 1;
    }

    if (!isTripPointInHomeCountry(destination, osmCountry)) {
        foreignEndpoints += 1;
    }

    return foreignEndpoints > 1;
}
