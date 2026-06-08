export const LIVE_LOCATION_MAP_ZOOM_KEY = 'liveLocationMapZoom';
export const LIVE_LOCATION_MAP_DEFAULT_ZOOM = 14;
export const LIVE_LOCATION_MAP_MIN_ZOOM = 1;
export const LIVE_LOCATION_MAP_MAX_ZOOM = 19;

function createMemoryStorage() {
    const values = new Map();

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        }
    };
}

export function resolveLiveLocationMapStorage(storage) {
    if (storage) {
        return storage;
    }

    if (typeof localStorage !== 'undefined') {
        return localStorage;
    }

    return createMemoryStorage();
}

export function getLiveLocationMapZoom(storage) {
    const resolvedStorage = resolveLiveLocationMapStorage(storage);
    const saved = resolvedStorage.getItem(LIVE_LOCATION_MAP_ZOOM_KEY);
    const parsed = Number(saved);

    if (
        Number.isFinite(parsed) &&
        parsed >= LIVE_LOCATION_MAP_MIN_ZOOM &&
        parsed <= LIVE_LOCATION_MAP_MAX_ZOOM
    ) {
        return parsed;
    }

    return LIVE_LOCATION_MAP_DEFAULT_ZOOM;
}

export function saveLiveLocationMapZoom(zoom, storage) {
    const parsed = Number(zoom);

    if (
        !Number.isFinite(parsed) ||
        parsed < LIVE_LOCATION_MAP_MIN_ZOOM ||
        parsed > LIVE_LOCATION_MAP_MAX_ZOOM
    ) {
        return;
    }

    resolveLiveLocationMapStorage(storage).setItem(
        LIVE_LOCATION_MAP_ZOOM_KEY,
        String(Math.round(parsed))
    );
}

export function bindLiveLocationMapZoomPersistence(map, storage) {
    map.on('zoomend', () => {
        saveLiveLocationMapZoom(map.getZoom(), storage);
    });
}
