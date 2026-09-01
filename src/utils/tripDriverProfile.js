export function getTripDriverProfileId(trip, authUser) {
    const driver = trip?.user;
    if (!driver) {
        return null;
    }
    if (!authUser || authUser.id == null) {
        return driver.id;
    }
    return authUser.id === driver.id ? 'me' : driver.id;
}

export function getTripDriverImage(trip, authUser) {
    const driver = trip?.user;
    if (!driver) {
        return '';
    }
    if (!authUser || authUser.id == null) {
        return driver.image || '';
    }
    return authUser.id === driver.id ? authUser.image : driver.image;
}
