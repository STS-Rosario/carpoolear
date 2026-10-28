import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import { patchLibertyStyleForSpanishLabels } from './mapStyleSpanishLabels.js';

const DEFAULT_MAP_STYLE_URL = process.env.VUE_APP_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';
const DEFAULT_ATTRIBUTION = process.env.VUE_APP_MAP_ATTRIBUTION || '© OpenFreeMap, © OpenMapTiles, © OpenStreetMap contributors';

/** @type {Promise<object> | null} */
let patchedStylePromise = null;

export function getMapTileConfig() {
    return {
        style: DEFAULT_MAP_STYLE_URL,
        attribution: DEFAULT_ATTRIBUTION
    };
}

export function resetPatchedMapStyleCache() {
    patchedStylePromise = null;
}

export function loadPatchedMapStyle() {
    const styleUrl = getMapStyleUrl();
    if (!patchedStylePromise) {
        patchedStylePromise = fetch(styleUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Map style fetch failed: ${response.status} ${styleUrl}`);
                }
                return response.json();
            })
            .then((style) => patchLibertyStyleForSpanishLabels(style));
    }
    return patchedStylePromise;
}

export async function addVectorTileLayer(map) {
    const config = getMapTileConfig();
    const style = await loadPatchedMapStyle();
    const layer = L.maplibreGL({
        style,
        attribution: config.attribution
    }).addTo(map);
    return layer;
}

export function getMapAttribution() {
    return getMapTileConfig().attribution;
}

export function getMapStyleUrl() {
    return getMapTileConfig().style;
}
