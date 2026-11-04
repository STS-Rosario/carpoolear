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

export function fitLeafletMapToOsrmRoutes(map, routes, options = {}) {
    if (!map || !Array.isArray(routes) || routes.length === 0) {
        return;
    }
    const latLngs = [];
    for (const route of routes) {
        if (route && Array.isArray(route.coordinates)) {
            latLngs.push(...route.coordinates);
        }
    }
    fitLeafletMapToLatLngs(map, latLngs, options);
}

export function bindRoutingMapFitOnRoutesFound(routingControl, map, latLngs) {
    if (!routingControl || !map || typeof routingControl.on !== 'function') {
        return;
    }
    routingControl.on('routesfound', (event) => {
        if (event.routes && event.routes.length > 0) {
            fitLeafletMapToOsrmRoutes(map, event.routes);
        } else {
            fitLeafletMapToLatLngs(map, latLngs);
        }
    });
}

export function bindRoutingWaypointFitOnError(routingControl, map, latLngs) {
    if (!routingControl || !map || typeof routingControl.on !== 'function') {
        return;
    }
    routingControl.on('routingerror', () => {
        fitLeafletMapToLatLngs(map, latLngs);
    });
}
