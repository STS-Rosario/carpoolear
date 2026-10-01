export function swapSearchLocations(origin, destination) {
    return {
        origin: Object.assign({}, destination),
        destination: Object.assign({}, origin)
    };
}
