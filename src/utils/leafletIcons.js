import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png?url';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png?url';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url';
import originMarkerUrl from '../../static/img/origin-marker.png?url';
import destinyMarkerUrl from '../../static/img/destiny-marker.png?url';

let defaultIconsFixed = false;

const tripEndpointShadow = {
    shadowUrl,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
};

/** 32×32 PNGs in static/img (same sources as $publicImg); ?url avoids broken paths on native/hash routes. */
const tripOriginIcon = L.icon({
    iconUrl: originMarkerUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
    ...tripEndpointShadow
});

const tripDestinyIcon = L.icon({
    iconUrl: destinyMarkerUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
    ...tripEndpointShadow
});

/**
 * Leaflet's built-in marker images resolve to broken paths after bundling.
 * leaflet-routing-machine uses L.Marker with the default icon unless overridden.
 */
export function ensureLeafletDefaultIconImages() {
    if (defaultIconsFixed) {
        return;
    }
    defaultIconsFixed = true;
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl,
        iconRetinaUrl,
        shadowUrl
    });
}

/**
 * Icons for trip route waypoints: origin, destination, and default for intermediates.
 * @param {number} index - waypoint index
 * @param {number} count - total waypoints
 * @returns {L.Icon}
 */
export function tripWaypointIcon(index, count) {
    ensureLeafletDefaultIconImages();
    if (index === 0) {
        return tripOriginIcon;
    }
    if (index === count - 1) {
        return tripDestinyIcon;
    }
    return new L.Icon.Default();
}
