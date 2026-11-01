import L from 'leaflet';

const DEFAULT_WAYPOINT_FIT_OPTIONS = {
    padding: [24, 24],
    maxZoom: 12
};

export function fitLeafletMapToLatLngs(map, latLngs, options = {}) {
    if (!map || !latLngs || latLngs.length === 0) {
        return;
    }
    const bounds = L.latLngBounds(latLngs);
    if (!bounds.isValid()) {
        return;
    }
    map.fitBounds(bounds, { ...DEFAULT_WAYPOINT_FIT_OPTIONS, ...options });
}

export function bindRoutingWaypointFitOnError(routingControl, map, latLngs) {
    if (!routingControl || !map || typeof routingControl.on !== 'function') {
        return;
    }
    routingControl.on('routingerror', () => {
        fitLeafletMapToLatLngs(map, latLngs);
    });
}
