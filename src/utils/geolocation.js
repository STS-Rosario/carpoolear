let activeWatchId = null;
let activeAdapter = null;

function getWebAdapter() {
    return {
        name: 'web',
        async requestPermission() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('geolocation_unavailable'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => reject(error),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            });
        },
        startWatch(callback) {
            if (!navigator.geolocation) {
                return null;
            }
            return navigator.geolocation.watchPosition(
                (position) => {
                    callback({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {},
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        },
        clearWatch(watchId) {
            if (navigator.geolocation && watchId != null) {
                navigator.geolocation.clearWatch(watchId);
            }
        }
    };
}

async function getCapacitorAdapter() {
    const { Geolocation } = await import('@capacitor/geolocation');

    return {
        name: 'capacitor',
        async requestPermission() {
            const status = await Geolocation.requestPermissions();
            if (status.location !== 'granted' && status.coarseLocation !== 'granted') {
                throw new Error('permission_denied');
            }
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true
            });
            return {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        },
        async startWatch(callback) {
            return Geolocation.watchPosition(
                { enableHighAccuracy: true },
                (position, err) => {
                    if (err || !position) {
                        return;
                    }
                    callback({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }
            );
        },
        clearWatch(watchId) {
            if (watchId != null) {
                Geolocation.clearWatch({ id: watchId });
            }
        }
    };
}

function isNativePlatform() {
    return (
        typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()
    );
}

export function getGeolocationAdapter() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
        return getWebAdapter();
    }
    return getWebAdapter();
}

async function resolveAdapter() {
    if (isNativePlatform()) {
        return getCapacitorAdapter();
    }
    return getGeolocationAdapter();
}

export async function requestLocationPermission() {
    const adapter = await resolveAdapter();
    activeAdapter = adapter;
    return adapter.requestPermission();
}

export async function startLocationWatch(callback) {
    const adapter = await resolveAdapter();
    activeAdapter = adapter;
    activeWatchId = await adapter.startWatch(callback);
    return activeWatchId;
}

export function clearLocationWatch() {
    if (activeAdapter && activeWatchId != null) {
        activeAdapter.clearWatch(activeWatchId);
    }
    activeWatchId = null;
    activeAdapter = null;
}
