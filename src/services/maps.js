export function deg2rad (deg) {
    return deg * (Math.PI / 180);
}

export function pointDistance (lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000.0; // Distance in km
    return isNaN(d) ? 1000 : d;
}

export function parseStreet (result) {
    var address = {};
    for (var i in result.address_components) {
        var obj = result.address_components[i];
        var nombreLong = obj.long_name;
        var nombreShort = obj.short_name;
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
        };
    }
    return address;
};
