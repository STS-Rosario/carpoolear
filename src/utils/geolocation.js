import { getLiveLocationGeolocationMessages } from './liveLocationGeolocationMessages.js';

let activeWatchId = null;
let activeAdapter = null;
let backgroundGeolocationPlugin = null;
let appStateListener = null;

const BACKGROUND_DISTANCE_FILTER_METERS = 30;

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
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    callback(coords);
                },
                (_error) => undefined,
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

async function loadBackgroundGeolocation() {
    if (!backgroundGeolocationPlugin) {
        const { registerPlugin } = await import('@capacitor/core');
        backgroundGeolocationPlugin = registerPlugin('BackgroundGeolocation');
    }
    return backgroundGeolocationPlugin;
}

async function getBackgroundAdapter(watchOptions = {}) {
    const BackgroundGeolocation = await loadBackgroundGeolocation();
    const messages =
        watchOptions.messages ?? getLiveLocationGeolocationMessages();

    return {
        name: 'background',
        async requestPermission() {
            const { Geolocation } = await import('@capacitor/geolocation');
            const status = await Geolocation.requestPermissions();
            if (
                status.location !== 'granted' &&
                status.coarseLocation !== 'granted'
            ) {
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
            return BackgroundGeolocation.addWatcher(
                {
                    backgroundTitle: messages.backgroundTitle,
                    backgroundMessage: messages.backgroundMessage,
                    requestPermissions: true,
                    stale: false,
                    distanceFilter: BACKGROUND_DISTANCE_FILTER_METERS
                },
                (location, error) => {
                    if (error || !location) {
                        return;
                    }
                    const coords = {
                        lat: location.latitude,
                        lng: location.longitude
                    };
                    callback(coords);
                }
            );
        },
        clearWatch(watchId) {
            if (watchId != null) {
                BackgroundGeolocation.removeWatcher({ id: watchId });
            }
        }
    };
}

export function isNativePlatform() {
    return (
        typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()
    );
}

export function getGeolocationAdapter() {
    return getWebAdapter();
}

async function resolveAdapter(watchOptions) {
    if (isNativePlatform()) {
        return getBackgroundAdapter(watchOptions);
    }
    return getWebAdapter();
}

export async function requestLocationPermission(watchOptions) {
    const adapter = await resolveAdapter(watchOptions);
    activeAdapter = adapter;
    return adapter.requestPermission();
}

export async function startLocationWatch(callback, watchOptions) {
    const adapter = await resolveAdapter(watchOptions);
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
    clearLiveLocationAppLifecycle();
}

export function registerLiveLocationAppLifecycle(onResume) {
    clearLiveLocationAppLifecycle();
    if (!isNativePlatform() || typeof onResume !== 'function') {
        return;
    }

    import('@capacitor/app').then(({ App }) => {
        appStateListener = App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
                onResume();
            }
        });
    });
}

export function clearLiveLocationAppLifecycle() {
    if (appStateListener) {
        appStateListener.remove();
        appStateListener = null;
    }
}
