export function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export function pointDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000.0; // Distance in km
    return isNaN(d) ? 1000 : d;
}

export function parseStreet(result) {
    const address = {};
    for (const i in result.address_components) {
        const obj = result.address_components[i];
        const nombreLong = obj.long_name;
        const nombreShort = obj.short_name;
        switch (obj.types[0]) {
        case 'country':
            address.pais = nombreLong;
            break;
        case 'administrative_area_level_1':
            address.provincia = nombreShort.replace('Provincia de ', '');
            break;
        case 'locality':
            address.ciudad = nombreLong.replace('Ciudad de ', '');
            break;
        case 'route':
            address.calle = nombreLong;
            break;
        case 'street_number':
            address.numero = nombreLong;
            break;
        }
    }
    return address;
}

export function parseOsmStreet(result) {
    const address = {};
    address.pais = result.address.country;
    address.provincia = result.address.state.replace('Provincia de ', '');
    let ciudad = '';
    ciudad = result.address[result.type]
        ? result.address[result.type]
        : result.address.county
            ? result.address.county
            : result.address.city;
    ciudad.replace('Ciudad de ', '');
    ciudad.replace('Municipio de ', '');
    address.ciudad = ciudad;
    address.calle = '';
    address.numero = '';
    return address;
}
