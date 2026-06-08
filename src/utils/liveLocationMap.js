import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ensureLeafletDefaultIconImages } from './leafletIcons.js';
import { createLiveLocationMarkerUpdater } from './liveLocationMapHelpers.js';
import {
    bindLiveLocationMapZoomPersistence,
    getLiveLocationMapZoom
} from './liveLocationMapZoom.js';

export { createLiveLocationMarkerUpdater };

export function createLiveLocationMap(container, lat, lng, options = {}) {
    ensureLeafletDefaultIconImages();
    const storage = options.storage;
    const initialZoom = getLiveLocationMapZoom(storage);
    const map = L.map(container, {
        zoomControl: true,
        attributionControl: true
    }).setView([lat, lng], initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

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
