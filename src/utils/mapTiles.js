import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_MAP_STYLE_URL = process.env.VUE_APP_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';
const DEFAULT_ATTRIBUTION = process.env.VUE_APP_MAP_ATTRIBUTION || '© OpenFreeMap, © OpenMapTiles, © OpenStreetMap contributors';

export function getMapTileConfig() {
    return {
        style: DEFAULT_MAP_STYLE_URL,
        attribution: DEFAULT_ATTRIBUTION
    };
}

export function addVectorTileLayer(map) {
    const config = getMapTileConfig();
    const layer = L.maplibreGL({
        style: config.style,
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
