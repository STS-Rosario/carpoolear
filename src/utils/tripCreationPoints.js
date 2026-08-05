export function getIntermediatePoints(points = []) {
    if (!Array.isArray(points) || points.length <= 2) {
        return [];
    }

    return points.slice(1, points.length - 1);
}

export function removeEmptyIntermediatePoints(points = []) {
    if (!Array.isArray(points) || points.length <= 2) {
        return [...points];
    }

    const origin = points[0];
    const destination = points[points.length - 1];
    const filledStops = getIntermediatePoints(points).filter(
        (point) => point.name && point.json
    );

    return [origin, ...filledStops, destination];
}

export function filterTripPointsForSave(points = []) {
    return removeEmptyIntermediatePoints(points).filter(
        (point) => point.name && point.json && point.location && point.place
    );
}
