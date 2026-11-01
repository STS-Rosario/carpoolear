import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './liveLocationMap.css';
import { ensureLeafletDefaultIconImages } from './leafletIcons.js';
import { createLiveLocationMarkerUpdater } from './liveLocationMapHelpers.js';
import {
    bindLiveLocationMapZoomPersistence,
    getLiveLocationMapZoom
} from './liveLocationMapZoom.js';
import { addVectorTileLayer } from './mapTiles.js';

export { createLiveLocationMarkerUpdater };

export async function createLiveLocationMap(container, lat, lng, options = {}) {
    ensureLeafletDefaultIconImages();
    const storage = options.storage;
    const initialZoom = getLiveLocationMapZoom(storage);
    const map = L.map(container, {
        zoomControl: true,
        attributionControl: true
    }).setView([lat, lng], initialZoom);

    await addVectorTileLayer(map);

    const marker = L.marker([lat, lng]).addTo(map);
    bindLiveLocationMapZoomPersistence(map, storage);
    map.invalidateSize();

    return { map, marker };
}

export function destroyLiveLocationMap(map) {
    if (map) {
        map.remove();
    }
}
